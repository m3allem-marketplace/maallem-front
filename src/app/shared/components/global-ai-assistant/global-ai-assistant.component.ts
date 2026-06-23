import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/services/ai.service';
import { ToastService } from '@m3allem/ui-kit';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  isExtractionComplete?: boolean;
}

@Component({
  selector: 'app-global-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './global-ai-assistant.component.html',
  styleUrls: ['./global-ai-assistant.component.css']
})
export class GlobalAiAssistantComponent implements OnInit {
  private readonly aiService = inject(AiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  isOpen = false;
  loading = false;
  description = '';
  serviceType = 'painting';
  messages: ChatMessage[] = [];

  get isWorkspacePage(): boolean {
    return this.router.url.includes('/qscale-workspace');
  }

  ngOnInit(): void {
    this.loadSession();
    if (this.messages.length === 0) {
      this.messages.push({
        sender: 'assistant',
        text: 'مرحباً بك في مساعد معلّم! أنا هنا لمساعدتك في حصر كميات الخامات وحساب مقايستك الفورية. اكتب استفسارك هنا، أو اضغط على اللافتة بالكامل لعرض لوحة المقايسة والجدول بالكامل.',
        isExtractionComplete: false
      });
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadSession();
    }
  }

  loadSession(): void {
    const cached = localStorage.getItem('qscale_local_session');
    if (cached) {
      try {
        this.messages = JSON.parse(cached);
      } catch (e) {
        // Fallback if cache is corrupted
      }
    }
  }

  saveSession(): void {
    localStorage.setItem('qscale_local_session', JSON.stringify(this.messages));
  }

  sendMessage(): void {
    const userText = this.description.trim();
    if (!userText) return;

    this.messages.push({
      sender: 'user',
      text: userText
    });

    this.description = '';
    this.loading = true;
    this.saveSession();

    this.aiService.analyzeTask({
      serviceType: this.serviceType,
      description: userText
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.success && res?.data) {
          const aiData = res.data;
          
          if (aiData.isExtractionComplete === false) {
            this.messages.push({
              sender: 'assistant',
              text: aiData.followUpMessage || 'يرجى كتابة مقاسات المكان لإنشاء كشف الكميات.',
              isExtractionComplete: false
            });
          } else {
            this.messages.push({
              sender: 'assistant',
              text: `${aiData.executionCommentary || 'تم الحساب بنجاح!'}\n\n💡 المقاسات المكتشفة: ${aiData.estimatedArea} م²\nساعات العمل: ${aiData.laborHours} ساعة.`,
              isExtractionComplete: true
            });
          }
          this.saveSession();
          this.scrollToBottom();
        } else {
          this.messages.push({
            sender: 'assistant',
            text: 'عذراً، فشل استكمال المقايسة. جرب صياغة أخرى.',
            isExtractionComplete: false
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.messages.push({
          sender: 'assistant',
          text: 'حدث خطأ في الاتصال بالخادم. يرجى مراجعة شبكتك.',
          isExtractionComplete: false
        });
      }
    });
  }

  navigateToWorkspace(): void {
    this.saveSession();
    this.isOpen = false;
    this.router.navigate(['/qscale-workspace']);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.getElementById('global-chat-viewport');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
