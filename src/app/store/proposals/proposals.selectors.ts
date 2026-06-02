import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProposalsState, selectAll, selectEntities } from './proposals.reducer';

export const selectProposalsState = createFeatureSelector<ProposalsState>('proposals');

export const selectAllProposals = createSelector(
  selectProposalsState,
  selectAll
);

export const selectProposalsEntities = createSelector(
  selectProposalsState,
  selectEntities
);

export const selectSelectedProposalId = createSelector(
  selectProposalsState,
  (state) => state.selectedId
);

export const selectSelectedProposal = createSelector(
  selectProposalsEntities,
  selectSelectedProposalId,
  (entities, selectedId) => (selectedId ? entities[selectedId] || null : null)
);

export const selectProposalsLoading = createSelector(
  selectProposalsState,
  (state) => state.loading
);

export const selectProposalsError = createSelector(
  selectProposalsState,
  (state) => state.error
);

export const selectProposalsForProject = (projectId: string) =>
  createSelector(
    selectAllProposals,
    (proposals) => proposals.filter((p) => p.project?._id === projectId || (p.project as any) === projectId)
  );
