import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerpComponent } from './serp.component';
import {MatSliderModule} from "@angular/material/slider";

describe('SerpComponent', () => {
  let component: SerpComponent;
  let fixture: ComponentFixture<SerpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerpComponent, MatSliderModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
