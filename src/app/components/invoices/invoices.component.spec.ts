import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoicesComponent } from './invoices.component';
import { JobAdStore } from '../../store/job-ad.store';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesComponent],
      providers: [JobAdStore, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicesComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    component.vm$.subscribe((value) => {
      expect(value).toEqual({ jobAds: [], invoices: [] });
    });
  });
});
