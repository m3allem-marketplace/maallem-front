import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState, selectAll, selectEntities } from './projects.reducer';

export const selectProjectsState = createFeatureSelector<ProjectsState>('projects');

export const selectAllProjects = createSelector(
  selectProjectsState,
  selectAll
);

export const selectProjectsEntities = createSelector(
  selectProjectsState,
  selectEntities
);

export const selectSelectedProjectId = createSelector(
  selectProjectsState,
  (state) => state.selectedId
);

export const selectSelectedProject = createSelector(
  selectProjectsEntities,
  selectSelectedProjectId,
  (entities, selectedId) => (selectedId ? entities[selectedId] || null : null)
);

export const selectProjectsLoading = createSelector(
  selectProjectsState,
  (state) => state.loading
);

export const selectProjectsError = createSelector(
  selectProjectsState,
  (state) => state.error
);
