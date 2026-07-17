import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private api: ApiService) {}

  getTodos(status?: string): Observable<any> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.api.get<any>('/todos', params);
  }

  getTodoById(id: string): Observable<any> {
    return this.api.get<any>(`/todos/${id}`);
  }

  createTodo(payload: CreateTodoRequest): Observable<any> {
    return this.api.post<any>('/todos', payload);
  }

  updateTodo(id: string, payload: UpdateTodoRequest): Observable<any> {
    return this.api.put<any>(`/todos/${id}`, payload);
  }

  deleteTodo(id: string): Observable<any> {
    return this.api.delete<any>(`/todos/${id}`);
  }

  addProgressLog(id: string, payload: { addedQuantity: number; note?: string; updatedBy?: string }): Observable<any> {
    return this.api.post<any>(`/todos/${id}/progress`, payload);
  }

  approveInspection(id: string, payload: { approvedBy: string; notes?: string }): Observable<any> {
    return this.api.post<any>(`/todos/${id}/approve`, payload);
  }
}
