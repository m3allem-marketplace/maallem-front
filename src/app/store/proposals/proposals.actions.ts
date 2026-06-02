import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Proposal, CreateProposalRequest, UpdateProposalRequest } from '../../core/models/proposal.model';

export const ProposalsActions = createActionGroup({
  source: 'Proposals API',
  events: {
    'Load Proposals For Project': props<{ projectId: string }>(),
    'Load Proposals For Project Success': props<{ proposals: Proposal[] }>(),
    'Load Proposals For Project Failure': props<{ error: string }>(),

    'Load My Proposals': emptyProps(),
    'Load My Proposals Success': props<{ proposals: Proposal[] }>(),
    'Load My Proposals Failure': props<{ error: string }>(),

    'Submit Proposal': props<{ projectId: string; payload: CreateProposalRequest }>(),
    'Submit Proposal Success': props<{ proposal: Proposal }>(),
    'Submit Proposal Failure': props<{ error: string }>(),

    'Update Proposal': props<{ id: string; payload: UpdateProposalRequest }>(),
    'Update Proposal Success': props<{ proposal: Proposal }>(),
    'Update Proposal Failure': props<{ error: string }>(),

    'Withdraw Proposal': props<{ id: string }>(),
    'Withdraw Proposal Success': props<{ id: string }>(),
    'Withdraw Proposal Failure': props<{ error: string }>(),

    'Update Proposal Status': props<{ id: string; status: 'accepted' | 'rejected' }>(),
    'Update Proposal Status Success': props<{ proposal: Proposal }>(),
    'Update Proposal Status Failure': props<{ error: string }>(),

    'Select Proposal': props<{ id: string | null }>(),
  },
});
