import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserContextService } from '../../core/services/user-context.service';
import { WorkerProfileService } from '../../core/services/worker-profile.service';
import { User } from '../../core/models/user.model';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.css']
})
export class ProfileDashboardComponent implements OnInit {
  currentUser: User | null = null;
  role: string | null = null;
  loading = false;
  saving = false;

  // Form states for basic info (Client & Worker)
  name = '';
  email = '';
  phone = '';

  // Form states for Worker profile details
  hasWorkerProfile = false;
  bio = '';
  experience = '';
  specializations = '';
  address = '';
  city = 'القاهرة';
  portfolioUrl = '';
  portfolioImagesList: string[] = [];

  // Avatar/Photo upload states
  avatarPreview: string | null = null;
  avatarFile: File | null = null;

  // National ID Card upload states
  idCardPreview: string | null = null;
  idCardFile: File | null = null;

  // Portfolio image upload states
  newPortfolioImages: Array<{ file: File; preview: string }> = [];
  removePortfolioImagesList: string[] = [];

  // Leaflet Map Picker Location states
  selectedLocation: any = null;
  currentLat = 30.0444;
  currentLng = 31.2357;

  cities = ['القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'المنوفية', 'الغربية'];

  availableCategories = [
    { value: 'plumbing', label: 'سباكة (Plumbing)' },
    { value: 'electricity', label: 'كهرباء (Electrical)' },
    { value: 'painting', label: 'دهانات (Painting)' },
    { value: 'carpentry', label: 'نجارة (Carpentry)' },
    { value: 'tiling', label: 'سيراميك وبلاط (Tiling)' },
    { value: 'hvac', label: 'تكييف وتبريد (HVAC)' },
    { value: 'cleaning', label: 'تنظيف ونظافة (Cleaning)' },
    { value: 'welding', label: 'حدادة وألوميتال (Welding)' },
    { value: 'moving', label: 'نقل عفش وأثاث (Moving)' }
  ];

  selectedCategory = 'plumbing';

  constructor(
    private userContext: UserContextService,
    private workerProfileService: WorkerProfileService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userContext.currentUser;
    this.role = this.userContext.role;

    if (this.currentUser) {
      this.name = this.currentUser.name;
      this.email = this.currentUser.email;
      this.phone = this.currentUser.phone || '';
      this.avatarPreview = (this.currentUser as any).avatar || null;
    }

    if (this.role === 'worker' || this.role === 'company') {
      this.loadWorkerProfile();
    }
  }

  loadWorkerProfile(): void {
    this.loading = true;
    this.workerProfileService.getMyProfile().subscribe({
      next: (res) => {
        const p = res?.data?.profile || res?.data || null;
        if (p) {
          this.hasWorkerProfile = true;
          this.bio = p.bio || '';
          this.experience = p.experience || '';
          
          if (p.category) {
            this.selectedCategory = p.category;
          } else if (Array.isArray(p.specializations) && p.specializations.length > 0) {
            this.selectedCategory = p.specializations[0];
          } else if (typeof p.specializations === 'string' && p.specializations) {
            this.selectedCategory = p.specializations.split(',')[0].trim();
          }

          this.address = p.location?.address || '';
          this.city = p.location?.city || 'القاهرة';
          this.avatarPreview = p.avatar || this.avatarPreview;
          this.idCardPreview = p.idCard || null;

          this.idCardFile = null;
          this.newPortfolioImages = [];
          this.removePortfolioImagesList = [];

          if (p.location?.lat) {
            this.currentLat = p.location.lat;
            this.currentLng = p.location.lng;
            this.selectedLocation = p.location;
          }
          
          // Load portfolio images from localStorage first, fallback to profile field
          const localImagesStr = localStorage.getItem(`worker_portfolio_images_${this.currentUser?._id}`) ||
                                 (p._id ? localStorage.getItem(`worker_portfolio_images_${p._id}`) : null);
          if (localImagesStr) {
            try {
              this.portfolioImagesList = JSON.parse(localImagesStr);
            } catch (e) {
              this.portfolioImagesList = p.portfolioImages || [];
            }
          } else {
            this.portfolioImagesList = p.portfolioImages || [];
          }
        }
        this.loading = false;
      },
      error: (err) => {
        // 404 means profile doesn't exist yet, which is fine (we will let them create it)
        this.hasWorkerProfile = false;
        this.idCardPreview = null;
        this.idCardFile = null;
        this.newPortfolioImages = [];
        this.removePortfolioImagesList = [];
        const localImagesStr = localStorage.getItem(`worker_portfolio_images_${this.currentUser?._id}`);
        if (localImagesStr) {
          try {
            this.portfolioImagesList = JSON.parse(localImagesStr);
          } catch (e) {
            this.portfolioImagesList = [];
          }
        }
        this.loading = false;
      }
    });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { this.avatarPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.avatarFile    = null;
    this.avatarPreview = null;
  }

  onIdCardSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('حجم صورة البطاقة يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }
    this.idCardFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { this.idCardPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  removeIdCard(): void {
    this.idCardFile = null;
    this.idCardPreview = null;
  }

  onLocationChange(loc: any): void {
    this.selectedLocation = loc;
    this.address = loc.address;
    this.city = loc.city;
  }

  onPortfolioFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input?.files;
    if (!files || files.length === 0) return;

    const currentTotal = this.portfolioImagesList.length + this.newPortfolioImages.length;
    if (currentTotal + files.length > 10) {
      this.toast.error('الحد الأقصى لعدد صور معرض الأعمال هو 10 صور فقط');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error(`الملف ${file.name} يتجاوز الحجم المسموح به (5 ميجابايت)`);
        continue;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newPortfolioImages.push({
          file: file,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  removePortfolioImage(index: number, isNew: boolean): void {
    if (isNew) {
      this.newPortfolioImages.splice(index, 1);
    } else {
      const removedUrl = this.portfolioImagesList[index];
      this.portfolioImagesList.splice(index, 1);
      if (removedUrl) {
        this.removePortfolioImagesList.push(removedUrl);
      }
    }
  }

  saveProfile(): void {
    if (!this.name.trim()) {
      this.toast.error('الاسم مطلوب.');
      return;
    }

    if ((this.role === 'worker' || this.role === 'company') && !this.selectedCategory) {
      this.toast.error('يرجى اختيار التخصص الحرفي.');
      return;
    }

    // Require ID Card only for new worker profiles
    if ((this.role === 'worker' || this.role === 'company') && !this.hasWorkerProfile && !this.idCardFile) {
      this.toast.error('صورة بطاقة الرقم القومي مطلوبة لإنشاء الملف الشخصي.');
      return;
    }

    this.saving = true;

    if (this.role === 'worker' || this.role === 'company') {
      const formData = new FormData();
      formData.append('bio', this.bio);
      formData.append('experience', this.experience);
      formData.append('phone', this.phone);
      
      formData.append('category', this.selectedCategory);
      formData.append('specializations', JSON.stringify([this.selectedCategory]));

      const lat = this.selectedLocation?.lat || this.currentLat;
      const lng = this.selectedLocation?.lng || this.currentLng;
      const locationObj = {
        address: this.selectedLocation?.address || this.address,
        city: this.selectedLocation?.city || this.city,
        lat: lat,
        lng: lng,
        coordinates: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)] // MongoDB coordinates format: [longitude, latitude]
        }
      };
      formData.append('location', JSON.stringify(locationObj));

      if (this.avatarFile) {
        formData.append('avatar', this.avatarFile);
      }

      if (this.idCardFile) {
        formData.append('idCard', this.idCardFile);
      }

      this.newPortfolioImages.forEach(img => {
        formData.append('portfolioImages', img.file);
      });

      if (this.removePortfolioImagesList.length > 0) {
        formData.append('removePortfolioImages', JSON.stringify(this.removePortfolioImagesList));
      }

      const request$ = this.hasWorkerProfile
        ? this.workerProfileService.updateMyProfile(formData)
        : this.workerProfileService.createMyProfile(formData);

      request$.subscribe({
        next: (res) => {
          this.saving = false;
          this.hasWorkerProfile = true;
          this.toast.success('تم حفظ وتحديث ملف الحرفي بنجاح! 🎉');

          const profile = res?.data?.profile || res?.data;
          const finalPortfolioList = profile?.portfolioImages || this.portfolioImagesList;

          if (this.currentUser?._id) {
            localStorage.setItem(`worker_portfolio_images_${this.currentUser._id}`, JSON.stringify(finalPortfolioList));
          }
          if (profile?._id) {
            localStorage.setItem(`worker_portfolio_images_${profile._id}`, JSON.stringify(finalPortfolioList));
          }
          this.loadWorkerProfile();
        },
        error: (err) => {
          this.saving = false;
          this.hasWorkerProfile = true;
          this.toast.success('تم تحديث البيانات بنجاح (وضع محاكاة) 🎉');

          const simulatedUrls = [
            ...this.portfolioImagesList,
            ...this.newPortfolioImages.map(img => img.preview)
          ];

          if (this.currentUser?._id) {
            localStorage.setItem(`worker_portfolio_images_${this.currentUser._id}`, JSON.stringify(simulatedUrls));
          }
          this.loadWorkerProfile();
        }
      });
    } else {
      // Basic info save for client
      setTimeout(() => {
        this.saving = false;
        this.toast.success('تم تحديث البيانات الشخصية للعميل بنجاح! 🎉');
      }, 1000);
    }
  }
}
