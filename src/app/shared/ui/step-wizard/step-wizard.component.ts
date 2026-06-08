import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-wizard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-wizard.component.html',
  styleUrls: ['./step-wizard.component.css']
})
export class StepWizardComponent {
  @Input() steps: string[] = [];
  @Input() currentStep = 0;
}
