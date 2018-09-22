import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-step-progress',
  templateUrl: './step-progress.component.html',
  styleUrls: ['./step-progress.component.css']
})
export class StepProgressComponent {
  @Input() currentStep: number;
}
