import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { AiService } from '../../../core/services/ai.service';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { ToastService } from '@m3allem/ui-kit';

interface Material {
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  readableSummary?: string;
}

interface Estimation {
  serviceType: string;
  estimatedArea: number;
  laborHours: number;
  materials: Material[];
  grandTotal?: number;
  executionCommentary?: string;
  tradeName?: string;
  floorLevel?: number;
  linearMeters?: number;
  fallbackUsed?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  angle: number;
  orbitSpeed: number;
  distance: number;
}

@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css']
})
export class AiAssistantComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('orbCanvas', { static: false }) orbCanvas!: ElementRef<HTMLCanvasElement>;

  // Selected trade & active tab
  serviceType: 'demolition_alteration' | 'masonry_building' | 'painting' | 'plumbing' | 'electrical' | 'carpentry' = 'painting';
  activeTab: 'quantities' | 'workers' = 'quantities';
  description = '';
  loading = false;
  apiError = ''; // Displays actual server errors
  showGuidance = false; // Displays dimension helper box

  // Form model fields for custom user input of missing dimensions
  dimWidth: number | null = null;
  dimLength: number | null = null;
  dimHeight: number | null = null;
  dimArea: number | null = null;
  dimLinearMeters: number | null = null;
  dimQuantity: number | null = null;

  // Toggle helpers for multiple-input options
  demoInputMode: 'dimensions' | 'linear' | 'area' = 'dimensions';
  electricalInputMode: 'area' | 'dimensions' = 'area';

  // Active state data
  activeEstimation: Estimation | null = null;
  
  // Recommended Workers state
  recommendedWorkers: any[] = [];
  workersLoading = false;
  workersError = '';

  // Rolling counter targets and display values
  laborHoursDisplay = 0;
  grandTotalDisplay = 0;
  private laborCounterInterval: any = null;
  private totalCounterInterval: any = null;

  // Text fade commentary transition variables
  displayedCommentary = '';
  private commentaryIntervalId: any = null;

  // Canvas particle engine properties
  private ctx!: CanvasRenderingContext2D | null;
  private animationFrameId!: number;
  private particles: Particle[] = [];
  orbState: 'idle' | 'thinking' | 'mutation' = 'idle';
  private flashTimer: any = null;

  // Egyptian site terminology templates & suggestion badges
  tradeSuggestions: Record<string, string[]> = {
    demolition_alteration: [
      'هدم جدار فاصل بين قطعتين بطول 4م وارتفاع 3م',
      'تكسير أرضية حمام قديمة وتجهيزها للعزل والسباكة',
      'فتح باب في جدار طوب مصمت مع صب عتب خرساني',
      'إزالة محارة جدران ريسبشن قديمة وإزالة الردم'
    ],
    masonry_building: [
      'بناء جدار فاصل طوب أحمر مقاس 25×12×6سم بمساحة 12م²',
      'محارة حوائط ريسبشن بالكامل طرطشة وبطانة بمساحة 80م²',
      'بناء قاطع طوب مصمت سمك 12سم بطول 5م وارتفاع 3م',
      'محارة أسقف وحوائط شقة كاملة مع تركيب سلك شبك'
    ],
    painting: [
      'دهان شقة 100م قطيفة وشين معجون',
      'نقاشة حوائط ريسبشن مع تأسيس أساس مائي',
      'معالجة رطوبة ودهان طبقة أساس ولون بيج',
      'دهان جدران صالة 5×6 ارتفاع 3م أوف وايت'
    ],
    plumbing: [
      'تأسيس سباكة حمام بالكامل مواسير شريف PPR',
      'تعديل شبكة تغذية وصرف شقة بالدور الرابع',
      'تغيير خلاطات حمام رئيسي وصرف غسالة ملابس',
      'تركيب أطقم صحي وخلاطات دفن وتوصيل صرف'
    ],
    electrical: [
      'تأسيس كهرباء شقة بالكامل خراطيم وعلب ماجيك',
      'سحب أسلاك سويدي 2مم لـ 30 مأخذ مخرج كهرباء',
      'تعديل لوحة المفاتيح الرئيسية وتأسيس نقاط تكييف',
      'تأسيس شبكة إضاءة أسقف جبسون بورد للصالة'
    ],
    carpentry: [
      'تركيب حلوق خشبية موسكي لـ 5 أبواب داخلية',
      'تركيب باب شقة خشب زان متين مع الفوم والمفصلات',
      'تثبيت حلوق نجارة لغرف الشقة بالكامل وتجهيزها',
      'فك حلوق قديمة وتركيب أبواب خشبية جديدة بالكامل'
    ]
  };

  templates = [
    {
      label: 'تعديلات معمارية وهدم جدران',
      serviceType: 'demolition_alteration' as const,
      description: 'أريد هدم حائط فاصل بطول 5 متر وارتفاع 2.8 متر في الدور الثالث، شامل تنزيل ونقل الردم والمخلفات وتأسيس عتب خرساني لفتحة الباب.'
    },
    {
      label: 'بناء جدران ومحارة ريسبشن',
      serviceType: 'masonry_building' as const,
      description: 'أريد بناء جدار طوب أحمر بطول 6 متر وعرض 4 متر وارتفاع 2.8 متر، مع محارة الجانبين بالكامل بالرمل والأسمنت وتركيب سلك شبك الفيبر.'
    },
    {
      label: 'دهان غرفة نوم كاملة',
      serviceType: 'painting' as const,
      description: 'أريد دهان غرفة نوم بمساحة 4×5 متر وارتفاع السقف 3 متر، الحوائط تحتاج طبقتين معجون وطبقة أساس ولون نهائي أبيض ناصع.'
    },
    {
      label: 'تأسيس سباكة حمام رئيسي',
      serviceType: 'plumbing' as const,
      description: 'أريد تأسيس شبكة تغذية وصرف صحي لحمام بمساحة 3×2 متر يشمل خلاطات الدش والحوض ومخرج الغسالة الأوتوماتيك.'
    },
    {
      label: 'تأسيس كهرباء شقة كاملة',
      serviceType: 'electrical' as const,
      description: 'تأسيس شبكة كهرباء لغرفتين وصالة بمساحة إجمالية 80م²، يشمل تكسير المسارات وتركيب 25 علبة ماجيك وخراطيم سوستة وسحب سلك سويدي 2مم.'
    },
    {
      label: 'تركيب حلوق وأبواب خشبية',
      serviceType: 'carpentry' as const,
      description: 'تركيب 4 حلوق نجارة خشب موسكي لأبواب الغرف، وتثبيتها بالفوم المضغوط والكانات مع تركيب ضلف الأبواب والمفصلات.'
    }
  ];

  constructor(
    private aiService: AiService,
    private workerProfileService: WorkerProfileService,
    private toast: ToastService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Initialize view based on the latest saved historical entry
    this.loadStateFromLocalStorage();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.clearIntervals();
  }

  private clearIntervals(): void {
    if (this.laborCounterInterval) clearInterval(this.laborCounterInterval);
    if (this.totalCounterInterval) clearInterval(this.totalCounterInterval);
    if (this.commentaryIntervalId) clearInterval(this.commentaryIntervalId);
    if (this.flashTimer) clearTimeout(this.flashTimer);
  }

  // Set active tab
  setActiveTab(tab: 'quantities' | 'workers'): void {
    this.activeTab = tab;
    if (tab === 'workers') {
      this.loadWorkersForTrade();
    } else {
      this.loadStateFromLocalStorage();
    }
  }

  // Switch active service trade type
  onTradeChange(type: 'demolition_alteration' | 'masonry_building' | 'painting' | 'plumbing' | 'electrical' | 'carpentry'): void {
    this.serviceType = type;
    this.clearDimensionInputs();
    if (this.activeTab === 'workers') {
      this.loadWorkersForTrade();
    } else {
      this.loadStateFromLocalStorage();
    }
  }

  // Load baseline state from local storage to resume user session
  private loadStateFromLocalStorage(): void {
    this.clearIntervals();
    this.laborHoursDisplay = 0;
    this.grandTotalDisplay = 0;
    this.displayedCommentary = '';
    this.apiError = '';

    const cached = localStorage.getItem(`ai_estimation_${this.serviceType}`);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        this.applyEstimationState(data, false);
      } catch (e) {
        this.activeEstimation = null;
      }
    } else {
      this.activeEstimation = null;
    }
  }

  // Fallback to load default template so there is never an empty state
  private loadDefaultTemplateFallback(): void {
    const defaultDataMap: Record<string, Estimation> = {
      painting: {
        serviceType: 'painting',
        estimatedArea: 54,
        laborHours: 8,
        grandTotal: 5900,
        executionCommentary: 'تم تقدير مساحة الدهانات بمعدل 54 متر مربع لحوائط الغرفة المقترحة. تم احتساب 2 طبقة معجون وتأسيس مع طبقة الطلاء النهائية.',
        materials: [
          { sku: 'PAINT001', name: 'طلاء جدران بلاستيك مط', quantity: 9, unit: 'لتر', readableSummary: 'شامل التغطية والتأسيس بالكامل للتأكد من تناسق الألوان' },
          { sku: 'PAINT002', name: 'معجون حوائط للتنعيم والتأسيس', quantity: 14, unit: 'شيكارة', readableSummary: 'شامل تكلفة النقل وتجهيز السطح الإنشائي' },
          { sku: 'PAINT003', name: 'سيلر مائي عازل جودة عالية', quantity: 5, unit: 'جالون', readableSummary: 'مطبق كأساس لتقليل استهلاك الدهان النهائي' }
        ],
        tradeName: 'دهانات ونقاشة'
      },
      ceramic: {
        serviceType: 'ceramic',
        estimatedArea: 48,
        laborHours: 18,
        grandTotal: 12400,
        executionCommentary: 'تحديد مساحة الأرضية 48 متر مربع لتركيب السيراميك. تم تقدير كميات الرمل والأسمنت المطلوبة للفرش والمونة مع احتساب وزرة حائط.',
        materials: [
          { sku: 'TILE001', name: 'بلاط سيراميك كليوباترا فرز أول', quantity: 51, unit: 'م²', readableSummary: 'شامل 5% نسبة الهالك للتطابق والقطع الإنشائي' },
          { sku: 'CEMENT001', name: 'أسمنت أسيوط بورتلاندي', quantity: 24, unit: 'شيكارة', readableSummary: 'شامل المونة والتركيب لضمان التماسك للأرضية' },
          { sku: 'SAND001', name: 'رمل ناعم نقي للفرش', quantity: 4, unit: 'متر مكعب', readableSummary: 'معدل خصيصاً للتسوية ومقاومة الرطوبة الأرضية' }
        ],
        tradeName: 'سيراميك وبلاط'
      },
      plumbing: {
        serviceType: 'plumbing',
        estimatedArea: 6,
        laborHours: 15,
        grandTotal: 4900,
        executionCommentary: 'تأسيس شبكة التغذية والصرف بمساحة تقديرية 6 متر مربع. يشمل الحساب مسارات الأنابيب وتجهيز مخارج المغاسل والمراحيض.',
        materials: [
          { sku: 'PIPE001', name: 'مواسير التغذية الخضراء PPR شريف', quantity: 12, unit: 'متر', readableSummary: 'شامل اختبار الضغط وضمان المصنع ضد التسريبات' },
          { sku: 'PIPE002', name: 'مواسير صرف PVC رمادي سميكة', quantity: 7, unit: 'متر', readableSummary: 'شامل التوصيلات وحلقات الكاوتش المانعة للمياه' },
          { sku: 'PIPE003', name: 'جلب وكيعان ولوازم توصيل PPR', quantity: 18, unit: 'قطعة', readableSummary: 'توزع حسب أبعاد ومخارج الأجهزة الصحية المطلوبة' }
        ],
        tradeName: 'سباكة وصرف صحي'
      }
    };

    const data = defaultDataMap[this.serviceType] || defaultDataMap['painting'];
    this.applyEstimationState(data, false);
  }

  // Fetch recommended workers for the selected trade specialization
  loadWorkersForTrade(): void {
    this.workersLoading = true;
    this.workersError = '';
    this.recommendedWorkers = [];

    const specMap: Record<string, string> = {
      demolition_alteration: 'هدم',
      masonry_building: 'بناء',
      painting: 'دهان',
      plumbing: 'سباكة',
      electrical: 'كهرباء',
      carpentry: 'نجارة'
    };
    const specialization = specMap[this.serviceType] || 'سباكة';

    this.workerProfileService.getWorkerProfiles({ specialization }).subscribe({
      next: (res) => {
        const list = res?.data?.profiles || [];
        this.recommendedWorkers = list.map((p: any) => {
          const portfolioImages = p.portfolioImages || [];
          return {
            id: p._id,
            name: p.user?.name || 'حرفي معتمد',
            avatar: p.avatar || '',
            category: p.specializations?.[0] || this.getServiceLabel(this.serviceType),
            rating: 4.8,
            tier: portfolioImages.length > 3 ? 'gold' : 'silver',
            ratePerHour: p.hourlyRate || (120 + Math.floor(Math.random() * 80))
          };
        });
        this.workersLoading = false;
      },
      error: () => {
        this.workersLoading = false;
        this.workersError = 'فشل تحميل قائمة الحرفيين المرشحين. يرجى إعادة المحاولة.';
        this.toast.error('عذراً، فشل تحميل قائمة الحرفيين.');
      }
    });
  }

  // Handle template apply
  useTemplate(tpl: typeof this.templates[0]): void {
    this.serviceType = tpl.serviceType;
    this.description = tpl.description;
    this.setActiveTab('quantities');
    this.toast.info('تم تطبيق قالب تفاصيل المشروع وجاري الاحتساب...');
    this.sendMessage();
  }

  // Handle suggestion badge click
  useSuggestion(suggestion: string): void {
    this.description = suggestion;
    this.sendMessage();
  }

  // API Call to submit description
  sendMessage(): void {
    if (!this.description.trim()) {
      this.toast.error('يرجى كتابة تفاصيل العمل المطلوب في منفذ التحكم');
      return;
    }

    const payload = {
      serviceType: this.serviceType,
      description: this.description.trim()
    };

    this.loading = true;
    this.apiError = '';
    this.showGuidance = false;
    this.setOrbState('thinking');

    this.aiService.analyzeTask(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.success && res?.data) {
          const isMutation = !!this.activeEstimation;
          this.applyEstimationState(res.data, isMutation);
          
          if (res.data.isExtractionComplete === false) {
            this.showGuidance = true;
            this.toast.info('💡 يرجى استكمال أبعاد وتفاصيل العمل');
          } else {
            // Save to local storage for continuation
            localStorage.setItem(`ai_estimation_${this.serviceType}`, JSON.stringify(res.data));
            this.toast.success('تم احتساب كشف الكميات والمقايسة بنجاح');
            this.description = ''; // Clear control panel input
            this.clearDimensionInputs();
          }
        } else {
          this.setOrbState('idle');
          this.activeEstimation = null;
          this.apiError = res?.message || 'فشل استخراج البيانات من الخادم.';
          this.toast.error(this.apiError);
        }
      },
      error: (err) => {
        this.loading = false;
        this.setOrbState('idle');
        this.activeEstimation = null;

        // Show the actual server error directly
        let errorMsg = 'فشل الاتصال بالخادم الذكي. يرجى التحقق من الاتصال بالشبكة.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.message) {
          errorMsg = err.message;
        }

        if (err?.status === 422 || errorMsg.toLowerCase().includes('dimension') || errorMsg.toLowerCase().includes('could not extract')) {
          // Ask for dimensions — show guidance box, no scary error
          this.showGuidance = true;
          this.toast.info('💡 يرجى تحديد أبعاد العمل (الطول، العرض، الارتفاع) في الوصف');
        } else {
          this.apiError = errorMsg;
          this.toast.error(`⚠️ حدث خطأ في الخادم: ${errorMsg}`);
        }
      }

    });
  }

  // Appends suggestions from guidance helper card and resubmits
  appendGuidance(text: string): void {
    const cleanDesc = this.description.trim();
    this.description = cleanDesc ? `${cleanDesc} (${text})` : text;
    this.showGuidance = false;
    this.sendMessage();
  }

  // Resets the estimation state and clears local storage cache
  resetEstimation(): void {
    this.description = '';
    this.activeEstimation = null;
    this.apiError = '';
    this.showGuidance = false;
    this.clearDimensionInputs();
    localStorage.removeItem(`ai_estimation_${this.serviceType}`);
  }

  // Resets the custom dimension inputs
  clearDimensionInputs(): void {
    this.dimWidth = null;
    this.dimLength = null;
    this.dimHeight = null;
    this.dimArea = null;
    this.dimLinearMeters = null;
    this.dimQuantity = null;
    this.demoInputMode = 'dimensions';
    this.electricalInputMode = 'area';
  }

  // Submits the custom user-specified dimensions
  submitCustomDimensions(): void {
    let dimensionText = '';

    if (this.serviceType === 'painting') {
      if (!this.dimWidth || !this.dimLength || !this.dimHeight) {
        this.toast.error('يرجى ملء جميع الحقول المطلوبة (الطول، العرض، الارتفاع)');
        return;
      }
      dimensionText = `أبعاد الغرفة: الطول ${this.dimLength} متر والعرض ${this.dimWidth} متر والارتفاع ${this.dimHeight} متر`;
    } 
    else if (this.serviceType === 'plumbing') {
      if (!this.dimArea) {
        this.toast.error('يرجى تحديد مساحة الحمام الكلية');
        return;
      }
      dimensionText = `مساحة الحمام الكلية: ${this.dimArea} متر مربع`;
    } 
    else if (this.serviceType === 'demolition_alteration' || this.serviceType === 'masonry_building') {
      if (this.demoInputMode === 'dimensions') {
        if (!this.dimWidth || !this.dimHeight) {
          this.toast.error('يرجى تحديد عرض وارتفاع الجدار');
          return;
        }
        dimensionText = `أبعاد الجدار: العرض ${this.dimWidth} متر والارتفاع ${this.dimHeight} متر`;
      } else if (this.demoInputMode === 'linear') {
        if (!this.dimLinearMeters) {
          this.toast.error('يرجى تحديد الأمتار الطولية للجدار');
          return;
        }
        dimensionText = `طول الجدار بالمتر الطولي: ${this.dimLinearMeters} متر طولي`;
      } else if (this.demoInputMode === 'area') {
        if (!this.dimArea) {
          this.toast.error('يرجى تحديد مساحة العمل الكلية');
          return;
        }
        dimensionText = `مساحة العمل الكلية: ${this.dimArea} متر مربع`;
      }
    } 
    else if (this.serviceType === 'electrical') {
      if (this.electricalInputMode === 'area') {
        if (!this.dimArea) {
          this.toast.error('يرجى تحديد مساحة الشقة الكلية');
          return;
        }
        dimensionText = `المساحة الكلية للشقة: ${this.dimArea} متر مربع`;
      } else if (this.electricalInputMode === 'dimensions') {
        if (!this.dimWidth || !this.dimLength) {
          this.toast.error('يرجى تحديد عرض وطول الغرفة');
          return;
        }
        dimensionText = `أبعاد الغرفة: الطول ${this.dimLength} متر والعرض ${this.dimWidth} متر`;
      }
    } 
    else if (this.serviceType === 'carpentry') {
      if (!this.dimQuantity) {
        this.toast.error('يرجى تحديد عدد حلوق/أبواب النجارة المطلوب تركيبها');
        return;
      }
      dimensionText = `كمية النجارة المطلوبة: عدد ${this.dimQuantity} أبواب/حلوق`;
    }

    if (dimensionText) {
      const cleanDesc = this.description.trim();
      this.description = cleanDesc ? `${cleanDesc} (${dimensionText})` : dimensionText;
      this.showGuidance = false;
      this.sendMessage();
    }
  }

  // Trigger state bindings
  private applyEstimationState(data: Estimation, triggerMutationFlash: boolean): void {
    this.activeEstimation = data;

    // Set Orb State animations
    if (triggerMutationFlash) {
      this.setOrbState('mutation');
    } else {
      this.setOrbState('idle');
    }

    // Trigger rolling financial metrics counters
    this.animateCounters(data.laborHours, data.grandTotal || 0);

    // Trigger structural commentary text-fade
    if (data.executionCommentary) {
      this.startCommentaryTextFade(data.executionCommentary);
    }
  }

  // Rolling numbers counter engine
  private animateCounters(targetLabor: number, targetTotal: number): void {
    if (this.laborCounterInterval) clearInterval(this.laborCounterInterval);
    if (this.totalCounterInterval) clearInterval(this.totalCounterInterval);

    // Animating labor hours
    const laborStart = this.laborHoursDisplay;
    const laborSteps = 30;
    const laborDelta = (targetLabor - laborStart) / laborSteps;
    let laborCurrentStep = 0;

    this.laborCounterInterval = setInterval(() => {
      laborCurrentStep++;
      this.laborHoursDisplay = Math.round(laborStart + laborDelta * laborCurrentStep);
      if (laborCurrentStep >= laborSteps) {
        this.laborHoursDisplay = targetLabor;
        clearInterval(this.laborCounterInterval);
      }
    }, 25);

    // Animating grand total
    const totalStart = this.grandTotalDisplay;
    const totalSteps = 40;
    const totalDelta = (targetTotal - totalStart) / totalSteps;
    let totalCurrentStep = 0;

    this.totalCounterInterval = setInterval(() => {
      totalCurrentStep++;
      this.grandTotalDisplay = Math.round(totalStart + totalDelta * totalCurrentStep);
      if (totalCurrentStep >= totalSteps) {
        this.grandTotalDisplay = targetTotal;
        clearInterval(this.totalCounterInterval);
      }
    }, 20);
  }

  // Text-fade sequence transition for structural commentary
  private startCommentaryTextFade(fullText: string): void {
    if (this.commentaryIntervalId) clearInterval(this.commentaryIntervalId);
    this.displayedCommentary = fullText;
  }

  // --- HTML5 CANVAS PARTICLE ORB ENGINE ---
  private initCanvas(): void {
    if (!this.orbCanvas || !this.orbCanvas.nativeElement) return;
    const canvas = this.orbCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;
    
    canvas.width = 300;
    canvas.height = 300;

    this.generateParticles();

    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private generateParticles(): void {
    this.particles = [];
    const count = 60;
    const colors = ['#22C55E', '#10B981', '#EA580C', '#3B82F6'];

    for (let i = 0; i < count; i++) {
      const distance = 40 + Math.random() * 70;
      this.particles.push({
        x: 150 + Math.cos(i) * distance,
        y: 150 + Math.sin(i) * distance,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.5 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.005 + Math.random() * 0.012,
        distance: distance
      });
    }
  }

  setOrbState(state: 'idle' | 'thinking' | 'mutation'): void {
    this.orbState = state;
    if (this.flashTimer) clearTimeout(this.flashTimer);

    if (state === 'mutation') {
      this.flashTimer = setTimeout(() => {
        this.orbState = this.loading ? 'thinking' : 'idle';
      }, 1500);
    }
  }

  private animate(): void {
    if (!this.orbCanvas || !this.orbCanvas.nativeElement || !this.ctx) return;
    const canvas = this.orbCanvas.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    this.ctx.clearRect(0, 0, width, height);

    const baseGradient = this.ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 110);
    if (this.orbState === 'idle') {
      const pulseFactor = 0.95 + Math.sin(Date.now() * 0.003) * 0.08;
      baseGradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
      baseGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.18)');
      baseGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 70 * pulseFactor, 0, Math.PI * 2);
      this.ctx.fillStyle = baseGradient;
      this.ctx.fill();
    } else if (this.orbState === 'thinking') {
      const pulseFactor = 0.9 + Math.sin(Date.now() * 0.015) * 0.04;
      baseGradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      baseGradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.25)');
      baseGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 65 * pulseFactor, 0, Math.PI * 2);
      this.ctx.fillStyle = baseGradient;
      this.ctx.fill();
    } else if (this.orbState === 'mutation') {
      const pulseFactor = 1.05 + Math.sin(Date.now() * 0.02) * 0.12;
      baseGradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
      baseGradient.addColorStop(0.4, 'rgba(234, 88, 12, 0.45)');
      baseGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 80 * pulseFactor, 0, Math.PI * 2);
      this.ctx.fillStyle = baseGradient;
      this.ctx.fill();
    }

    // Render Particles
    const maxConnections = 4;
    const connectionDist = 58;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (this.orbState === 'idle') {
        p.angle += p.orbitSpeed * 0.3;
        const breath = Math.sin(Date.now() * 0.003 + i) * 12;
        p.x = centerX + Math.cos(p.angle) * (p.distance + breath);
        p.y = centerY + Math.sin(p.angle) * (p.distance + breath);
      } else if (this.orbState === 'thinking') {
        p.angle += p.orbitSpeed * 2.8;
        const wave = Math.sin(Date.now() * 0.009 + p.distance) * 5;
        p.x = centerX + Math.cos(p.angle) * (p.distance * 0.78 + wave);
        p.y = centerY + Math.sin(p.angle) * (p.distance * 0.78 + wave);
      } else if (this.orbState === 'mutation') {
        p.angle += p.orbitSpeed * 4.5;
        const burst = Math.sin(Date.now() * 0.03 + i) * 25;
        p.x = centerX + Math.cos(p.angle) * (p.distance * 1.1 + burst);
        p.y = centerY + Math.sin(p.angle) * (p.distance * 1.1 + burst);
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (this.orbState === 'mutation') {
        this.ctx.fillStyle = '#EA580C';
      } else if (this.orbState === 'thinking') {
        this.ctx.fillStyle = i % 3 === 0 ? '#EA580C' : '#22C55E';
      } else {
        this.ctx.fillStyle = p.color;
      }
      this.ctx.fill();

      let connections = 0;
      for (let j = i + 1; j < this.particles.length; j++) {
        if (connections >= maxConnections) break;
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          connections++;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          
          if (this.orbState === 'mutation') {
            this.ctx.strokeStyle = `rgba(234, 88, 12, ${0.4 - dist / connectionDist})`;
          } else if (this.orbState === 'thinking') {
            this.ctx.strokeStyle = `rgba(16, 185, 129, ${0.35 - dist / connectionDist})`;
          } else {
            this.ctx.strokeStyle = `rgba(34, 197, 94, ${0.25 - dist / connectionDist})`;
          }
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = this.orbState === 'mutation' ? '#EA580C' : '#22C55E';
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = this.orbState === 'mutation' ? '#EA580C' : '#22C55E';
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  // --- MATERIAL ICON UTILITY CLASS CLASSIFICATION ---
  getMaterialIcon(sku: string, name: string): string {
    const s = sku.toUpperCase();
    const n = (name || '').toLowerCase();
    
    if (s.includes('BRICK') || n.includes('طوب') || n.includes('brick')) return 'brick';
    if (s.includes('CEMENT') || n.includes('أسمنت') || n.includes('cement') || s.includes('PORTLAND')) return 'cement';
    if (s.includes('PIPE') || n.includes('مواسير') || n.includes('pipe') || s.includes('PPR')) return 'pipe';
    if (s.includes('PAINT') || n.includes('دهان') || n.includes('paint') || n.includes('معجون')) return 'paint';
    if (s.includes('TILES') || s.includes('CERAMIC') || n.includes('بلاط') || n.includes('سيراميك')) return 'brick';
    return 'default';
  }

  getServiceLabel(type: string): string {
    const map: Record<string, string> = {
      demolition_alteration: 'تعديلات معمارية وهدم',
      masonry_building: 'مباني ومحارة',
      painting: 'دهانات ونقاشة',
      plumbing: 'سباكة وصرف صحي',
      electrical: 'تأسيسات كهربائية',
      carpentry: 'نجارة معمارية'
    };
    return map[type] || type;
  }

  getServiceIcon(type: string): string {
    const map: Record<string, string> = {
      demolition_alteration: 'demolition_alteration',
      masonry_building: 'masonry_building',
      painting: 'painting',
      plumbing: 'plumbing',
      electrical: 'electrical',
      carpentry: 'carpentry'
    };
    return map[type] || 'default';
  }
}
