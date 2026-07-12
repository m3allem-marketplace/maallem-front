import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../core/services/todo.service';
import { ToastService } from '@m3allem/ui-kit';
import { Todo } from '../../../core/models/todo.model';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';

interface RenovationItem {
  id: string;
  title: string;
  money: number;
  workers: string;
  materials: string;
  status: 'pending' | 'scheduled' | 'completed';
  todoObject: Todo;
  workerId?: string;
  workerAvatar?: string;
}

@Component({
  selector: 'app-flat-renovation',
  templateUrl: './flat-renovation.component.html',
  styleUrls: ['./flat-renovation.component.css']
})
export class FlatRenovationComponent implements OnInit {
  loading = false;
  saving = false;
  items: RenovationItem[] = [];
  isLocalStorageFallback = false;
  
  // Workers List from site
  workersList: any[] = [];
  filteredWorkersList: any[] = [];

  // Stats
  totalBudget = 0;
  completedBudget = 0;
  progressPercentage = 0;

  // Modals / Form State
  showModal = false;
  isEditMode = false;
  currentItemId = '';
  
  formTitle = '';
  formMoney = 0;
  formWorkers = '';
  formMaterials = '';
  formStatus: 'pending' | 'scheduled' | 'completed' = 'pending';
  
  // Worker selection form state
  workerType: 'registered' | 'custom' = 'custom';
  selectedWorkerProfileId = '';
  formWorkerId = '';
  formWorkerAvatar = '';

  constructor(
    private todoService: TodoService,
    private workerProfileService: WorkerProfileService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRenovationData();
    this.loadWorkers();
  }

  loadWorkers(): void {
    this.workerProfileService.getWorkerProfiles().subscribe({
      next: (res) => {
        this.workersList = res?.data?.profiles || res?.data || [];
        this.filterWorkersBySpecialty();
      },
      error: (err) => {
        console.warn('Failed to load workers from server, skipping registration binding:', err);
      }
    });
  }

  filterWorkersBySpecialty(): void {
    if (!this.formTitle) {
      this.filteredWorkersList = this.workersList;
      return;
    }
    const titleLower = this.formTitle.toLowerCase();
    let specMatch = '';
    if (titleLower.includes('كهربا')) {
      specMatch = 'كهرباء';
    } else if (titleLower.includes('سباك')) {
      specMatch = 'سباكة';
    } else if (titleLower.includes('نجار')) {
      specMatch = 'نجارة';
    } else if (titleLower.includes('دهان') || titleLower.includes('نقاش')) {
      specMatch = 'دهانات';
    } else if (titleLower.includes('سيراميك') || titleLower.includes('بلاط')) {
      specMatch = 'سيراميك';
    }

    if (specMatch) {
      this.filteredWorkersList = this.workersList.filter(w => {
        const specs = w.specializations || [];
        return specs.some((s: string) => s.toLowerCase().includes(specMatch));
      });
    } else {
      this.filteredWorkersList = this.workersList;
    }
  }

  onTitleChange(): void {
    this.filterWorkersBySpecialty();
  }

  onWorkerSelected(): void {
    const selected = this.workersList.find(w => w._id === this.selectedWorkerProfileId);
    if (selected) {
      this.formWorkers = selected.knownWorkerName || selected.user?.name || '';
      this.formWorkerId = selected._id || ''; // Profile ID
      this.formWorkerAvatar = selected.avatar || '';
    } else {
      this.formWorkers = '';
      this.formWorkerId = '';
      this.formWorkerAvatar = '';
    }
  }

