import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../core/services/todo.service';
import { ToastService } from '@m3allem/ui-kit';
import { Todo, TodoWorker, TodoProgressLog, CreateTodoRequest, UpdateTodoRequest } from '../../../core/models/todo.model';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';

@Component({
  selector: 'app-flat-renovation',
  templateUrl: './flat-renovation.component.html',
  styleUrls: ['./flat-renovation.component.css']
})
export class FlatRenovationComponent implements OnInit {
  loading = false;
  saving = false;
  items: Todo[] = [];
  isLocalStorageFallback = false;
  
  // Registered Workers List from platform
  workersList: any[] = [];
  filteredWorkersList: any[] = [];

  // Overall Statistics
  totalQuantityItems = 0;
  underInspectionCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  overallProgress = 0;
  totalEstimatedCost = 0;
  totalLiveCost = 0;

  // Active Filters
  selectedCategory = 'All';
  selectedStatusFilter = 'All';

  // Modal Views
  showModal = false;
  isEditMode = false;
  currentItemId = '';

  // Progress Log Modal
  showProgressModal = false;
  logAddedQuantity = 0;
  logNote = '';
  progressTargetItem: Todo | null = null;

  // Inspection Approval Modal
  showApproveModal = false;
  approveInspectorName = '';
  approveNotes = '';
  approveTargetItem: Todo | null = null;

  // Form State
  formTitle = '';
  formDescription = '';
  formCategory = 'الكهرباء';
  formPriority: 'Low' | 'Medium' | 'High' | 'Urgent' = 'Medium';
  formLocation = '';
  
  // Smart Quantities Form
  formQuantityTarget = 1;
  formQuantityUnit = 'متر';

  // Workers Form Array
  formWorkers: TodoWorker[] = [];

