import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { ToastService } from '@m3allem/ui-kit';
import { ProjectsActions } from '../../../store/projects/projects.actions';
import { selectAllProjects, selectProjectsLoading, selectProjectsError } from '../../../store/projects/projects.selectors';
import { ProposalsActions } from '../../../store/proposals/proposals.actions';
import { selectAllProposals, selectProposalsLoading, selectProposalsError } from '../../../store/proposals/proposals.selectors';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.css']
})
export class TestApiComponent implements OnInit {
  currentUser$ = this.userContext.user$;
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
    this.addLog('Test API Playground initialized with Projects & Proposals NgRx Store bindings.');
    
    // Log project selector events
    this.projects$.subscribe(projs => {
      this.addLog(`[NgRx Selector] Projects count: ${projs.length}`);
    });

    // Log proposal selector events
    this.proposals$.subscribe(props => {
      this.addLog(`[NgRx Selector] Proposals count: ${props.length}`);
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
      role: 'worker'
    };

    this.addLog(`Registering worker: ${payload.email}...`);
    this.authService.register(payload).subscribe({
      next: (res) => {
        this.addLog(`Registration Success: ${res.message}`);
        this.toast.success('Registered successfully! 🎉');
      },
      error: (err) => {
        this.addLog(`Registration Error: ${err.message || JSON.stringify(err)}`);
        this.toast.error('Registration failed.');
      }
    });
  }

  testLoginClient(): void {
    const payload = {
      email: 'client@mail.com',
      password: 'password123'
    };

    this.addLog(`Logging in as client...`);
    this.authService.login(payload).subscribe({
      next: (res) => {
        this.addLog(`Login Success: Welcome ${res.data?.user?.name}`);
        this.toast.success('Logged in as Client!');
      },
      error: (err) => {
        this.addLog(`Login Error: Please check credentials or register first.`);
        this.toast.error('Login failed.');
      }
    });
  }

  testLoginWorker(): void {
    const payload = {
      email: 'worker@mail.com',
      password: 'password123'
    };

    this.addLog(`Logging in as worker...`);
    this.authService.login(payload).subscribe({
      next: (res) => {
        this.addLog(`Login Success: Welcome ${res.data?.user?.name}`);
        this.toast.success('Logged in as Worker!');
      },
      error: (err) => {
        this.addLog(`Login Error: Please check credentials or register first.`);
        this.toast.error('Login failed.');
      }
    });
  }

  testLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.addLog('Logged out successfully.');
        this.toast.success('Session cleared.');
      },
      error: () => {
        this.addLog('Local session cleared.');
        this.toast.success('Session cleared.');
      }
    });
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
}
