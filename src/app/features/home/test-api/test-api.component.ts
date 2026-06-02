import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/auth/auth.service';
import { ProposalService } from '../../../core/services/proposal.service';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { ToastService } from '@m3allem/ui-kit';
import { ProjectsActions } from '../../../store/projects/projects.actions';
import { selectAllProjects, selectProjectsLoading, selectProjectsError } from '../../../store/projects/projects.selectors';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.css']
})
export class TestApiComponent implements OnInit {
  currentUser$ = this.userContext.user$;
  isLoggedIn$ = this.userContext.isLoggedIn$;
  role$ = this.userContext.role$;

  // NgRx Store Streams
  projects$ = this.store.select(selectAllProjects);
  projectsLoading$ = this.store.select(selectProjectsLoading);
  projectsError$ = this.store.select(selectProjectsError);

  proposals: any[] = [];
  workers: any[] = [];
  logs: string[] = [];

  constructor(
    private store: Store,
    private authService: AuthService,
    private proposalService: ProposalService,
    private workerProfileService: WorkerProfileService,
    private userContext: UserContextService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.addLog('Test API Playground initialized with NgRx Store binding.');
    
    // Log selector events
    this.projects$.subscribe(projs => {
      this.addLog(`[NgRx Selector] Projects state emitted. Current count: ${projs.length}`);
    });
    this.projectsLoading$.subscribe(loading => {
      this.addLog(`[NgRx Selector] Loading status: ${loading}`);
    });
    this.projectsError$.subscribe(err => {
      if (err) {
        this.addLog(`[NgRx Selector] Error emitted: ${err}`);
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
    this.addLog('Fetching my submitted proposals...');
    this.proposalService.getMyProposals().subscribe({
      next: (res) => {
        this.proposals = res.data?.proposals || [];
        this.addLog(`Success: Loaded ${this.proposals.length} proposals.`);
      },
      error: (err) => {
        this.addLog(`Error fetching proposals: ${err.message || 'Unauthorized role'}`);
      }
    });
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
