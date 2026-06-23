import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly api = inject(ApiService);

  getConversations(): Observable<any> {
    return this.api.get<any>('/chat/conversations');
  }

  getMessages(conversationId: string, page = 1, limit = 50): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.api.get<any>(`/chat/conversations/${conversationId}/messages`, params);
  }

  sendMessage(conversationId: string, content: string): Observable<any> {
    return this.api.post<any>(`/chat/conversations/${conversationId}/messages`, { content });
  }

  startConversation(workerId: string, projectId?: string): Observable<any> {
    const payload: Record<string, string> = { workerId };
    if (projectId) {
      payload['projectId'] = projectId;
    }
    return this.api.post<any>('/chat/conversations', payload);
  }

  markAsRead(conversationId: string): Observable<any> {
    return this.api.patch<any>(`/chat/conversations/${conversationId}/read`, {});
  }
}
