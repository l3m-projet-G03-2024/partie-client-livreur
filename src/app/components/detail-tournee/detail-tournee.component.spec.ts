import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTourneeComponent } from './detail-tournee.component';

describe('DetailTourneeComponent', () => {
  let component: DetailTourneeComponent;
  let fixture: ComponentFixture<DetailTourneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTourneeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailTourneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
