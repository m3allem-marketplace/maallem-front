import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WorkerSummary } from '../../../shared/models/worker-summary.model';

@Component({
  selector: 'app-featured-workers',
  templateUrl: './featured-workers.component.html',
})
export class FeaturedWorkersComponent implements OnChanges {
  @Input() workers: WorkerSummary[] = [];

  /** Filters to Gold-tier only, or shows whatever the parent provides if already filtered */
  displayWorkers: WorkerSummary[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workers']) {
      // Show gold-tier workers — fall back to all provided workers if none qualify
      const gold = this.workers.filter(w => w.tier === 'gold');
      this.displayWorkers = gold.length ? gold : this.workers;
    }
  }

 
}