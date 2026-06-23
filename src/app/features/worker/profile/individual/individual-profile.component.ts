import { Component, OnInit } from '@angular/core';
import { WorkerProfileService } from '../../../../core/services/worker-profile.service';
import { ToastService } from '@m3allem/ui-kit';
import { MapLocation } from '../../../../shared/components/map-picker/map-picker.component';

@Component({
  selector: 'app-individual-profile',
  templateUrl: './individual-profile.component.html',
  styleUrls: ['./individual-profile.component.css']
})
export class IndividualProfileComponent implements OnInit {
  loading    = false;
  submitting = false;

  // Profile fields
  displayName      = '';
  bio              = '';
  specializations: string[] = [];
  yearsExperience  = 0;
  hourlyRate       = 0;

  // Avatar / Photo
  avatarPreview: string | null = null;
  avatarFile: File | null = null;

  // Location
  selectedLocation: MapLocation | null = null;
  currentLat = 30.0444;
  currentLng = 31.2357;

  existingProfile: any = null;

  readonly specializationOptions = [
    { value: 'plumbing',     label: '🔧 سباكة' },
    { value: 'electricity',  label: '⚡ كهرباء' },
    { value: 'painting',     label: '🎨 دهانات' },
    { value: 'carpentry',    label: '🪚 نجارة' },
    { value: 'tiling',       label: '🧱 سيراميك وبلاط' },
    { value: 'hvac',         label: '❄️ تكييف وتبريد' },
    { value: 'cleaning',     label: '🧹 تنظيف' },
    { value: 'welding',      label: '🔥 حدادة ولحام' },
    { value: 'moving',       label: '📦 نقل عفش' }
  ];

  constructor(
    private workerProfileService: WorkerProfileService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.workerProfileService.getMyProfile().subscribe({
      next: (res) => {
        const p = res?.data?.profile || res?.data || null;
        if (p) {
          this.existingProfile = p;
          this.displayName     = p.user?.name || '';
          this.bio             = p.bio || '';
          this.specializations = p.specializations || [];
          this.yearsExperience = p.yearsExperience || 0;
          this.hourlyRate      = p.hourlyRate || 0;
          this.avatarPreview   = p.avatar || null;
          if (p.location?.lat) {
            this.currentLat = p.location.lat;
            this.currentLng = p.location.lng;
            this.selectedLocation = p.location;
          }
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
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

  onLocationChange(loc: MapLocation): void {
    this.selectedLocation = loc;
  }

  toggleSpecialization(value: string): void {
    const idx = this.specializations.indexOf(value);
    if (idx === -1) {
      this.specializations = [...this.specializations, value];
    } else {
      this.specializations = this.specializations.filter(s => s !== value);
    }
  }

  isSelected(value: string): boolean {
    return this.specializations.includes(value);
  }

  saveProfile(): void {
    if (this.submitting) return;
    this.submitting = true;

    const formData = new FormData();
    formData.append('bio', this.bio);
    formData.append('yearsExperience', String(this.yearsExperience));
    formData.append('hourlyRate', String(this.hourlyRate));
    this.specializations.forEach(s => formData.append('specializations[]', s));

    if (this.selectedLocation) {
      formData.append('location[lat]',     String(this.selectedLocation.lat));
      formData.append('location[lng]',     String(this.selectedLocation.lng));
      formData.append('location[address]', this.selectedLocation.address);
      formData.append('location[city]',    this.selectedLocation.city);
    }

    if (this.avatarFile) {
      formData.append('avatar', this.avatarFile);
    }

    const save$ = this.existingProfile
      ? this.workerProfileService.updateMyProfile(formData)
      : this.workerProfileService.createMyProfile(formData);

    save$.subscribe({
      next: () => {
        this.toast.success('تم حفظ الملف الشخصي بنجاح ✅');
        this.submitting = false;
        this.loadProfile();
      },
      error: () => {
        this.toast.error('فشل حفظ الملف الشخصي. يرجى المحاولة لاحقاً.');
        this.submitting = false;
      }
    });
  }
}
