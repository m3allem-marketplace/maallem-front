import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ProposalService } from '../../core/services/proposal.service';
import { ProposalsActions } from './proposals.actions';

@Injectable()
export class ProposalsEffects {
  loadProposalsForProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalsActions.loadProposalsForProject),
      mergeMap((action) =>
        this.proposalService.getProposalsForProject(action.projectId).pipe(
          map((res) => ProposalsActions.loadProposalsForProjectSuccess({ proposals: res.data?.proposals || [] })),
          catchError((error) =>
            of(
              ProposalsActions.loadProposalsForProjectFailure({
                error: error.message || 'Failed to load project proposals',
              })
            )
          )
        )
      )
    )
  );

  loadMyProposals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalsActions.loadMyProposals),
      mergeMap(() =>
        this.proposalService.getMyProposals().pipe(
          map((res) => ProposalsActions.loadMyProposalsSuccess({ proposals: res.data?.proposals || [] })),
          catchError((error) =>
            of(
              ProposalsActions.loadMyProposalsFailure({
                error: error.message || 'Failed to load worker proposals',
              })
            )
          )
        )
      )
    )
  );

  submitProposal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalsActions.submitProposal),
      mergeMap((action) =>
        this.proposalService.submitProposal(action.projectId, action.payload).pipe(
          map((res) => ProposalsActions.submitProposalSuccess({ proposal: res.data?.proposal })),
          catchError((error) =>
            of(ProposalsActions.submitProposalFailure({ error: error.message || 'Failed to submit proposal' }))
          )
        )
      )
    )
  );

  updateProposal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalsActions.updateProposal),
      mergeMap((action) =>
        this.proposalService.updateProposal(action.id, action.payload).pipe(
          map((res) => ProposalsActions.updateProposalSuccess({ proposal: res.data?.proposal })),
          catchError((error) =>
            of(ProposalsActions.updateProposalFailure({ error: error.message || 'Failed to update proposal' }))
          )
        )
      )
    )
  );

  withdrawProposal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalsActions.withdrawProposal),
      mergeMap((action) =>
        this.proposalService.withdrawProposal(action.id).pipe(
          map(() => ProposalsActions.withdrawProposalSuccess({ id: action.id })),
          catchError((error) =>
            of(ProposalsActions.withdrawProposalFailure({ error: error.message || 'Failed to withdraw proposal' }))
          )
        )
      )
    )
  );

  updateProposalStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProposalsActions.updateProposalStatus),
      mergeMap((action) =>
        this.proposalService.updateProposalStatus(action.id, action.status).pipe(
          map((res) => ProposalsActions.updateProposalStatusSuccess({ proposal: res.data?.proposal })),
          catchError((error) =>
            of(
              ProposalsActions.updateProposalStatusFailure({
                error: error.message || 'Failed to update proposal status',
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private proposalService: ProposalService
  ) {}
}
