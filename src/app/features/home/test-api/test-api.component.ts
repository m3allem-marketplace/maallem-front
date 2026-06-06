import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { UserRole } from '../../../core/models/user.model';
import { ToastService } from '@m3allem/ui-kit';
import { ProjectsActions } from '../../../store/projects/projects.actions';
import { selectAllProjects, selectProjectsLoading, selectProjectsError } from '../../../store/projects/projects.selectors';
import { ProposalsActions } from '../../../store/proposals/proposals.actions';
import { selectAllProposals, selectProposalsLoading, selectProposalsError } from '../../../store/proposals/proposals.selectors';
import { NotificationsActions } from '../../../store/notifications/notifications.actions';
import { selectAllNotifications, selectUnreadCount, selectNotificationsLoading, selectNotificationsError } from '../../../store/notifications/notifications.selectors';
import * as AuthActions from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.css']
})
export class TestApiComponent implements OnInit {
  currentUser$ = this.userContext.currentUser$;
  isLoggedIn$ = this.userContext.isLoggedIn$;
  role$ = this.userContext.role$;

  // NgRx Store Streams - Projects
  projects$ = this.store.select(selectAllProjects);
  projectsLoading$ = this.store.select(selectProjectsLoading);
  projectsError$ = this.store.select(selectProjectsError);

  // NgRx Store Streams - Proposals
  proposals$ = this.store.select(selectAllProposals);
  proposalsLoading$ = this.store.select(selectProposalsLoading);
  proposalsError$ = this.store.select(selectProposalsError);

  // NgRx Store Streams - Notifications
  notifications$ = this.store.select(selectAllNotifications);
  unreadCount$ = this.store.select(selectUnreadCount);
  notificationsLoading$ = this.store.select(selectNotificationsLoading);
  notificationsError$ = this.store.select(selectNotificationsError);

  workers: any[] = [];
  logs: string[] = [];

  constructor(
    private store: Store,
    private authService: AuthService,
    private workerProfileService: WorkerProfileService,
    private userContext: UserContextService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.addLog('Test API Playground initialized with NgRx Store.');
    
    // Auto-load notifications at start to populate unread badge
    this.store.dispatch(NotificationsActions.loadNotifications());

    // Log selectors
    this.unreadCount$.subscribe(count => {
      this.addLog(`[NgRx Selector] Unread notifications count updated: ${count}`);
    });

    this.currentUser$.subscribe(user => {
      if (user) {
        this.addLog(`[Session State] User updated: ${user.name} (${user.role})`);
      } else {
        this.addLog(`[Session State] User cleared (logged out).`);
      }
    });
  }

  addLog(message: string): void {
    const time = new Date().toLocaleTimeString();
    this.logs.unshift(`[${time}] ${message}`);
  }

  testRegister(): void {
    const payload = {
      name: 'أحمد المقاول',
      email: `worker_${Date.now()}@mail.com`,
      phone: '01012345678',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'worker' as UserRole
    };

    this.addLog(`[NgRx Dispatch] Registering worker: ${payload.email}...`);
    this.store.dispatch(AuthActions.register({ payload }));
    this.toast.success('Registration action dispatched! Check console.');
  }

  testLoginClient(): void {
    const payload = {
      email: 'client@mail.com',
      password: 'password123'
    };

    this.addLog(`[NgRx Dispatch] Logging in as client...`);
    this.store.dispatch(AuthActions.login({ credentials: payload }));
    this.toast.success('Login action dispatched!');
  }

  testLoginWorker(): void {
    const payload = {
      email: 'worker@mail.com',
      password: 'password123'
    };

    this.addLog(`[NgRx Dispatch] Logging in as worker...`);
    this.store.dispatch(AuthActions.login({ credentials: payload }));
    this.toast.success('Login action dispatched!');
  }

  testLogout(): void {
    this.addLog(`[NgRx Dispatch] Terminating session (logout)...`);
    this.store.dispatch(AuthActions.logout());
    this.toast.success('Logout action dispatched!');
  }

  fetchProjects(): void {
    this.addLog('[NgRx Dispatch] Triggering ProjectsActions.loadProjects()');
    this.store.dispatch(ProjectsActions.loadProjects({}));
  }

  createProject(): void {
    const payload = {
      title: 'تصليح سباكة مطبخ عاجل',
      description: 'تسريب مياه أسفل حوض المطبخ يحتاج لتغيير الخراطيم بالكامل.',
      category: 'plumbing',
      budget: 350,
      location: {
        address: 'الدقي، الجيزة',
        city: 'الجيزة'
      }
    };

    this.addLog('[NgRx Dispatch] Triggering ProjectsActions.createProject()');
    this.store.dispatch(ProjectsActions.createProject({ payload }));
  }

  fetchProposals(): void {
    this.addLog('[NgRx Dispatch] Triggering ProposalsActions.loadMyProposals()');
    this.store.dispatch(ProposalsActions.loadMyProposals());
  }

  fetchWorkers(): void {
    this.addLog('Fetching public worker profiles...');
    this.workerProfileService.getWorkerProfiles().subscribe({
      next: (res) => {
        this.workers = res.data?.profiles || [];
        this.addLog(`Success: Loaded ${this.workers.length} worker profiles.`);
      },
      error: (err) => {
        this.addLog(`Error fetching workers: ${err.message}`);
      }
    });
  }

  markAllRead(): void {
    this.addLog('[NgRx Dispatch] Triggering NotificationsActions.markAllNotificationsRead()');
    this.store.dispatch(NotificationsActions.markAllNotificationsRead());
    this.toast.success('All notifications marked as read.');
  }

  simulateIncomingNotification(): void {
    const mockNotif = {
      id: `notif-${Date.now()}`,
      userId: 'me',
      type: 'SYSTEM' as any,
      title: 'تنبيه نظام جديد',
      body: 'تم استلام تحديث جديد للنظام من لوحة التحكم.',
      referenceId: null,
      referenceType: null,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.addLog('[NgRx Dispatch] Simulated Push: Triggering NotificationsActions.receiveNotification()');
    this.store.dispatch(NotificationsActions.receiveNotification({ notification: mockNotif }));
    this.toast.success('New system notification simulated! 🔔');
  }

  // ── UI Kit Showcase State ───────────────────────────────────────────────────
  showcaseSteps = ['بيانات الطلب', 'العروض المتاحة', 'تفاصيل الحجز', 'تأكيد العملية'];
  showcaseCurrentStep = 1;
  showcaseTimelineStatus = 'in-progress';
  showcaseExtras = [
    { label: 'قطع غيار مستوردة', price: 350 },
    { label: 'انتقال عاجل للموقع', price: 100 }
  ];
  showcaseConfirmOpen = false;

  prevShowcaseStep(): void {
    if (this.showcaseCurrentStep > 0) {
      this.showcaseCurrentStep--;
    }
  }

  nextShowcaseStep(): void {
    if (this.showcaseCurrentStep < this.showcaseSteps.length - 1) {
      this.showcaseCurrentStep++;
    }
  }

  setTimelineStatus(status: string): void {
    this.showcaseTimelineStatus = status;
  }

  openShowcaseConfirm(): void {
    this.showcaseConfirmOpen = true;
  }

  closeShowcaseConfirm(): void {
    this.showcaseConfirmOpen = false;
  }

  triggerConfirmAction(): void {
    this.toast.success('تم تأكيد العملية بنجاح! 🎉');
    this.showcaseConfirmOpen = false;
  }
}
