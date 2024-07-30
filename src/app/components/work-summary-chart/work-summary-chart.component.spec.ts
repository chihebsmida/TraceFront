import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSummaryChartComponent } from './work-summary-chart.component';

describe('WorkSummaryChartComponent', () => {
  let component: WorkSummaryChartComponent;
  let fixture: ComponentFixture<WorkSummaryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkSummaryChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkSummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