  // Timeline Form
  formExpectedStartDate = '';
  formExpectedEndDate = '';

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
        this.filteredWorkersList = this.workersList;
      },
      error: (err) => {
        console.warn('Failed to load platform workers, custom names will be used:', err);
      }
    });
  }

  loadRenovationData(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (res) => {
        const rawTodos: Todo[] = res.data?.todos || res.data || [];
        this.items = rawTodos.map(todo => this.ensureSmartTodoFields(todo));
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
      const data = localStorage.getItem('maallem_smart_todos');
      const list: Todo[] = data ? JSON.parse(data) : [];
      this.items = list.map(todo => this.ensureSmartTodoFields(todo));
      this.calculateStats();
    } catch (e) {
      console.error('Failed to parse local storage todos', e);
      this.items = [];
    }
    this.loading = false;
  }

  saveToLocalStorage(todos: Todo[]): void {
    localStorage.setItem('maallem_smart_todos', JSON.stringify(todos));
  }

  // Ensures backward compatibility with legacy database items
  ensureSmartTodoFields(todo: Todo): Todo {
    const smart = { ...todo };

    // Standardize status capitalization
    if (smart.status === 'pending') smart.status = 'Pending';
    else if (smart.status === 'scheduled') smart.status = 'In Progress';
    else if (smart.status === 'completed') smart.status = 'Completed';

    // Parse legacy description JSON if quantity details are missing
    if (!smart.quantity) {
      const legacy = this.parseDescription(todo.description || '');
      smart.quantity = {
        target: legacy.money || 1, // Use old money as target quantity/budget
        completed: smart.status === 'Completed' ? (legacy.money || 1) : 0,
        unit: 'مقطوعية'
      };
      
      smart.workers = [];
      if (legacy.workers) {
        smart.workers.push({
          name: legacy.workers,
          source: 'External',
          role: 'صنايعي وباص',
          dailyRate: 350
        });
      }

      smart.description = legacy.materials || todo.description || '';
      smart.category = this.getCategoryFromTitle(todo.title);
      smart.priority = 'Medium';
      smart.location = 'الموقع';
      smart.timeline = {
        expectedEndDate: todo.scheduledDate
      };
      smart.progressLogs = [];
      smart.inspection = { isApproved: smart.status === 'Completed' };
    }

    return smart;
  }

  parseDescription(desc: string): { money: number; workers: string; materials: string } {
    if (!desc) {
      return { money: 0, workers: '', materials: '' };
    }
    try {
      const obj = JSON.parse(desc);
      return {
        money: Number(obj.money) || 0,
        workers: obj.workers || '',
        materials: obj.materials || ''
      };
    } catch (e) {
      return { money: 0, workers: '', materials: desc };
    }
  }

  getCategoryFromTitle(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('كهربا')) return 'الكهرباء';
    if (t.includes('سباك')) return 'السباكة';
    if (t.includes('نجار') || t.includes('باب')) return 'النجارة';
    if (t.includes('دهان') || t.includes('نقاش') || t.includes('حوائط')) return 'الدهانات';
    if (t.includes('سيراميك') || t.includes('بلاط')) return 'السيراميك';
    if (t.includes('محارة') || t.includes('لياسة')) return 'المحارة';
    return 'أخرى';
  }

  getIconForCategory(category: string): string {
    const c = category || '';
    if (c.includes('كهربا')) return '⚡';
    if (c.includes('سباك')) return '🔧';
    if (c.includes('نجار')) return '🪚';
    if (c.includes('دهان') || c.includes('نقاش')) return '🎨';
    if (c.includes('سيراميك') || c.includes('بلاط')) return '🧱';
    if (c.includes('محارة')) return '🍦';
    return '📋';
  }

  calculateStats(): void {
    if (this.items.length === 0) {
      this.totalQuantityItems = 0;
      this.underInspectionCount = 0;
      this.inProgressCount = 0;
      this.completedCount = 0;
      this.overallProgress = 0;
      this.totalEstimatedCost = 0;
      this.totalLiveCost = 0;
      return;
    }

    this.totalQuantityItems = this.items.length;
    this.underInspectionCount = this.items.filter(i => i.status === 'Under Inspection').length;
    this.inProgressCount = this.items.filter(i => i.status === 'In Progress').length;
    this.completedCount = this.items.filter(i => i.status === 'Completed').length;

    // Calculate overall completed ratio
    const totalTarget = this.items.reduce((sum, i) => sum + (i.quantity?.target || 0), 0);
    const totalCompleted = this.items.reduce((sum, i) => sum + (i.quantity?.completed || 0), 0);
    this.overallProgress = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

    // Calculate labor costs
    this.totalEstimatedCost = this.items.reduce((sum, item) => sum + this.getEstimatedCost(item), 0);
    this.totalLiveCost = this.items.reduce((sum, item) => sum + this.getLiveCost(item), 0);
  }

  // Calculate projected budget (expected duration * worker daily rates)
  getEstimatedCost(item: Todo): number {
    if (!item.workers || item.workers.length === 0) return 0;
    const dailyRateSum = item.workers.reduce((s, w) => s + (w.dailyRate || 0), 0);
    
    let days = 3; // Default assumption if dates missing
    if (item.timeline?.expectedStartDate && item.timeline?.expectedEndDate) {
      const start = new Date(item.timeline.expectedStartDate).getTime();
      const end = new Date(item.timeline.expectedEndDate).getTime();
      const diff = end - start;
      days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days <= 0) days = 1;
    }
    return days * dailyRateSum;
  }

  // Calculate actual live costing (active days * worker daily rates)
  getLiveCost(item: Todo): number {
    if (!item.workers || item.workers.length === 0) return 0;
    const dailyRateSum = item.workers.reduce((s, w) => s + (w.dailyRate || 0), 0);

    if (item.status === 'Pending') return 0;

    let days = 1;
    if (item.timeline?.actualStartDate) {
      const start = new Date(item.timeline.actualStartDate).getTime();
      const end = item.timeline.actualEndDate 
        ? new Date(item.timeline.actualEndDate).getTime() 
        : new Date().getTime();
      const diff = end - start;
      days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days <= 0) days = 1;
    }
    return days * dailyRateSum;
  }

  getFilteredItems(): Todo[] {
    return this.items.filter(item => {
      const categoryMatch = this.selectedCategory === 'All' || item.category === this.selectedCategory;
      const statusMatch = this.selectedStatusFilter === 'All' || item.status === this.selectedStatusFilter;
      return categoryMatch && statusMatch;
    });
  }

  initializeDefaultTasks(): void {
    this.saving = true;
    
    // Default smart tasks configurations
    const defaults = [
      {
        title: 'أعمال الكهرباء - تأسيس خراطيم وعلب علوية',
        category: 'الكهرباء',
        quantity: { target: 120, unit: 'علبة' },
        workers: [{ name: 'م/ عادل كهربائي', source: 'External' as const, role: 'صنايعي كهرباء', dailyRate: 400 }],
        timeline: {
          expectedStartDate: new Date().toISOString().split('T')[0],
          expectedEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      },
      {
        title: 'تأسيس شبكة السباكة والحمامات وعزل الأرضية',
        category: 'السباكة',
        quantity: { target: 35, unit: 'متر طولي' },
        workers: [{ name: 'الأسطى حسن سباك', source: 'External' as const, role: 'مقاول سباكة', dailyRate: 500 }],
        timeline: {
          expectedStartDate: new Date().toISOString().split('T')[0],
          expectedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      },
      {
        title: 'محارة الجدران والأسقف الداخلية للصالة والغرف',
        category: 'المحارة',
        quantity: { target: 250, unit: 'متر مربع' },
        workers: [{ name: 'الأسطى علي محار', source: 'External' as const, role: 'صنايعي محارة', dailyRate: 350 }],
        timeline: {
          expectedStartDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          expectedEndDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }
    ];

    if (this.isLocalStorageFallback) {
      const dummyTodos: Todo[] = defaults.map((d, index) => ({
        _id: 'local-smart-todo-' + Date.now() + '-' + index,
        title: d.title,
        category: d.category,
        quantity: { target: d.quantity.target, completed: 0, unit: d.quantity.unit },
        workers: d.workers,
        timeline: {
          expectedStartDate: d.timeline.expectedStartDate,
          expectedEndDate: d.timeline.expectedEndDate
        },
        status: 'Pending',
        progressLogs: [],
        inspection: { isApproved: false },
        createdAt: new Date().toISOString()
      }));
      
      const current = localStorage.getItem('maallem_smart_todos');
      let currentTodos: Todo[] = current ? JSON.parse(current) : [];
      currentTodos = [...currentTodos, ...dummyTodos];
      this.saveToLocalStorage(currentTodos);
      this.toast.success('تم تهيئة البنود الذكية محلياً بنجاح');
      this.loadFromLocalStorage();
      this.saving = false;
      return;
    }

    let completedRequests = 0;
    defaults.forEach(task => {
      this.todoService.createTodo({
        title: task.title,
        category: task.category,
        quantity: task.quantity,
        workers: task.workers,
        timeline: task.timeline,
        status: 'Pending'
      }).subscribe({
        next: () => {
          completedRequests++;
          if (completedRequests === defaults.length) {
            this.toast.success('تم تهيئة البنود الذكية بنجاح');
            this.loadRenovationData();
            this.saving = false;
          }
        },
        error: (err) => {
          console.error(err);
          completedRequests++;
          if (completedRequests === defaults.length) {
            this.loadRenovationData();
            this.saving = false;
          }
        }
      });
    });
  }

  // Workers Array Handling in Form
  addWorker(): void {
    this.formWorkers.push({
      name: '',
      source: 'External',
      role: 'صنايعي',
      dailyRate: 350,
      assignedQuantity: 0
    });
  }

  removeWorker(index: number): void {
    this.formWorkers.splice(index, 1);
  }

  onRegisteredWorkerSelected(workerProfileId: string, index: number): void {
    const selected = this.workersList.find(w => w._id === workerProfileId);
    if (selected) {
      this.formWorkers[index].name = selected.knownWorkerName || selected.user?.name || '';
      this.formWorkers[index].source = 'Internal';
      this.formWorkers[index].role = selected.specializations?.join(', ') || 'صنايعي مسجل';
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentItemId = '';
    this.formTitle = '';
    this.formDescription = '';
    this.formCategory = 'الكهرباء';
    this.formPriority = 'Medium';
    this.formLocation = '';
    this.formQuantityTarget = 1;
    this.formQuantityUnit = 'متر';
    this.formExpectedStartDate = '';
    this.formExpectedEndDate = '';
    this.formWorkers = [];
    this.showModal = true;
  }

  openEditModal(item: Todo): void {
    this.isEditMode = true;
    this.currentItemId = item._id || '';
    this.formTitle = item.title;
    this.formDescription = item.description || '';
    this.formCategory = item.category || 'الكهرباء';
    this.formPriority = item.priority || 'Medium';
    this.formLocation = item.location || '';
    this.formQuantityTarget = item.quantity?.target || 1;
    this.formQuantityUnit = item.quantity?.unit || 'متر';
    
    // Formatting dates for inputs
    this.formExpectedStartDate = item.timeline?.expectedStartDate 
      ? new Date(item.timeline.expectedStartDate).toISOString().split('T')[0] 
      : '';
    this.formExpectedEndDate = item.timeline?.expectedEndDate 
      ? new Date(item.timeline.expectedEndDate).toISOString().split('T')[0] 
      : '';

    this.formWorkers = item.workers ? JSON.parse(JSON.stringify(item.workers)) : [];
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
    if (this.formQuantityTarget <= 0) {
      this.toast.warning('يرجى تحديد كمية مستهدفة صالحة');
      return;
    }

    this.saving = true;

    if (this.isLocalStorageFallback) {
      const currentData = localStorage.getItem('maallem_smart_todos');
      let currentTodos: Todo[] = currentData ? JSON.parse(currentData) : [];

      if (this.isEditMode) {
        currentTodos = currentTodos.map(todo => {
          if (todo._id === this.currentItemId) {
            return {
              ...todo,
              title: this.formTitle,
              description: this.formDescription,
              category: this.formCategory,
              priority: this.formPriority,
              location: this.formLocation,
              quantity: {
                target: this.formQuantityTarget,
                completed: todo.quantity?.completed || 0,
                unit: this.formQuantityUnit
              },
              workers: this.formWorkers.filter(w => w.name.trim() !== ''),
              timeline: {
                ...todo.timeline,
                expectedStartDate: this.formExpectedStartDate || undefined,
                expectedEndDate: this.formExpectedEndDate || undefined
              },
              updatedAt: new Date().toISOString()
            };
          }
          return todo;
        });
        this.toast.success('تم تحديث البند بنجاح (محلياً)');
      } else {
        const newTodo: Todo = {
          _id: 'local-smart-todo-' + Date.now(),
          title: this.formTitle,
          description: this.formDescription,
          category: this.formCategory,
          priority: this.formPriority,
          location: this.formLocation,
          status: 'Pending',
          quantity: {
            target: this.formQuantityTarget,
            completed: 0,
            unit: this.formQuantityUnit
          },
          workers: this.formWorkers.filter(w => w.name.trim() !== ''),
          timeline: {
            expectedStartDate: this.formExpectedStartDate || undefined,
            expectedEndDate: this.formExpectedEndDate || undefined
          },
          progressLogs: [],
          inspection: { isApproved: false },
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
      const payload: UpdateTodoRequest = {
        title: this.formTitle,
        description: this.formDescription,
        category: this.formCategory,
        priority: this.formPriority,
        location: this.formLocation,
        quantity: {
          target: this.formQuantityTarget,
          unit: this.formQuantityUnit
        },
        workers: this.formWorkers.filter(w => w.name.trim() !== ''),
        timeline: {
          expectedStartDate: this.formExpectedStartDate || undefined,
          expectedEndDate: this.formExpectedEndDate || undefined
        }
      };

      this.todoService.updateTodo(this.currentItemId, payload).subscribe({
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
      const payload: CreateTodoRequest = {
        title: this.formTitle,
        description: this.formDescription,
        category: this.formCategory,
        priority: this.formPriority,
        location: this.formLocation,
        quantity: {
          target: this.formQuantityTarget,
          unit: this.formQuantityUnit
        },
        workers: this.formWorkers.filter(w => w.name.trim() !== ''),
        timeline: {
          expectedStartDate: this.formExpectedStartDate || undefined,
          expectedEndDate: this.formExpectedEndDate || undefined
        },
        status: 'Pending'
      };

      this.todoService.createTodo(payload).subscribe({
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

  // Progress Logging Dialog Actions
  openProgressModal(item: Todo): void {
    this.progressTargetItem = item;
    this.logAddedQuantity = 0;
    this.logNote = '';
    this.showProgressModal = true;
  }

  closeProgressModal(): void {
    this.showProgressModal = false;
    this.progressTargetItem = null;
  }

  saveProgress(): void {
    if (!this.progressTargetItem) return;
    if (this.logAddedQuantity <= 0) {
      this.toast.warning('يرجى إدخال كمية مضافة صالحة');
      return;
    }

    this.saving = true;

    if (this.isLocalStorageFallback) {
      const currentData = localStorage.getItem('maallem_smart_todos');
      let currentTodos: Todo[] = currentData ? JSON.parse(currentData) : [];

      currentTodos = currentTodos.map(todo => {
        if (todo._id === this.progressTargetItem?._id) {
          const itemCopy = { ...todo };
          if (!itemCopy.progressLogs) itemCopy.progressLogs = [];
          
          itemCopy.progressLogs.push({
            updatedBy: 'صاحب الموقع (أنت)',
            date: new Date().toISOString(),
            addedQuantity: this.logAddedQuantity,
            note: this.logNote
          });

          const currentCompleted = itemCopy.quantity?.completed || 0;
          const target = itemCopy.quantity?.target || 1;
          const newCompleted = currentCompleted + this.logAddedQuantity;
          
          itemCopy.quantity = {
            target,
            completed: newCompleted,
            unit: itemCopy.quantity?.unit || 'متر'
          };

          if (itemCopy.status === 'Pending') {
            itemCopy.status = 'In Progress';
            itemCopy.timeline = {
              ...itemCopy.timeline,
              actualStartDate: new Date().toISOString()
            };
          }

          if (newCompleted >= target) {
            itemCopy.status = 'Under Inspection';
            itemCopy.timeline = {
              ...itemCopy.timeline,
              actualEndDate: new Date().toISOString()
            };
          }

          return itemCopy;
        }
        return todo;
      });

      this.saveToLocalStorage(currentTodos);
      this.loadFromLocalStorage();
      this.toast.success('تم تسجيل تقدم الأعمال بنجاح');
      this.closeProgressModal();
      this.saving = false;
      return;
    }

    // Prepare updated item copy
    const itemCopy = { ...this.progressTargetItem };
    if (!itemCopy.progressLogs) itemCopy.progressLogs = [];
    
    // Add progress log
    itemCopy.progressLogs = [
      ...itemCopy.progressLogs,
      {
        updatedBy: 'العميل',
        addedQuantity: this.logAddedQuantity,
        note: this.logNote,
        date: new Date().toISOString()
      }
    ];

    // Update quantities
    if (!itemCopy.quantity) {
      itemCopy.quantity = { target: 1, completed: 0, unit: 'متر' };
    }
    const currentCompleted = itemCopy.quantity.completed || 0;
    itemCopy.quantity = {
      ...itemCopy.quantity,
      completed: currentCompleted + this.logAddedQuantity
    };

    // Auto status / timeline triggers
    if (itemCopy.status === 'Pending') {
      itemCopy.status = 'In Progress';
      itemCopy.timeline = {
        ...itemCopy.timeline,
        actualStartDate: new Date().toISOString()
      };
    }

    if (itemCopy.quantity.completed >= itemCopy.quantity.target) {
      itemCopy.status = 'Under Inspection';
      itemCopy.timeline = {
        ...itemCopy.timeline,
        actualEndDate: new Date().toISOString()
      };
    }

    this.todoService.updateTodo(itemCopy._id || '', itemCopy).subscribe({
      next: () => {
        this.toast.success('تم تسجيل تقدم الأعمال بنجاح');
        this.loadRenovationData();
        this.closeProgressModal();
        this.saving = false;
      },
      error: (err) => {
        console.error(err);
        this.toast.error('فشل تسجيل تقدم الأعمال');
        this.saving = false;
      }
    });
  }

  // Inspection Approval Dialog Actions
  openApproveModal(item: Todo): void {
    this.approveTargetItem = item;
    this.approveInspectorName = '';
    this.approveNotes = '';
    this.showApproveModal = true;
  }

  closeApproveModal(): void {
    this.showApproveModal = false;
    this.approveTargetItem = null;
  }

  saveApprove(): void {
    if (!this.approveTargetItem) return;
    if (!this.approveInspectorName.trim()) {
      this.toast.warning('يرجى إدخال اسم المهندس المستلم');
      return;
    }

    this.saving = true;

    if (this.isLocalStorageFallback) {
      const currentData = localStorage.getItem('maallem_smart_todos');
      let currentTodos: Todo[] = currentData ? JSON.parse(currentData) : [];

      currentTodos = currentTodos.map(todo => {
        if (todo._id === this.approveTargetItem?._id) {
          const itemCopy = { ...todo };
          itemCopy.inspection = {
            isApproved: true,
            approvedBy: this.approveInspectorName,
            notes: this.approveNotes,
            date: new Date().toISOString()
          };
          itemCopy.status = 'Completed';
          if (!itemCopy.timeline) itemCopy.timeline = {};
          itemCopy.timeline.actualEndDate = new Date().toISOString();
          return itemCopy;
        }
        return todo;
      });

      this.saveToLocalStorage(currentTodos);
      this.loadFromLocalStorage();
      this.toast.success('تم اعتماد واستلام البند بنجاح');
      this.closeApproveModal();
      this.saving = false;
      return;
    }

    const itemCopy = { ...this.approveTargetItem };
    itemCopy.inspection = {
      isApproved: true,
      approvedBy: this.approveInspectorName,
      notes: this.approveNotes,
      date: new Date().toISOString()
    };
    itemCopy.status = 'Completed';
    itemCopy.timeline = {
      ...itemCopy.timeline,
      actualEndDate: new Date().toISOString()
    };

    this.todoService.updateTodo(itemCopy._id || '', itemCopy).subscribe({
      next: () => {
        this.toast.success('تم اعتماد واستلام البند بنجاح');
        this.loadRenovationData();
        this.closeApproveModal();
        this.saving = false;
      },
      error: (err) => {
        console.error(err);
        this.toast.error('فشل اعتماد البند');
        this.saving = false;
      }
    });
  }

  updateItemStatus(item: Todo, newStatus: any): void {
    const payload = { status: newStatus };

    if (this.isLocalStorageFallback) {
      const currentData = localStorage.getItem('maallem_smart_todos');
      let currentTodos: Todo[] = currentData ? JSON.parse(currentData) : [];
      currentTodos = currentTodos.map(todo => {
        if (todo._id === item._id) {
          const updated = { ...todo, status: newStatus, updatedAt: new Date().toISOString() };
          if (newStatus === 'In Progress' && !updated.timeline?.actualStartDate) {
            updated.timeline = { ...updated.timeline, actualStartDate: new Date().toISOString() };
          }
          if (newStatus === 'Completed' && !updated.timeline?.actualEndDate) {
            updated.timeline = { ...updated.timeline, actualEndDate: new Date().toISOString() };
          }
          return updated;
        }
        return todo;
      });
      this.saveToLocalStorage(currentTodos);
      this.toast.success('تم تحديث حالة البند');
      this.loadFromLocalStorage();
      return;
    }

    this.todoService.updateTodo(item._id || '', payload).subscribe({
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
    if (confirm('هل أنت متأكد من حذف هذا البند بالكامل؟')) {
      if (this.isLocalStorageFallback) {
        const currentData = localStorage.getItem('maallem_smart_todos');
        let currentTodos: Todo[] = currentData ? JSON.parse(currentData) : [];
        currentTodos = currentTodos.filter(todo => todo._id !== id);
        this.saveToLocalStorage(currentTodos);
        this.toast.success('تم حذف البند بنجاح');
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
}
