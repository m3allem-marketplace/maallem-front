import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Item, ShopInfo } from '../../shared/models/item.model';
import { StoreApiService } from '../../services/store-api.service';
import { replaceImagesWithDynamicUrl } from '../utils/product-image-overrides';

// ─── Supporting Interfaces ────────────────────────────────────────────────────

export interface ShopWithProducts {
  shopId: string;
  nameAr: string;
  address: string;
  rating: number;
  deliveryTime: string;
  products: Item[];
}

export interface CategoryShops {
  categoryEnglish: string;
  categoryArabic: string;
  shops: ShopWithProducts[];
}

export interface CartItem {
  item: Item;
  quantity: number;
}

/**
 * Matches the exact JSON body accepted by POST /api/orders
 */
export interface OrderApiPayload {
  customerName: string;  // shopper's full name
  customerPhone?: string; // shopper's phone number
  phone?:        string; // alias in case backend uses phone
  productId:    string;  // product _id
  quantity:     number;
  location:     string;  // human-readable address / city
  latitude:     number;  // WGS-84 latitude  (0 if not available)
  longitude:    number;  // WGS-84 longitude (0 if not available)
  paymentMethod?: string;
}

/**
 * Internal payload built by CheckoutComponent and consumed by placeOrder()
 */
export interface OrderPayload {
  items:            CartItem[];
  customerName:     string;
  customerPhone:    string;
  location:         string;
  latitude:         number;
  longitude:        number;
  paymentMethod:    string;
}

export interface OrderReceipt {
  orderId:           string;
  _id?:              string;
  id?:               string;
  totalAmount:       number;
  estimatedDelivery: string;
  status:            'confirmed' | 'pending' | string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class EcommerceService {
  private productsCache$: Observable<Item[]> | null = null;
  private shopsCache$: Observable<CategoryShops[]> | null = null;
  private readonly productImageCloudBaseUrl = 'https://res.cloudinary.com/duq0xgmg1/image/upload/f_auto,q_auto/m3allem_categories';

  // ── Cart State ───────────────────────────────────────────────────────────────
  private readonly CART_STORAGE_KEY = 'm3allem_cart';
  cartItems$ = new BehaviorSubject<CartItem[]>(this.getInitialCart());
  cart$      = this.cartItems$.asObservable();
  cartCount$ = this.cart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );
  isCartDrawerOpen$ = new BehaviorSubject<boolean>(false);

  constructor(private api: StoreApiService) {
    // Persist cart state to localStorage whenever it changes
    this.cartItems$.subscribe(items => {
      try {
        localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    });
  }

  private getInitialCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Basic runtime type check to ensure the parsed data looks like CartItem[]
          const isValid = parsed.every(ci => 
            ci && typeof ci === 'object' && ci.item && typeof ci.quantity === 'number'
          );
          if (isValid) {
            return parsed as CartItem[];
          } else {
            console.warn('Cart data in localStorage is invalid, starting with empty cart.');
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    }
    return [];
  }

  // ── Product Fetching ─────────────────────────────────────────────────────────

  getProducts(search?: string, category?: string): Observable<Item[]> {
    if (this.productsCache$) {
      return this.productsCache$;
    }

    let endpoint = '/products/store';
    const obs$ = this.api.get<unknown>(endpoint).pipe(
      map(response => this.mapProductsResponse(response)),
      shareReplay(1)
    );
    this.productsCache$ = obs$;

    return obs$;
  }

  getProductById(id: string): Observable<Item> {
    return this.getProducts().pipe(
      map(products => {
        const found = products.find(p => p._id === id);
        if (!found) {
          throw new Error('Product not found');
        }
        return found;
      })
    );
  }

