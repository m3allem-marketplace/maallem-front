import { ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ProjectsState } from './projects/projects.reducer';
import { ProposalsState } from './proposals/proposals.reducer';
import { NotificationsState } from './notifications/notifications.reducer';

export interface AppState {
  router: RouterReducerState<any>;
  projects?: ProjectsState;
  proposals?: ProposalsState;
  notifications?: NotificationsState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
};
