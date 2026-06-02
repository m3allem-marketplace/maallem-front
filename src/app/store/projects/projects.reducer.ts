import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Project } from '../../core/models/project.model';
import { ProjectsActions } from './projects.actions';

export interface ProjectsState extends EntityState<Project> {
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Project> = createEntityAdapter<Project>({
  selectId: (project: Project) => project._id,
});

export const initialState: ProjectsState = adapter.getInitialState({
  selectedId: null,
  loading: false,
  error: null,
});

export const projectsReducer = createReducer(
  initialState,
  on(ProjectsActions.loadProjects, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsActions.loadProjectsSuccess, (state, { projects }) =>
    adapter.setAll(projects, { ...state, loading: false, error: null })
  ),
  on(ProjectsActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProjectsActions.loadProjectById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsActions.loadProjectByIdSuccess, (state, { project }) =>
    adapter.upsertOne(project, { ...state, loading: false, selectedId: project._id, error: null })
  ),
  on(ProjectsActions.loadProjectByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProjectsActions.createProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsActions.createProjectSuccess, (state, { project }) =>
    adapter.addOne(project, { ...state, loading: false, error: null })
  ),
  on(ProjectsActions.createProjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProjectsActions.updateProjectStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsActions.updateProjectStatusSuccess, (state, { project }) =>
    adapter.updateOne(
      { id: project._id, changes: project },
      { ...state, loading: false, error: null }
    )
  ),
  on(ProjectsActions.updateProjectStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProjectsActions.selectProject, (state, { id }) => ({
    ...state,
    selectedId: id,
  }))
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