  getShopsByCategory(): Observable<CategoryShops[]> {
    if (this.shopsCache$) {
      return this.shopsCache$;
    }

    const obs$ = this.api.get<unknown>('/products/store').pipe(
      map(response => this.extractResponseArray(response)),
      map((categories: any[]) => {
        const result: CategoryShops[] = [];
        (categories || []).forEach(cat => {
          const categoryName = cat.categoryId || cat.name || '';
          const mappedCategory = this.standardizeCategory(categoryName);
          const arabicCategory = this.getCategoryArabicName(mappedCategory);

          const shopMap = new Map<string, ShopWithProducts>();

          if (cat.products && Array.isArray(cat.products)) {
            cat.products.forEach((p: any) => {
              const shopData = p.shop;
              if (!shopData) return;

              const shopId = shopData.shop_id || shopData.shopId || p.owner || 'unknown';
              if (!shopMap.has(shopId)) {
                shopMap.set(shopId, {
                  shopId,
                  nameAr: shopData.name_ar || shopData.nameAr || 'محل غير معروف',
                  address: shopData.address || '',
                  rating: shopData.rating || 0,
                  deliveryTime: shopData.delivery_time || shopData.deliveryTime || '',
                  products: []
                });
              }

              const mappedProduct = this.mapItem({ ...p, category: mappedCategory });
              const productWithImage = replaceImagesWithDynamicUrl(
                [mappedProduct],
                this.productImageCloudBaseUrl
              )[0];
              shopMap.get(shopId)!.products.push(productWithImage);
            });
          }

          if (shopMap.size > 0) {
            result.push({
              categoryEnglish: mappedCategory,
              categoryArabic: arabicCategory,
              shops: Array.from(shopMap.values())
            });
          }
        });
        return result;
      }),
      shareReplay(1)
    );
    this.shopsCache$ = obs$;

    return obs$;
  }

  private mapProductsResponse(response: unknown): Item[] {
    const records = this.extractResponseArray(response);
    const products: Item[] = [];

    records.forEach(record => {
      if (Array.isArray(record?.products)) {
        const categoryName = record.categoryId || record.name || '';
        const mappedCategory = this.standardizeCategory(categoryName);

        record.products.forEach((product: any) => {
          products.push(this.mapItem({ ...product, category: mappedCategory }));
        });

        return;
      }

      products.push(this.mapItem(record));
    });

    return replaceImagesWithDynamicUrl(products, this.productImageCloudBaseUrl);
  }

