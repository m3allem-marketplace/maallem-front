import { Component, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AiService } from '../../../core/services/ai.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { ToastService } from '@m3allem/ui-kit';
import { ChatService } from '../../../core/services/chat.service';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  isExtractionComplete?: boolean;
  showDimensionsForm?: boolean;
  estimationData?: any;
}

@Component({
  selector: 'app-qscale-workspace',
  templateUrl: './qscale-workspace.component.html',
  styleUrls: ['./qscale-workspace.component.css']
})
export class QScaleWorkspaceComponent implements OnInit, OnDestroy {
  private readonly aiService = inject(AiService);
  private readonly userContext = inject(UserContextService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly chatService = inject(ChatService);

  // Layout States
  sidebarCollapsed = false;
  isLoggedIn = false;

  // Active Specialization Selection
  serviceType: 'demolition_alteration' | 'masonry_building' | 'painting' | 'plumbing' | 'electrical' | 'carpentry' = 'painting';
  
  // Chat Data
  description = '';
  loading = false;
  messages: ChatMessage[] = [];

  // Estimation State
  activeEstimation: any = null;
  historyList: any[] = [];

  // AI Mode: 'survey' | 'recommendations' | null
  aiMode: 'survey' | 'recommendations' | null = null;
  recommendedWorkers: any[] = [];
  detectedAnalysis: any = null;
  activeMobileTab: 'chat' | 'results' = 'chat';

  // Inline Form fields
  dimWidth: number | null = null;
  dimLength: number | null = null;
  dimHeight: number | null = null;
  dimArea: number | null = null;
  dimLinearMeters: number | null = null;
  dimQuantity: number | null = null;
  demoInputMode: 'dimensions' | 'linear' | 'area' = 'dimensions';
  electricalInputMode: 'area' | 'dimensions' = 'area';

  ngOnInit(): void {
    // 1. Check user authentication
    this.isLoggedIn = this.userContext.isLoggedIn;
    
    // 2. Fetch history if authenticated
    if (this.isLoggedIn) {
      this.loadHistory();
    }
    
    // 3. Load active session state (loads local cached messages, mode, and recommended workers if any)
    this.loadLocalSession();
  }

  ngOnDestroy(): void {}

  // Fetch AI estimation logs from backend
  loadHistory(): void {
    this.aiService.getHistory().subscribe({
      next: (res) => {
        this.historyList = res?.data || [];
      },
      error: (err) => {
        console.error('Failed to load history', err);
      }
    });
  }

  // Load guest session array if existing in localStorage
  loadLocalSession(): void {
    const cached = localStorage.getItem(`qscale_local_session`);
    const cachedMode = localStorage.getItem(`qscale_ai_mode`);
    if (cachedMode) {
      this.aiMode = cachedMode as any;
    }
    if (cached) {
      try {
        this.messages = JSON.parse(cached);
        // Find latest completed estimation in conversation to show on right panel
        const completed = [...this.messages].reverse().find(m => m.sender === 'assistant' && m.isExtractionComplete && m.estimationData);
        if (completed) {
          this.activeEstimation = completed.estimationData;
        }
        // Also look for recommendations
        const cachedWorkers = localStorage.getItem(`qscale_recommended_workers`);
        const cachedAnalysis = localStorage.getItem(`qscale_detected_analysis`);
        if (cachedWorkers) {
          this.recommendedWorkers = JSON.parse(cachedWorkers);
        }
        if (cachedAnalysis) {
          this.detectedAnalysis = JSON.parse(cachedAnalysis);
        }
      } catch (e) {
        this.messages = [];
      }
    }
  }

  // Save current messages array to local storage (useful for guest/floating session restoration)
  saveLocalSession(): void {
    localStorage.setItem(`qscale_local_session`, JSON.stringify(this.messages));
    if (this.aiMode) {
      localStorage.setItem(`qscale_ai_mode`, this.aiMode);
    }
    localStorage.setItem(`qscale_recommended_workers`, JSON.stringify(this.recommendedWorkers));
    localStorage.setItem(`qscale_detected_analysis`, JSON.stringify(this.detectedAnalysis));
  }

  // Select historical estimate item
  selectHistoryItem(item: any): void {
    this.aiMode = 'survey';
    localStorage.setItem(`qscale_ai_mode`, 'survey');
    this.activeEstimation = item.result;
    this.serviceType = item.serviceType;
    this.messages = [
      { sender: 'user', text: item.description },
      { 
        sender: 'assistant', 
        text: item.result.executionCommentary || 'تم استدعاء بيانات المقايسة بنجاح.',
        isExtractionComplete: item.result.isExtractionComplete,
        estimationData: item.result
      }
    ];
    this.saveLocalSession();
  }

  // Handle clear session / start fresh
  resetWorkspace(): void {
    this.description = '';
    this.activeEstimation = null;
    this.aiMode = null;
    this.recommendedWorkers = [];
    this.detectedAnalysis = null;
    this.messages = [];
    this.activeMobileTab = 'chat';
    localStorage.removeItem(`qscale_ai_mode`);
    localStorage.removeItem(`qscale_recommended_workers`);
    localStorage.removeItem(`qscale_detected_analysis`);
    this.clearDimensionInputs();
    this.saveLocalSession();
  }

  setAiMode(mode: 'survey' | 'recommendations'): void {
    this.aiMode = mode;
    localStorage.setItem(`qscale_ai_mode`, mode);
    
    if (mode === 'survey') {
      this.messages = [{
        sender: 'assistant',
        text: 'مرحباً بك في مساعد معلّم! أنا هنا لمساعدتك في توليد كشوف الكميات (BOQ) وحساب الخامات والمصنعيات المطلوبة لمشروعك. اكتب تفاصيل طلبك ودعنا نبدأ.',
        isExtractionComplete: false
      }];
    } else {
      this.messages = [{
        sender: 'assistant',
        text: 'مرحباً بك في مساعد معلّم لترشيح الفنيين! صف لي المشكلة أو العمل المطلوب، بالإضافة إلى مدينتك (مثل: القاهرة، الإسكندرية) لترشيح أفضل الفنيين والعمال المسجلين لدينا لمشروعك.',
        isExtractionComplete: false
      }];
    }
    
    this.saveLocalSession();
  }

  startDirectChat(worker: any): void {
    const workerUserId = worker.user?._id || worker._id;
    if (!workerUserId) {
      this.toast.error('لا يمكن تحديد معرّف الفني لبدء المحادثة');
      return;
    }

    if (!this.isLoggedIn) {
      this.toast.error('يرجى تسجيل الدخول أولاً للدردشة مع الفنيين');
      return;
    }

    this.chatService.startConversation(workerUserId).subscribe({
      next: (res) => {
        this.toast.success('تم بدء المحادثة بنجاح');
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        console.error('Failed to start conversation', err);
        this.toast.error('فشل بدء المحادثة مع الفني');
      }
    });
  }

  // Select specialization trade pill
  onTradeChange(type: any): void {
    this.serviceType = type;
    this.clearDimensionInputs();
  }

  // Send textual user message to Gemini
  sendMessage(): void {
    const userText = this.description.trim();
    if (!userText) return;

    // Push User message to log
    this.messages.push({
      sender: 'user',
      text: userText
    });
    
    this.description = '';
    this.loading = true;
    this.clearDimensionInputs();

    if (this.aiMode === 'recommendations') {
      this.aiService.getRecommendations({ story: userText }).subscribe({
        next: (res) => {
          this.loading = false;
          if (res?.success && res?.data) {
            const data = res.data;
            this.detectedAnalysis = data.analysis;
            this.recommendedWorkers = data.recommendations || [];
            this.activeMobileTab = 'results';
            
            this.messages.push({
              sender: 'assistant',
              text: data.analysis?.messageAr || 'تم ترشيح أفضل الفنيين لطلبك بناءً على تخصص العمل والمدينة المكتشفة. يمكنك رؤية القائمة والتواصل معهم في اللوحة الجانبية.'
            });
            
            this.toast.success('تم العثور على ترشيحات مناسبة');
            this.saveLocalSession();
          } else {
            this.messages.push({
              sender: 'assistant',
              text: 'عذراً، لم أتمكن من العثور على فنيين مرشحين لطلبك في الوقت الحالي. يرجى تعديل الطلب أو تغيير المدينة.'
            });
            this.toast.error('لم يتم العثور على نتائج');
          }
          this.scrollToBottom();
        },
        error: (err) => {
          this.loading = false;
          let errorMsg = 'فشل الاتصال بخادم الترشيحات. يرجى التحقق من الشبكة.';
          if (err?.error?.message) {
            errorMsg = err.error.message;
          }
          this.messages.push({
            sender: 'assistant',
            text: `⚠️ خطأ: ${errorMsg}`
          });
          this.toast.error('حدث خطأ أثناء جلب الترشيحات');
          this.scrollToBottom();
        }
      });
      return;
    }

    // Default Survey/Estimation workflow
    this.aiService.analyzeTask({
      serviceType: this.serviceType,
      description: userText
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.success && res?.data) {
          const aiData = res.data;
          
          if (aiData.isExtractionComplete === false) {
            // Push followUp conversational message asking for dimensions
            this.messages.push({
              sender: 'assistant',
              text: aiData.followUpMessage || 'يرجى تزويدي بأبعاد وتفاصيل إضافية للمكان.',
              isExtractionComplete: false,
              showDimensionsForm: true
            });
            this.toast.info('💡 يرجى استكمال أبعاد وتفاصيل العمل');
          } else {
            // Success response: push report and update active BOQ
            this.activeEstimation = aiData;
            this.activeMobileTab = 'results';
            this.messages.push({
              sender: 'assistant',
              text: aiData.executionCommentary || 'تم حصر كميات المواد وحساب التكلفة بنجاح!',
              isExtractionComplete: true,
              estimationData: aiData
            });
            this.toast.success('تم احتساب كشف الكميات بنجاح');
            
            // Reload historical listings if logged in
            if (this.isLoggedIn) {
              this.loadHistory();
            }
          }
          
          this.saveLocalSession();
        } else {
          this.messages.push({
            sender: 'assistant',
            text: 'عذراً، فشل تحليل طلبك. يرجى إعادة المحاولة بعبارة أخرى.',
            isExtractionComplete: false
          });
          this.toast.error('حدث خطأ أثناء معالجة الطلب');
        }
        this.scrollToBottom();
      },
      error: (err) => {
        this.loading = false;
        let errorMsg = 'فشل الاتصال بالخادم الذكي. يرجى التحقق من الشبكة.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        }
        this.messages.push({
          sender: 'assistant',
          text: `⚠️ خطأ خادم: ${errorMsg}`,
          isExtractionComplete: false
        });
        this.toast.error('فشل معالجة الطلب من الخادم');
        this.scrollToBottom();
      }
    });
  }

  // Inline custom dimension form confirm action
  submitInlineDimensions(): void {
    let dimensionText = '';

    if (this.serviceType === 'painting') {
      if (!this.dimWidth || !this.dimLength || !this.dimHeight) {
        this.toast.error('يرجى تحديد أبعاد الطول، العرض، والارتفاع');
        return;
      }
      dimensionText = `أبعاد الغرفة: الطول ${this.dimLength} متر والعرض ${this.dimWidth} متر والارتفاع ${this.dimHeight} متر`;
    } 
    else if (this.serviceType === 'plumbing') {
      if (!this.dimArea) {
        this.toast.error('يرجى تحديد المساحة بالكامل');
        return;
      }
      dimensionText = `المساحة الإجمالية للحمام: ${this.dimArea} متر مربع`;
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
      dimensionText = `عدد الحلوق/الأبواب المطلوبة: ${this.dimQuantity} أبواب`;
    }

    if (dimensionText) {
      // Find latest message with form and disable it so it's not submitted twice
      const lastMsg = [...this.messages].reverse().find(m => m.sender === 'assistant' && m.showDimensionsForm);
      if (lastMsg) {
        lastMsg.showDimensionsForm = false;
      }

      this.description = dimensionText;
      this.sendMessage();
    }
  }

  // Appends suggestion badges
  appendSuggestion(text: string): void {
    this.description = text;
    this.sendMessage();
  }

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

  getServiceLabel(type: string): string {
    const map: Record<string, string> = {
      demolition_alteration: 'تعديلات وهدم حوائط',
      masonry_building: 'أعمال مباني ومحارة',
      painting: 'أعمال دهانات ونقاشة',
      plumbing: 'تأسيس وتشطيب سباكة',
      electrical: 'تأسيسات وشبكات كهرباء',
      carpentry: 'تركيب نجارة وأبواب'
    };
    return map[type] || type;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.getElementById('chat-history-viewport');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
