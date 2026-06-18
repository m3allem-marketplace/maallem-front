import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { AiService } from '../../../core/services/ai.service';
import { ToastService } from '@m3allem/ui-kit';

interface ChatMessage {
  sender: 'user' | 'ai';
  text?: string;
  timestamp: Date;
  estimation?: {
    serviceType: string;
    estimatedArea: number;
    laborHours: number;
    materials: Array<{
      sku: string;
      name: string;
      quantity: number;
      unit: string;
    }>;
  };
  error?: boolean;
  guidance?: boolean;
  suggestions?: string[];
}

@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css']
})
export class AiAssistantComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatScrollContainer') private chatScrollContainer!: ElementRef;

  loading = false;
  serviceType: 'painting' | 'ceramic' | 'plumbing' = 'painting';
  description = '';

  messages: ChatMessage[] = [];

  // Predefined templates to help the user test quickly
  templates = [
    {
      label: 'دهان غرفة نوم كاملة',
      serviceType: 'painting',
      description: 'أريد دهان غرفة نوم بمساحة 4×5 متر وارتفاع السقف 3 متر، الحوائط تحتاج طبقتين معجون وطبقة أساس ولون نهائي أبيض ناصع.'
    },
    {
      label: 'تركيب سيراميك أرضية ريسبشن',
      serviceType: 'ceramic',
      description: 'أريد تركيب سيراميك فرز أول لأرضية صالة استقبال بطول 8 متر وعرض 6 متر، مع وزرة سيراميك داير ما يدور على الجدران.'
    },
    {
      label: 'تأسيس سباكة حمام رئيسي',
      serviceType: 'plumbing',
      description: 'أريد تأسيس شبكة تغذية وصرف صحي لحمام بمساحة 3×2 متر يشمل خلاطات الدش والحوض ومخرج الغسالة الأوتوماتيك.'
    }
  ];

  constructor(
    private aiService: AiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // Add welcome message from AI
    this.messages.push({
      sender: 'ai',
      text: 'مرحباً بك! أنا مساعد معلم للذكاء الاصطناعي 🤖. يمكنني تحليل طلبات الصيانة والتشطيبات وتقديم كشف حساب تقديري مفصل للمواد وأسعار مصنعية الفنيين. تفضل باختيار نوع الخدمة وكتابة تفاصيل طلبك باللغة العربية أو الإنجليزية.',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  useTemplate(tpl: any): void {
    this.serviceType = tpl.serviceType;
    this.description = tpl.description;
    this.toast.info('تم تطبيق قالب الاختبار السريع');
  }

  useSuggestion(suggestion: string): void {
    this.description = suggestion;
    this.sendMessage();
  }

  getServiceLabel(type: string): string {
    const map: Record<string, string> = {
      painting: 'دهانات ونقاشة',
      ceramic: 'سيراميك وبلاط',
      plumbing: 'سباكة وصرف صحي'
    };
    return map[type] || type;
  }

  getServiceIcon(type: string): string {
    const map: Record<string, string> = {
      painting: '🎨',
      ceramic: '🧱',
      plumbing: '🔧'
    };
    return map[type] || '🛠️';
  }

  /**
   * Check if the user's description likely contains dimensional/measurement info
   * that the AI needs to extract room dimensions.
   */
  private hasDimensions(text: string): boolean {
    // Check for any numbers (Arabic or Latin digits)
    const hasNumbers = /[\d٠-٩]/.test(text);

    // Check for measurement-related keywords
    const measurementKeywords = [
      'متر', 'م²', 'سم', 'طول', 'عرض', 'ارتفاع', 'مساحة',
      'meter', 'cm', 'width', 'length', 'height', 'area', 'sqm',
      '×', 'x', 'في', 'بمقاس', 'مقاس', 'أبعاد', 'قياس'
    ];
    const hasKeywords = measurementKeywords.some(kw => text.toLowerCase().includes(kw));

    return hasNumbers && hasKeywords;
  }

  /**
   * Get guidance examples based on service type
   */
  private getGuidanceSuggestions(type: string): string[] {
    const suggestions: Record<string, string[]> = {
      painting: [
        'أريد دهان غرفة 4×5 متر وارتفاعها 3 متر',
        'دهان صالة بطول 8 متر وعرض 6 متر وارتفاع 3 متر',
        'دهان غرفتين نوم كل غرفة 4×4 متر وارتفاع 2.8 متر'
      ],
      ceramic: [
        'تركيب سيراميك لغرفة 5×4 متر',
        'بلاط أرضية صالة بطول 7 متر وعرض 5 متر',
        'تركيب سيراميك حمام مساحة 3×2 متر مع الجدران بارتفاع 2.5 متر'
      ],
      plumbing: [
        'سباكة حمام بمساحة 3×2 متر',
        'تأسيس سباكة مطبخ 4×3 متر',
        'أعمال سباكة لحمامين كل حمام 2.5×2 متر'
      ]
    };
    return suggestions[type] || suggestions['painting'];
  }

  private getGuidanceText(type: string): string {
    const typeLabels: Record<string, string> = {
      painting: 'الدهانات',
      ceramic: 'السيراميك',
      plumbing: 'السباكة'
    };
    const label = typeLabels[type] || 'الخدمة';

    return `لتقديم مقايسة دقيقة لأعمال ${label}، أحتاج منك ذكر **أبعاد المكان** في وصفك. يرجى تضمين:\n\n` +
      `📐 **الطول والعرض** (مثال: 4×5 متر)\n` +
      `📏 **الارتفاع** (مثال: ارتفاع 3 متر)\n` +
      `📍 **نوع المكان** (غرفة نوم، صالة، حمام، مطبخ)\n\n` +
      `جرب أحد الأمثلة التالية أو اكتب وصفك الخاص:`;
  }

  sendMessage(): void {
    if (!this.description.trim()) {
      this.toast.error('يرجى كتابة تفاصيل العمل المطلوب');
      return;
    }

    const userDesc = this.description.trim();
    const currentServiceType = this.serviceType;

    // 1. Add user message
    this.messages.push({
      sender: 'user',
      text: userDesc,
      timestamp: new Date()
    });

    // Clear textarea
    this.description = '';

    // 2. Check if description has dimensions before calling the API
    if (!this.hasDimensions(userDesc)) {
      const suggestions = this.getGuidanceSuggestions(currentServiceType);
      this.messages.push({
        sender: 'ai',
        text: this.getGuidanceText(currentServiceType),
        guidance: true,
        suggestions: suggestions,
        timestamp: new Date()
      });
      return;
    }

    this.loading = true;

    // Add temporary AI Typing state
    this.messages.push({
      sender: 'ai',
      text: 'جاري مراجعة طلبك واستخراج الأبعاد والكميات... ⏳',
      timestamp: new Date()
    });

    const typingMessageIndex = this.messages.length - 1;

    // 3. Call API
    this.aiService.analyzeTask({
      serviceType: currentServiceType,
      description: userDesc
    }).subscribe({
      next: (res) => {
        this.loading = false;
        
        // Remove typing message
        this.messages.splice(typingMessageIndex, 1);

        if (res.success && res.data) {
          this.messages.push({
            sender: 'ai',
            text: 'تم استخراج كشف الكميات المطلوبة بنجاح بناءً على الأبعاد المستخرجة من وصفك:',
            estimation: res.data,
            timestamp: new Date()
          });
        } else {
          this.messages.push({
            sender: 'ai',
            text: res.message || 'عذراً، فشل تحليل البيانات من الخادم.',
            error: true,
            timestamp: new Date()
          });
        }
      },
      error: (err) => {
        this.loading = false;
        
        // Remove typing message
        this.messages.splice(typingMessageIndex, 1);

        let errorMsg = 'فشل الاتصال بالخادم الذكي. يرجى التحقق من إعدادات مفتاح OpenAI في الخادم.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.message) {
          errorMsg = err.message;
        }

        // 422 = Could not extract dimensions → guide the user
        if (err?.status === 422 && errorMsg.toLowerCase().includes('dimension')) {
          const suggestions = this.getGuidanceSuggestions(currentServiceType);
          this.messages.push({
            sender: 'ai',
            text: `لم أتمكن من استخراج أبعاد المكان من وصفك. ${this.getGuidanceText(currentServiceType)}`,
            guidance: true,
            suggestions: suggestions,
            timestamp: new Date()
          });
          return;
        }

        this.toast.error(errorMsg);

        this.messages.push({
          sender: 'ai',
          text: `⚠️ فشل تحليل المقايسة من الخادم: ${errorMsg}`,
          error: true,
          timestamp: new Date()
        });
      }
    });
  }
}