  private extractResponseArray(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.products)) return response.products;
    if (Array.isArray(response?.categories)) return response.categories;
    if (Array.isArray(response?.data?.products)) return response.data.products;
    if (Array.isArray(response?.data?.categories)) return response.data.categories;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
  }

  private getCategoryArabicName(english: string): string {
    const map: { [key: string]: string } = {
      'Plumbing': 'سباكة', 'Carpentry': 'نجارة', 'Ceramics': 'سيراميك',
      'Painting': 'دهانات', 'Electrical': 'كهربا', 'HVAC': 'تكييف', 'Cleaning': 'تنظيف',
    };
    return map[english] || english;
  }

  private standardizeCategory(catName: string): string {
    const lower = catName.toLowerCase();
    if (lower.includes('plumb') || lower.includes('سباكة')) return 'Plumbing';
    if (lower.includes('carpenter') || lower.includes('نجارة') || lower.includes('خشب')) return 'Carpentry';
    if (lower.includes('ceramic') || lower.includes('سيراميك') || lower.includes('بلاط')) return 'Ceramics';
    if (lower.includes('paint') || lower.includes('دهان') || lower.includes('معجون')) return 'Painting';
    if (lower.includes('elect') || lower.includes('كهرب')) return 'Electrical';
    if (lower.includes('hvac') || lower.includes('تكييف') || lower.includes('هواء')) return 'HVAC';
    if (lower.includes('clean') || lower.includes('تنظيف')) return 'Cleaning';
    return catName;
  }

  private mapItem(backendItem: any): Item {
    const shopData = backendItem.shop;
    const shop: ShopInfo | undefined = shopData ? {
      shopId: shopData.shop_id || shopData.shopId || '',
      nameAr: shopData.name_ar || shopData.nameAr || '',
      address: shopData.address || '',
      rating: shopData.rating || 0,
      deliveryTime: shopData.delivery_time || shopData.deliveryTime || '',
    } : undefined;

    return {
      _id: backendItem._id || backendItem.id || '',
      supplierId: backendItem.supplierId || '',
      title: backendItem.title || backendItem.name || '',
      description: backendItem.description || '',
      price: Number(backendItem.price) || 0,
      stockQuantity: backendItem.stockQuantity !== undefined 
        ? backendItem.stockQuantity 
        : (backendItem.quantity !== undefined ? backendItem.quantity : 10),
      category: backendItem.category || 'Tools',
      subCategory: backendItem.sub_category || backendItem.subCategory || '',
      brand: backendItem.brand || '',
      currency: backendItem.currency || 'EGP',
      unit: backendItem.unit || '',
      imageUrl: this.getProductImageUrl(backendItem),
      shop,
      status: backendItem.status || 'active',
      createdAt: backendItem.createdAt || new Date().toISOString()
    };
  }

  private getProductImageUrl(backendItem: any): string {
    const directImage =
      backendItem.imageUrl ||
      backendItem.image_url ||
      backendItem.image ||
      backendItem.thumbnail ||
      backendItem.photo ||
      backendItem.picture;

    if (typeof directImage === 'string' && directImage.trim()) {
      return directImage.trim();
    }

    if (Array.isArray(backendItem.images)) {
      const firstImage = backendItem.images.find((image: unknown) => typeof image === 'string' && image.trim());
      if (typeof firstImage === 'string') {
        return firstImage.trim();
      }
    }

    return '';
  }

  // ── Cart Management ──────────────────────────────────────────────────────────

  addToCart(item: Item, quantity = 1): void {
    const current = this.cartItems$.getValue();
    const idx = current.findIndex(ci => ci.item._id === item._id);
    if (idx !== -1) {
      this.cartItems$.next(
        current.map((ci, i) => i === idx ? { ...ci, quantity: ci.quantity + quantity } : ci)
      );
    } else {
      this.cartItems$.next([...current, { item, quantity }]);
    }
  }

  removeFromCart(itemId: string): void {
    this.cartItems$.next(this.cartItems$.getValue().filter(ci => ci.item._id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) { this.removeFromCart(itemId); return; }
    this.cartItems$.next(
      this.cartItems$.getValue().map(ci => ci.item._id === itemId ? { ...ci, quantity } : ci)
    );
  }

  clearCart(): void { this.cartItems$.next([]); }

  getCartTotal(): number {
    return this.cartItems$.getValue().reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  }

  getCartItemsSnapshot(): CartItem[] {
    return this.cartItems$.getValue();
  }

  // ── Checkout ─────────────────────────────────────────────────────────────────

  /**
   * Sends one POST /orders request per cart item using the exact API payload:
   *   { customerName, productId, quantity, location, latitude, longitude }
   *
   * Uses forkJoin so that all requests are fired in parallel and we wait for
   * all of them to complete before emitting. Returns the first receipt.
   */
  placeOrder(orderPayload: OrderPayload): Observable<OrderReceipt> {
    const { items, customerName, customerPhone, location, latitude, longitude, paymentMethod } = orderPayload;

    const requests = items.map(ci => {
      const body: OrderApiPayload = {
        customerName,
        customerPhone,
        phone:     customerPhone,
        productId: ci.item._id,
        quantity:  ci.quantity,
        location,
        latitude,
        longitude,
        paymentMethod,
      };
      return this.api.post<OrderReceipt>('/orders', body);
    });

    return forkJoin(requests).pipe(
      map(receipts => receipts[0]),  // return receipt of first item
      // Explicitly re-throw so errors always reach the component's error callback
      catchError(err => throwError(() => err))
    );
  }

  getCustomerOrders(): Observable<any[]> {
    return this.api.get<any[]>('/orders/my-orders');
  }
}