  loadRenovationData(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (res) => {
        const rawTodos: Todo[] = res.data?.todos || res.data || [];
        this.items = rawTodos.map(todo => {
          const parsed = this.parseDescription(todo.description);
          return {
            id: todo._id || '',
            title: todo.title,
            money: parsed.money || 0,
            workers: parsed.workers || '',
            materials: parsed.materials || '',
            status: todo.status,
            todoObject: todo,
            workerId: parsed.workerId || '',
            workerAvatar: parsed.workerAvatar || ''
          };
        });
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.warn('Backend Todos API failed (500), falling back to LocalStorage:', err);
        this.isLocalStorageFallback = true;
        this.loadFromLocalStorage();
      }
    });
  }

  loadFromLocalStorage(): void {
    try {
      const data = localStorage.getItem('maallem_flat_todos');
      const list: Todo[] = data ? JSON.parse(data) : [];
      this.items = list.map(todo => {
        const parsed = this.parseDescription(todo.description);
        return {
          id: todo._id || '',
          title: todo.title,
          money: parsed.money || 0,
          workers: parsed.workers || '',
          materials: parsed.materials || '',
          status: todo.status,
          todoObject: todo,
          workerId: parsed.workerId || '',
          workerAvatar: parsed.workerAvatar || ''
        };
      });
      this.calculateStats();
    } catch (e) {
      console.error('Failed to parse local storage todos', e);
      this.items = [];
    }
    this.loading = false;
  }

  saveToLocalStorage(todos: Todo[]): void {
    localStorage.setItem('maallem_flat_todos', JSON.stringify(todos));
  }

  parseDescription(desc: string): { money: number; workers: string; materials: string; workerId?: string; workerAvatar?: string } {
    if (!desc) {
      return { money: 0, workers: '', materials: '', workerId: '', workerAvatar: '' };
    }
    try {
      const obj = JSON.parse(desc);
      return {
        money: Number(obj.money) || 0,
        workers: obj.workers || '',
        materials: obj.materials || '',
        workerId: obj.workerId || '',
        workerAvatar: obj.workerAvatar || ''
      };
    } catch (e) {
      return { money: 0, workers: '', materials: desc, workerId: '', workerAvatar: '' };
    }
  }

  serializeDescription(money: number, workers: string, materials: string, workerId?: string, workerAvatar?: string): string {
    return JSON.stringify({ money, workers, materials, workerId, workerAvatar });
  }

  calculateStats(): void {
    if (this.items.length === 0) {
      this.totalBudget = 0;
      this.completedBudget = 0;
      this.progressPercentage = 0;
      return;
    }

    this.totalBudget = this.items.reduce((sum, item) => sum + item.money, 0);
    this.completedBudget = this.items
      .filter(item => item.status === 'completed')
      .reduce((sum, item) => sum + item.money, 0);

    const completedCount = this.items.filter(item => item.status === 'completed').length;
    this.progressPercentage = Math.round((completedCount / this.items.length) * 100);
  }

  initializeDefaultTasks(): void {
    this.saving = true;
    const defaults = [
      { title: 'الكهرباء', desc: this.serializeDescription(0, '', '', '', '') },
      { title: 'السباكة', desc: this.serializeDescription(0, '', '', '', '') },
      { title: 'النجارة', desc: this.serializeDescription(0, '', '', '', '') }
    ];

    if (this.isLocalStorageFallback) {
      const dummyTodos: Todo[] = defaults.map((d, index) => ({
        _id: 'local-todo-' + Date.now() + '-' + index,
        title: d.title,
        description: d.desc,
        status: 'pending',
        createdAt: new Date().toISOString()
      }));
      this.saveToLocalStorage(dummyTodos);
      this.toast.success('تم تهيئة البنود الأساسية محلياً (LocalStorage)');
      this.loadFromLocalStorage();
      this.saving = false;
      return;
    }

    let completedRequests = 0;
    defaults.forEach(task => {
      this.todoService.createTodo({
        title: task.title,
        description: task.desc,
        status: 'pending'
      }).subscribe({
        next: () => {
          completedRequests++;
          if (completedRequests === defaults.length) {
            this.toast.success('تم تهيئة البنود الأساسية بنجاح');
            this.loadRenovationData();
            this.saving = false;
          }
        },
        error: (err) => {
          console.error('Error creating default task', err);
          completedRequests++;
          if (completedRequests === defaults.length) {
            this.loadRenovationData();
            this.saving = false;
          }
        }
      });
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentItemId = '';
    this.formTitle = '';
    this.formMoney = 0;
    this.formWorkers = '';
    this.formMaterials = '';
    this.formStatus = 'pending';
    this.workerType = 'custom';
    this.selectedWorkerProfileId = '';
    this.formWorkerId = '';
    this.formWorkerAvatar = '';
    this.filterWorkersBySpecialty();
    this.showModal = true;
  }

  openEditModal(item: RenovationItem): void {
    this.isEditMode = true;
    this.currentItemId = item.id;
    this.formTitle = item.title;
    this.formMoney = item.money;
    this.formWorkers = item.workers;
    this.formMaterials = item.materials;
    this.formStatus = item.status;
    this.formWorkerId = item.workerId || '';
    this.formWorkerAvatar = item.workerAvatar || '';
    
    if (this.formWorkerId) {
      this.workerType = 'registered';
      this.selectedWorkerProfileId = this.formWorkerId;
    } else {
      this.workerType = 'custom';
      this.selectedWorkerProfileId = '';
    }

    this.filterWorkersBySpecialty();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveItem(): void {
    if (!this.formTitle.trim()) {
      this.toast.warning('يرجى إدخال اسم البند');
      return;
    }

    if (this.workerType === 'custom') {
      this.formWorkerId = '';
      this.formWorkerAvatar = '';
    }

    this.saving = true;
    const desc = this.serializeDescription(this.formMoney, this.formWorkers, this.formMaterials, this.formWorkerId, this.formWorkerAvatar);

    if (this.isLocalStorageFallback) {
      const currentTodosData = localStorage.getItem('maallem_flat_todos');
      let currentTodos: Todo[] = currentTodosData ? JSON.parse(currentTodosData) : [];

      if (this.isEditMode) {
        currentTodos = currentTodos.map(todo => {
          if (todo._id === this.currentItemId) {
            return { ...todo, title: this.formTitle, description: desc, status: this.formStatus, updatedAt: new Date().toISOString() };
          }
          return todo;
        });
        this.toast.success('تم تحديث البند بنجاح (محلياً)');
      } else {
        const newTodo: Todo = {
          _id: 'local-todo-' + Date.now(),
          title: this.formTitle,
          description: desc,
          status: this.formStatus,
          createdAt: new Date().toISOString()
        };
        currentTodos.push(newTodo);
        this.toast.success('تم إضافة البند بنجاح (محلياً)');
      }

      this.saveToLocalStorage(currentTodos);
      this.loadFromLocalStorage();
      this.showModal = false;
      this.saving = false;
      return;
    }

    if (this.isEditMode) {
      this.todoService.updateTodo(this.currentItemId, {
        title: this.formTitle,
        description: desc,
        status: this.formStatus
      }).subscribe({
        next: () => {
          this.toast.success('تم تحديث البند بنجاح');
          this.loadRenovationData();
          this.showModal = false;
          this.saving = false;
        },
        error: (err) => {
          console.error(err);
          this.toast.error('فشل تحديث البند');
          this.saving = false;
        }
      });
    } else {
      this.todoService.createTodo({
        title: this.formTitle,
        description: desc,
        status: this.formStatus
      }).subscribe({
        next: () => {
          this.toast.success('تم إضافة البند بنجاح');
          this.loadRenovationData();
          this.showModal = false;
          this.saving = false;
        },
        error: (err) => {
          console.error(err);
          this.toast.error('فشل إضافة البند');
          this.saving = false;
        }
      });
    }
  }

  updateItemStatus(item: RenovationItem, newStatus: 'pending' | 'scheduled' | 'completed'): void {
    const desc = this.serializeDescription(item.money, item.workers, item.materials, item.workerId, item.workerAvatar);

    if (this.isLocalStorageFallback) {
      const currentTodosData = localStorage.getItem('maallem_flat_todos');
      let currentTodos: Todo[] = currentTodosData ? JSON.parse(currentTodosData) : [];
      currentTodos = currentTodos.map(todo => {
        if (todo._id === item.id) {
          return { ...todo, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return todo;
      });
      this.saveToLocalStorage(currentTodos);
      this.toast.success('تم تحديث حالة البند (محلياً)');
      this.loadFromLocalStorage();
      return;
    }

    this.todoService.updateTodo(item.id, {
      title: item.title,
      description: desc,
      status: newStatus
    }).subscribe({
      next: () => {
        this.toast.success('تم تحديث حالة البند');
        this.loadRenovationData();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('فشل تحديث حالة البند');
      }
    });
  }

  deleteItem(id: string): void {
    if (confirm('هل أنت متأكد من حذف هذا البند؟')) {
      if (this.isLocalStorageFallback) {
        const currentTodosData = localStorage.getItem('maallem_flat_todos');
        let currentTodos: Todo[] = currentTodosData ? JSON.parse(currentTodosData) : [];
        currentTodos = currentTodos.filter(todo => todo._id !== id);
        this.saveToLocalStorage(currentTodos);
        this.toast.success('تم حذف البند بنجاح (محلياً)');
        this.loadFromLocalStorage();
        return;
      }

      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.toast.success('تم حذف البند بنجاح');
          this.loadRenovationData();
        },
        error: (err) => {
          console.error(err);
          this.toast.error('فشل حذف البند');
        }
      });
    }
  }

  getIconForTitle(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('كهربا')) return '⚡';
    if (t.includes('سباك')) return '🔧';
    if (t.includes('نجار')) return '🪚';
    if (t.includes('دهان') || t.includes('نقاش')) return '🎨';
    if (t.includes('سيراميك') || t.includes('بلاط')) return '🧱';
    return '📋';
  }
}
