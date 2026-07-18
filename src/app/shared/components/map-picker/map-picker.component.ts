import {
  Component, Input, Output, EventEmitter,
  AfterViewInit, OnChanges, SimpleChanges,
  OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface MapLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
}

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-picker-wrap relative">
      <div #mapContainer class="map-container" [style.height]="height"></div>
      
      <!-- Floating GPS/Geolocation button -->
      <button 
        type="button" 
        (click)="useCurrentLocation($event)"
        class="geolocation-btn absolute top-3 right-3 z-[1000] flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-md hover:bg-slate-50 hover:shadow-lg active:scale-95 transition-all duration-200 text-[#1B2B6E] group"
        title="تحديد موقعي الحالي"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-45 transition-transform duration-300">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
        </svg>
      </button>

      <div *ngIf="selectedLocation" class="map-selected-info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <span>{{ selectedLocation.address || (selectedLocation.lat.toFixed(4) + ', ' + selectedLocation.lng.toFixed(4)) }}</span>
      </div>
      <div *ngIf="!selectedLocation" class="map-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        اضغط على الخريطة لتحديد موقعك أو زر تحديد الموقع
      </div>
    </div>
  `,
  styles: [`
    .map-picker-wrap { display: flex; flex-direction: column; gap: 8px; position: relative; }
    .map-container { width: 100%; border-radius: 12px; overflow: hidden; border: 2px solid #e2e8f0; transition: border-color 0.2s; }
    .map-container:hover { border-color: #DFBA6B; }
    .geolocation-btn {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .geolocation-btn:hover {
      color: #DFBA6B;
    }
    .map-selected-info {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; color: #1B2B6E;
      background: #f0f4ff; border-radius: 8px; padding: 8px 12px;
      border: 1px solid #c7d2fe; font-family: 'Cairo', sans-serif;
    }
    .map-hint {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #94a3b8; font-family: 'Cairo', sans-serif;
      padding: 6px 4px;
    }
  `]
})
export class MapPickerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  @Input() lat = 30.0444;      // Default: Cairo
  @Input() lng = 31.2357;
  @Input() height = '280px';
  @Input() zoom = 12;

  @Output() locationChange = new EventEmitter<MapLocation>();

  selectedLocation: MapLocation | null = null;

  private map: any = null;
  private marker: any = null;
  private L: any = null;
  private isBrowser: boolean;
  private resizeObserver: ResizeObserver | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Small delay to allow the container to render in modals
      setTimeout(() => this.initMap(), 50);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['lat'] || changes['lng']) && this.map) {
      this.map.setView([this.lat, this.lng], this.zoom);
    }
  }

  private async initMap(): Promise<void> {
    try {
      const leafletModule = await import('leaflet');
      const L = (leafletModule as any).default || leafletModule;
      this.L = L;

      // Fix default icon paths for Angular bundler
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (this.map) {
        this.map.remove();
      }

      this.map = L.map(this.mapContainer.nativeElement, {
        center: [this.lat, this.lng],
        zoom: this.zoom,
        attributionControl: false
      });

      // Premium dark tiles via CartoDB
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map);

      // Auto-resize fix for modals
      this.resizeObserver = new ResizeObserver(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      });
      this.resizeObserver.observe(this.mapContainer.nativeElement);

      // Click to place marker
      this.map.on('click', (e: any) => this.onMapClick(e.latlng));

      // Always show the marker and fetch the address at the initial coordinates
      this.placeMarker(this.lat, this.lng);
      this.reverseGeocode(this.lat, this.lng);
    } catch (err) {
      console.error('[MapPicker] Failed to init Leaflet:', err);
    }
  }

  private onMapClick(latlng: { lat: number; lng: number }): void {
    this.placeMarker(latlng.lat, latlng.lng);
    this.reverseGeocode(latlng.lat, latlng.lng);
  }

  private placeMarker(lat: number, lng: number): void {
    if (!this.L || !this.map) return;
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = this.L.marker([lat, lng], { draggable: true }).addTo(this.map);
      this.marker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng();
        this.reverseGeocode(pos.lat, pos.lng);
      });
    }
  }

  private reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`)
      .then(r => r.json())
      .then(data => {
        const address = data.display_name?.split(',').slice(0, 3).join('، ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const city = data.address?.city || data.address?.state || data.address?.county || 'القاهرة';
        const loc: MapLocation = { lat, lng, address, city };
        this.selectedLocation = loc;
        this.locationChange.emit(loc);
      })
      .catch(() => {
        const loc: MapLocation = { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, city: 'القاهرة' };
        this.selectedLocation = loc;
        this.locationChange.emit(loc);
      });
  }

  useCurrentLocation(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع الجغرافي');
      return;
    }

    const successCallback = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      if (this.map) {
        this.map.setView([lat, lng], 15);
        this.placeMarker(lat, lng);
        this.reverseGeocode(lat, lng);
      }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.warn('[MapPicker] Geolocation error or timeout, trying with low accuracy fallback...', error);
      // Fallback: request geolocation with low accuracy (ideal for desktop / IP-based location)
      navigator.geolocation.getCurrentPosition(
        successCallback,
        (fallbackError) => {
          console.error('[MapPicker] Fallback geolocation failed:', fallbackError);
          alert('فشل في تحديد موقعك الحالي. يرجى تفعيل إذن الوصول للموقع في المتصفح.');
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    };

    // Try with high accuracy first
    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 0 }
    );
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
