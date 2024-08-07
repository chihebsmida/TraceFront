import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSummaryMachineChartComponent } from './work-summary-machine-chart.component';

describe('WorkSummaryMachineChartComponent', () => {
  let component: WorkSummaryMachineChartComponent;
  let fixture: ComponentFixture<WorkSummaryMachineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkSummaryMachineChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkSummaryMachineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
