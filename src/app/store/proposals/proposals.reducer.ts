import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Proposal } from '../../core/models/proposal.model';
import { ProposalsActions } from './proposals.actions';

export interface ProposalsState extends EntityState<Proposal> {
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Proposal> = createEntityAdapter<Proposal>({
  selectId: (proposal: Proposal) => proposal._id,
});

export const initialState: ProposalsState = adapter.getInitialState({
  selectedId: null,
  loading: false,
  error: null,
});

export const proposalsReducer = createReducer(
  initialState,
  on(
    ProposalsActions.loadProposalsForProject,
    ProposalsActions.loadMyProposals,
    ProposalsActions.submitProposal,
    ProposalsActions.updateProposal,
    ProposalsActions.withdrawProposal,
    ProposalsActions.updateProposalStatus,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    ProposalsActions.loadProposalsForProjectSuccess,
    ProposalsActions.loadMyProposalsSuccess,
    (state, { proposals }) => adapter.setAll(proposals, { ...state, loading: false, error: null })
  ),
  on(ProposalsActions.submitProposalSuccess, (state, { proposal }) =>
    adapter.addOne(proposal, { ...state, loading: false, error: null })
  ),
  on(
    ProposalsActions.updateProposalSuccess,
    ProposalsActions.updateProposalStatusSuccess,
    (state, { proposal }) =>
      adapter.updateOne(
        { id: proposal._id, changes: proposal },
        { ...state, loading: false, error: null }
      )
  ),
  on(ProposalsActions.withdrawProposalSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, loading: false, error: null })
  ),
  on(
    ProposalsActions.loadProposalsForProjectFailure,
    ProposalsActions.loadMyProposalsFailure,
    ProposalsActions.submitProposalFailure,
    ProposalsActions.updateProposalFailure,
    ProposalsActions.withdrawProposalFailure,
    ProposalsActions.updateProposalStatusFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(ProposalsActions.selectProposal, (state, { id }) => ({
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
