import { Injectable, inject, OnDestroy } from '@angular/core';
import { Observable, Subject, interval, fromEvent, EMPTY } from 'rxjs';
import { switchMap, takeUntil, share, filter } from 'rxjs/operators';
import { ChatService } from './chat.service';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';

// ── Pusher config ────────────────────────────────────────────────────────────
// Drop your Pusher app key and cluster here when available.
// Leave PUSHER_KEY as empty string to fall back to polling mode.
const PUSHER_KEY    = environment.pusher?.key || '';
const PUSHER_CLUSTER = environment.pusher?.cluster || 'eu';
// ─────────────────────────────────────────────────────────────────────────────

export interface PusherEvent {
  event: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class PusherService implements OnDestroy {
  private chatService = inject(ChatService);
  private tokenStorage = inject(TokenStorageService);

  // Internal subjects for notification & message events
  private notificationSubject$ = new Subject<PusherEvent>();
  private messageSubjects = new Map<string, Subject<PusherEvent>>();

  private pusherInstance: any = null;
  private destroy$ = new Subject<void>();

  // Expose the global notification stream
  readonly notification$ = this.notificationSubject$.asObservable();

  /** Initialise Pusher for a logged-in user. Call on login. */
  connect(userId: string): void {
    if (!PUSHER_KEY) {
      console.warn('[PusherService] PUSHER_KEY is empty. Skipping connection.');
      return;
    }
    if (!userId) {
      console.warn('[PusherService] Connection failed: userId is null.');
      return;
    }

    const token = this.tokenStorage.getAccessToken();
    console.log(`[PusherService] Connecting to Pusher (Key: ${PUSHER_KEY}, Cluster: ${PUSHER_CLUSTER})`);

    try {
      // Dynamic import so it doesn't break SSR or if pusher-js is absent
      import('pusher-js').then(({ default: Pusher }) => {
        if (this.pusherInstance) {
          console.log('[PusherService] Disconnecting previous connection...');
          this.pusherInstance.disconnect();
        }
        this.pusherInstance = new Pusher(PUSHER_KEY, {
          cluster: PUSHER_CLUSTER,
          authorizer: (channel, options) => {
            return {
              authorize: (socketId, callback) => {
                const freshToken = this.tokenStorage.getAccessToken();
                const authUrl = environment.apiUrl.replace(/\/v1\/?$/, '') + '/pusher/auth';
                
                fetch(authUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': freshToken ? `Bearer ${freshToken}` : ''
                  },
                  body: JSON.stringify({
                    socket_id: socketId,
                    channel_name: channel.name
                  })
                })
                .then(res => {
                  if (!res.ok) throw new Error(`Auth failed with status ${res.status}`);
                  return res.json();
                })
                .then(data => callback(null, data))
                .catch(err => callback(new Error(`Pusher auth error: ${err.message}`), { auth: "" }));
              }
            };
          }
        });

        console.log(`[PusherService] Subscribing to private channel: private-user-${userId}`);
        const channel = this.pusherInstance.subscribe(`private-user-${userId}`);

        channel.bind('new-notification', (data: any) => {
          console.log('[PusherService] Raw event received on private channel: new-notification ->', data);
          this.notificationSubject$.next({ event: 'new-notification', data });
        });

        // Safe Fallback: if backend lacks pusher authentication routes, fall back to public channel
        channel.bind('pusher:subscription_error', (status: any) => {
          console.warn('[PusherService] Private channel sub error, falling back to public channel:', status);
          console.log(`[PusherService] Subscribing to public fallback channel: user-${userId}`);
          const publicChannel = this.pusherInstance.subscribe(`user-${userId}`);
          publicChannel.bind('new-notification', (data: any) => {
            console.log('[PusherService] Raw event received on public channel: new-notification ->', data);
            this.notificationSubject$.next({ event: 'new-notification', data });
          });
        });
      });
    } catch (err) {
      console.warn('[PusherService] Could not initialise Pusher:', err);
    }
  }

  /** Subscribe to a conversation channel for live messages. */
  subscribeToConversation(conversationId: string): Observable<PusherEvent> {
    if (!PUSHER_KEY) {
      console.warn('[PusherService] PUSHER_KEY is empty. Skipping subscription to conversation.');
      return EMPTY;
    }
    if (!this.pusherInstance) {
      console.warn('[PusherService] Pusher instance is not connected.');
      return EMPTY;
    }

    if (this.messageSubjects.has(conversationId)) {
      return this.messageSubjects.get(conversationId)!.asObservable();
    }

    this.messageSubjects.set(conversationId, new Subject<PusherEvent>());

    const subject$ = this.messageSubjects.get(conversationId)!;

    try {
      console.log(`[PusherService] Subscribing to private conversation channel: private-conversation-${conversationId}`);
      const channel = this.pusherInstance.subscribe(`private-conversation-${conversationId}`);
      
      channel.bind('new-message', (data: any) => {
        console.log('[PusherService] Raw event received on private channel: new-message ->', data);
        subject$.next({ event: 'new-message', data });
        this.notificationSubject$.next({ event: 'new-message', data }); // Global emit
      });
      channel.bind('message-read', (data: any) => {
        console.log('[PusherService] Raw event received on private channel: message-read ->', data);
        subject$.next({ event: 'message-read', data });
      });

      // Safe Fallback: if private channel fails to authorize, fall back to public conversation channel
      channel.bind('pusher:subscription_error', (status: any) => {
        console.warn('[PusherService] Private conversation subscription error, subscribing to public:', status);
        console.log(`[PusherService] Subscribing to public fallback conversation: conversation-${conversationId}`);
        const publicChannel = this.pusherInstance.subscribe(`conversation-${conversationId}`);
        publicChannel.bind('new-message', (data: any) => {
          console.log('[PusherService] Raw event received on public channel: new-message ->', data);
          subject$.next({ event: 'new-message', data });
          this.notificationSubject$.next({ event: 'new-message', data }); // Global emit
        });
        publicChannel.bind('message-read', (data: any) => {
          console.log('[PusherService] Raw event received on public channel: message-read ->', data);
          subject$.next({ event: 'message-read', data });
        });
      });
    } catch (err) {
      console.warn('[PusherService] Failed to subscribe to conversation:', err);
    }

    return subject$.asObservable();
  }

  /** Unsubscribe from a conversation channel. */
  unsubscribeFromConversation(conversationId: string): void {
    if (this.pusherInstance) {
      try { 
        this.pusherInstance.unsubscribe(`private-conversation-${conversationId}`); 
        this.pusherInstance.unsubscribe(`conversation-${conversationId}`);
      } catch {}
    }
    this.messageSubjects.delete(conversationId);
  }

  /** Disconnect entirely on logout. */
  disconnect(): void {
    if (this.pusherInstance) {
      try { this.pusherInstance.disconnect(); } catch {}
      this.pusherInstance = null;
    }
    this.messageSubjects.forEach(s => s.complete());
    this.messageSubjects.clear();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }

  /** Whether Pusher is configured (for template use). */
  get isPusherConfigured(): boolean {
    return !!PUSHER_KEY;
  }
}
