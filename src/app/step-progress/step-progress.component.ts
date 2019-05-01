import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step-progress',
  templateUrl: './step-progress.component.html',
  styleUrls: ['./step-progress.component.css']
})
export class StepProgressComponent {
  @Input() currentStep: number;
  @Output() currentStepChange: EventEmitter<number> = new EventEmitter();

  goToStep(step) {
    this.currentStepChange.emit(step);
  }
}
