import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../core/services/chat.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { PusherService } from '../../../core/services/pusher.service';
import { ToastService } from '@m3allem/ui-kit';
import { Subject, takeUntil, interval, switchMap, startWith, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly chatService = inject(ChatService);
  private readonly userContext = inject(UserContextService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly pusherService = inject(PusherService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversations: any[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  newMessageContent = '';
  
  loadingConversations = false;
  loadingMessages = false;
  sendingMessage = false;
  currentUserId: string | null = null;
  currentUserRole: string | null = null;

  private destroy$ = new Subject<void>();
  private pusherSub?: Subscription;

  ngOnInit(): void {
    this.currentUserId = this.userContext.currentUser?._id ?? null;
    this.currentUserRole = this.userContext.role;

    // Check for query parameters to pre-open a chat
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const convId = params['conversationId'];
      const workerId = params['workerId'];
      const projectId = params['projectId'];

      if (convId) {
        const found = this.conversations.find(c => c._id === convId);
        if (found) {
          this.selectConversation(found);
        } else {
          this.loadConversations(convId);
        }
      } else {
        this.loadConversations();
        if (workerId) {
          this.startOrFetchConversation(workerId, projectId);
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pusherSub?.unsubscribe();
    if (this.selectedConversation) {
      this.pusherService.unsubscribeFromConversation(this.selectedConversation._id);
    }
  }

  loadConversations(autoSelectId?: string): void {
    this.loadingConversations = true;
    this.chatService.getConversations().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.conversations = res?.data?.conversations || res?.data || res || [];
        this.loadingConversations = false;
        if (autoSelectId) {
          const found = this.conversations.find(c => c._id === autoSelectId);
          if (found) {
            this.selectConversation(found);
          }
        }
      },
      error: () => {
        this.toast.error('تعذر تحميل قائمة المحادثات');
        this.loadingConversations = false;
      }
    });
  }

  selectConversation(conv: any): void {
    const prevConvId = this.selectedConversation?._id;
    this.selectedConversation = conv;
    this.messages = [];
    this.pusherSub?.unsubscribe();

    if (prevConvId) {
      this.pusherService.unsubscribeFromConversation(prevConvId);
    }

    this.loadMessages(conv._id);
    this.markConversationAsRead(conv._id);

    this.pusherSub = this.pusherService.subscribeToConversation(conv._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(evt => {
        if (evt.event === 'new-message') {
          const msg = evt.data?.message || evt.data;
          if (msg && !this.messages.some(m => m._id === msg._id)) {
            this.messages = [...this.messages, msg];
            
            // Update last message in the local conversation list
            const found = this.conversations.find(c => c._id === conv._id);
            if (found) {
              found.lastMessage = msg;
              found.lastMessageAt = msg.createdAt;
            }
          }
        } else if (evt.event === 'message-read') {
          this.messages = this.messages.map(m => ({ ...m, read: true }));
        }
      });
  }

  loadMessages(conversationId: string): void {
    this.loadingMessages = true;
    this.chatService.getMessages(conversationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.messages = res?.data?.messages || res?.data || res || [];
        this.loadingMessages = false;
      },
      error: () => {
        this.toast.error('تعذر تحميل الرسائل لهذه المحادثة');
        this.loadingMessages = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim() || !this.selectedConversation) return;

    this.sendingMessage = true;
    const content = this.newMessageContent.trim();
    this.newMessageContent = '';

    this.chatService.sendMessage(this.selectedConversation._id, content).subscribe({
      next: (res: any) => {
        const msg = res?.data?.message || res?.data || res;
        if (!this.messages.some(m => m._id === msg._id)) {
          this.messages = [...this.messages, msg];
        }
        this.sendingMessage = false;
        
        // Update last message in the local conversation list
        const found = this.conversations.find(c => c._id === this.selectedConversation._id);
        if (found) {
          found.lastMessage = msg;
          found.lastMessageAt = msg.createdAt;
        }
      },
      error: () => {
        this.toast.error('فشل إرسال الرسالة');
        this.sendingMessage = false;
      }
    });
  }

  startOrFetchConversation(workerId: string, projectId?: string): void {
    this.chatService.startConversation(workerId, projectId).subscribe({
      next: (res: any) => {
        const conv = res?.data?.conversation || res?.data || res;
        if (conv) {
          this.loadConversations();
          this.selectConversation(conv);
        }
      },
      error: () => {
        this.toast.error('تعذر فتح المحادثة مع هذا الحرفي');
      }
    });
  }

  markConversationAsRead(conversationId: string): void {
    this.chatService.markAsRead(conversationId).subscribe({
      next: () => {
        const found = this.conversations.find(c => c._id === conversationId);
        if (found && found.unreadCount) {
          if (this.currentUserRole === 'user') {
            found.unreadCount.client = 0;
          } else {
            found.unreadCount.worker = 0;
          }
        }
      }
    });
  }

  getParticipantName(conv: any): string {
    if (this.currentUserRole === 'user') {
      return conv.worker?.name || 'حرفي معلّم';
    } else {
      return conv.client?.name || 'عميل معلّم';
    }
  }

  getParticipantRole(conv: any): string {
    if (this.currentUserRole === 'user') {
      return 'حرفي / Provider';
    } else {
      return 'عميل / Client';
    }
  }

  getUnreadCount(conv: any): number {
    if (!conv.unreadCount) return 0;
    return this.currentUserRole === 'user' ? conv.unreadCount.client : conv.unreadCount.worker;
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
