import { createActionGroup, props } from '@ngrx/store';
import { Project, CreateProjectRequest } from '../../core/models/project.model';

export const ProjectsActions = createActionGroup({
  source: 'Projects API',
  events: {
    'Load Projects': props<{ filters?: { status?: string; city?: string; category?: string } }>(),
    'Load Projects Success': props<{ projects: Project[] }>(),
    'Load Projects Failure': props<{ error: string }>(),

    'Load Project By Id': props<{ id: string }>(),
    'Load Project By Id Success': props<{ project: Project }>(),
    'Load Project By Id Failure': props<{ error: string }>(),

    'Create Project': props<{ payload: CreateProjectRequest }>(),
    'Create Project Success': props<{ project: Project }>(),
    'Create Project Failure': props<{ error: string }>(),

    'Update Project Status': props<{ id: string; status: 'open' | 'closed' | 'in-progress' }>(),
    'Update Project Status Success': props<{ project: Project }>(),
    'Update Project Status Failure': props<{ error: string }>(),

    'Select Project': props<{ id: string | null }>(),
  },
});
