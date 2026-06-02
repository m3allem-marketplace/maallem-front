import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ProjectService } from '../../core/services/project.service';
import { ProjectsActions } from './projects.actions';

@Injectable()
export class ProjectsEffects {
  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.loadProjects),
      mergeMap((action) =>
        this.projectService.getProjects(action.filters).pipe(
          map((res) => ProjectsActions.loadProjectsSuccess({ projects: res.data?.projects || [] })),
          catchError((error) =>
            of(ProjectsActions.loadProjectsFailure({ error: error.message || 'Failed to load projects' }))
          )
        )
      )
    )
  );

  loadProjectById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.loadProjectById),
      mergeMap((action) =>
        this.projectService.getProjectById(action.id).pipe(
          map((res) => ProjectsActions.loadProjectByIdSuccess({ project: res.data?.project })),
          catchError((error) =>
            of(ProjectsActions.loadProjectByIdFailure({ error: error.message || 'Failed to load project' }))
          )
        )
      )
    )
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.createProject),
      mergeMap((action) =>
        this.projectService.createProject(action.payload).pipe(
          map((res) => ProjectsActions.createProjectSuccess({ project: res.data?.project })),
          catchError((error) =>
            of(ProjectsActions.createProjectFailure({ error: error.message || 'Failed to create project' }))
          )
        )
      )
    )
  );

  updateProjectStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.updateProjectStatus),
      mergeMap((action) =>
        this.projectService.updateProjectStatus(action.id, action.status).pipe(
          map((res) => ProjectsActions.updateProjectStatusSuccess({ project: res.data?.project })),
          catchError((error) =>
            of(
              ProjectsActions.updateProjectStatusFailure({
                error: error.message || 'Failed to update project status',
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private projectService: ProjectService
  ) {}
}
