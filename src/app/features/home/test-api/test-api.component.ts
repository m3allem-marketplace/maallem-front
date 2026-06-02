import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ProjectService } from '../../../core/services/project.service';
import { ProposalService } from '../../../core/services/proposal.service';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.css']
})
export class TestApiComponent implements OnInit {
  currentUser$ = this.userContext.user$;
  isLoggedIn$ = this.userContext.isLoggedIn$;
  role$ = this.userContext.role$;

  projects: any[] = [];
  proposals: any[] = [];
  workers: any[] = [];
  logs: string[] = [];

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private proposalService: ProposalService,
    private workerProfileService: WorkerProfileService,
    private userContext: UserContextService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.addLog('Test API Playground initialized.');
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
      email: 'client@mail.com', // Pre-seeded or just testing route
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
    this.addLog('Fetching projects...');
    this.projectService.getProjects().subscribe({
      next: (res) => {
        this.projects = res.data?.projects || [];
        this.addLog(`Success: Loaded ${this.projects.length} projects.`);
      },
      error: (err) => {
        this.addLog(`Error fetching projects: ${err.message}`);
      }
    });
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

    this.addLog('Creating temporary client project...');
    this.projectService.createProject(payload).subscribe({
      next: (res) => {
        this.addLog(`Success: Created Project ID ${res.data?.project?._id}`);
        this.toast.success('Project created successfully! 🛠️');
        this.fetchProjects();
      },
      error: (err) => {
        this.addLog(`Error creating project: ${err.message || 'Unauthorized role'}`);
        this.toast.error('Project creation failed.');
      }
    });
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
