import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { ToastService } from '@m3allem/ui-kit';
import * as BookingActions from '../../../../store/booking/booking.actions';
import { selectAvailabilityUpdated, selectBookingLoading } from '../../../../store/booking/booking.selectors';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly profileService = inject(WorkerProfileService);
  private readonly toast = inject(ToastService);

  servicesForm!: FormGroup;
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  daysOfWeekAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  loading$ = this.store.select(selectBookingLoading);
  success$ = this.store.select(selectAvailabilityUpdated);

  availableServicesList = ['سباكة', 'كهرباء', 'صيانة عامة', 'نجارة', 'نقاشة', 'حدادة', 'تكييف وتبريد'];

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();

    this.success$.subscribe((updated) => {
      if (updated) {
        this.toast.success('تم تحديث جدول المواعيد والخدمات بنجاح');
      }
    });
  }

  private initForm(): void {
    this.servicesForm = this.fb.group({
      hourlyRate: [150, [Validators.required, Validators.min(50)]],
      offersFlatRate: [false],
      specializations: this.fb.array([]),
      availabilities: this.fb.array(
        this.daysOfWeek.map((day, index) => this.fb.group({
          dayOfWeek: [index],
          startTime: ['08:00', Validators.required],
          endTime: ['17:00', Validators.required],
          isActive: [false]
        }))
      )
    });
  }

  get availabilitiesFormArray(): FormArray {
    return this.servicesForm.get('availabilities') as FormArray;
  }

  get specializationsFormArray(): FormArray {
    return this.servicesForm.get('specializations') as FormArray;
  }

  private loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res: any) => {
        const profile = res?.data?.profile || res?.data || res;
        if (profile) {
          this.servicesForm.patchValue({
            hourlyRate: profile.hourlyRate || 150,
            offersFlatRate: profile.offersFlatRate || false
          });

          // Populate specializations
          const specs = profile.specializations || [];
          const specFormArray = this.specializationsFormArray;
          specFormArray.clear();
          specs.forEach((spec: string) => {
            specFormArray.push(this.fb.control(spec));
          });

          // Populate availabilities
          const avails = profile.availabilities || [];
          const availsFormArray = this.availabilitiesFormArray;
          avails.forEach((avail: any) => {
            const group = availsFormArray.controls.find(c => c.value.dayOfWeek === avail.dayOfWeek) as FormGroup;
            if (group) {
              group.patchValue({
                startTime: avail.startTime || '08:00',
                endTime: avail.endTime || '17:00',
                isActive: avail.isActive !== undefined ? avail.isActive : true
              });
            }
          });
        }
      },
      error: () => {
        this.toast.error('تعذر تحميل بيانات الملف الشخصي');
      }
    });
  }

  toggleSpecialization(spec: string): void {
    const arr = this.specializationsFormArray;
    const index = arr.controls.findIndex(c => c.value === spec);
    if (index >= 0) {
      arr.removeAt(index);
    } else {
      arr.push(this.fb.control(spec));
    }
  }

  isSpecializationSelected(spec: string): boolean {
    return this.specializationsFormArray.value.includes(spec);
  }

  onSubmit(): void {
    if (this.servicesForm.valid) {
      const formVal = this.servicesForm.value;
      const payload = {
        availabilities: formVal.availabilities,
        hourlyRate: formVal.hourlyRate,
        offersFlatRate: formVal.offersFlatRate,
        specializations: formVal.specializations
      };
      
      this.store.dispatch(BookingActions.updateAvailability({
        availabilities: payload.availabilities,
        hourlyRate: payload.hourlyRate,
        offersFlatRate: payload.offersFlatRate
      }));

      // Update specializations via patchMyProfile API
      const formData = new FormData();
      formData.append('specializations', payload.specializations.join(','));
      this.profileService.patchMyProfile(formData).subscribe();
    }
  }
}
