import { Component, OnInit } from '@angular/core';

export type UserMode = 'guest' | 'worker';

export interface Step {
  icon: string;
  title: string;
  description: string;
}

const GUEST_STEPS: Step[] = [
  {
    icon: 'fa-solid fa-user-plus',
    title: 'سجّل حسابك',
    description: 'إنشاء حساب مجاني في دقيقة واحدة بالإيميل أو بحسابك على Google.',
  },
  {
    icon: 'fa-solid fa-magnifying-glass',
    title: 'تصفح أو انشر طلب',
    description: 'دوّر على الصنايعي المناسب أو انشر طلبك وانتظر العروض.',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'احجز وادفع بأمان',
    description: 'اختار العرض المناسب واحجز مع ضمان استرداد المبلغ.',
  },
];

const WORKER_STEPS: Step[] = [
  {
    icon: 'fa-solid fa-id-card',
    title: 'سجّل كصنايعي',
    description: 'أنشئ ملفك الشخصي واعرض شغلك وخبرتك ومؤهلاتك.',
  },
  {
    icon: 'fa-solid fa-clipboard-list',
    title: 'اعرض خدماتك',
    description: 'حدّد تخصصاتك وأسعارك ومواعيد توافرك.',
  },
  {
    icon: 'fa-solid fa-coins',
    title: 'اكسب أكتر',
    description: 'استقبل طلبات من عملاء محيطيك واكسب تقييمات تبني سمعتك.',
  },
];

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
})
export class HowItWorksComponent implements OnInit {
  activeMode: UserMode = 'guest';
  isWorker = false; // TODO: inject UserContextService and set from it

  get steps(): Step[] {
    return this.activeMode === 'guest' ? GUEST_STEPS : WORKER_STEPS;
  }

  ngOnInit(): void {
    // TODO: this.isWorker = this.userContext.isWorker();
    // this.activeMode = this.isWorker ? 'worker' : 'guest';
  }

  setMode(mode: UserMode): void {
    this.activeMode = mode;
  }
}