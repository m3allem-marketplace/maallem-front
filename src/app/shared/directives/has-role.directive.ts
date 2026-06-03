import { UserRole } from '../../core/models/user.model';
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { UserContextService } from '../../core/services/user-context.service';

@Directive({ selector: '[hasRole]', standalone: true })
export class HasRoleDirective implements OnInit {
  @Input() hasRole: string | string[] = [];

  private rendered = false;

  constructor(
    private templateRef:    TemplateRef<any>,
    private viewContainer:  ViewContainerRef,
    private userContextService: UserContextService,
  ) {}

  ngOnInit(): void {
    const role    = this.userContextService.role;
    const allowed = Array.isArray(this.hasRole) ? this.hasRole : [this.hasRole];
    const hasAccess = allowed.includes(role ?? '');

    if (hasAccess && !this.rendered) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.rendered = true;
    } else if (!hasAccess && this.rendered) {
      this.viewContainer.clear();
      this.rendered = false;
    }
  }
}
