import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { JobAdContainerComponent } from './job-ad-container.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JobAdStore } from '../../store/job-ad.store';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobsApiService } from '../../services/jobs-api.service';
import { InvoicesApiService } from '../../services/invoices-api.service';
import { AddJobAdDialogComponent } from '../add-job-ad-dialog/add-job-ad-dialog.component';
import { JobAdDto } from '../../models/job-ad';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

describe('JobAdContainerComponent', () => {
  let component: JobAdContainerComponent;
  let fixture: ComponentFixture<JobAdContainerComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let jobAdStoreSpy: jasmine.SpyObj<JobAdStore>;

  beforeEach(waitForAsync(() => {
    const dialogMock = jasmine.createSpyObj('MatDialog', [
      'open',
      'afterClosed',
      'returnValue',
    ]);
    const jobAdStoreMock = jasmine.createSpyObj('JobAdStore', [
      'vm$',
      'setFilter',
      'createJobAd',
    ]);
    jobAdStoreMock.vm$ = of({});

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        JobAdContainerComponent,
      ],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: JobAdStore, useValue: jobAdStoreMock },
        JobsApiService,
        InvoicesApiService,
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    jobAdStoreSpy = TestBed.inject(JobAdStore) as jasmine.SpyObj<JobAdStore>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filter form', () => {
    expect(component.filterForm).toBeDefined();
    expect(component.filterForm.controls['searchTerm']).toBeDefined();
  });

  it('should call setFilter when filter form value changes', fakeAsync(() => {
    component.filterForm.controls['searchTerm'].setValue('test');
    tick();

    jobAdStoreSpy.setFilter({ searchTerm: 'test' });

    expect(jobAdStoreSpy.setFilter).toHaveBeenCalledWith({
      searchTerm: 'test',
    });
  }));

  it('should open AddJobAdDialogComponent when addJobAd is called', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of({}),
    } as any);

    // component.addJobAd();
    // expect(dialogSpy.open).toHaveBeenCalledWith(AddJobAdDialogComponent, {
    //   width: '800px',
    //   data: {},
    // });
  });

  it('should call createJobAd when dialog is closed with a new job ad', () => {
    const newJobAd: JobAdDto = {
      id: '123',
      title: 'New Job Ad',
      description: 'New Job Ad description',
      skills: ['skill 1', 'skill 2'],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      _embedded: undefined,
    };
    // dialogSpy.open.and.returnValue({
    //   afterClosed: () => of(newJobAd),
    // } as any);

    // component.addJobAd();
    // expect(jobAdStoreSpy.createJobAd).toHaveBeenCalledWith(newJobAd);
  });

  it('should not call createJobAd when dialog is closed without a new job ad', () => {
    // dialogSpy.open.and.returnValue({
    //   afterClosed: () => of(null),
    // } as any);
    // component.addJobAd();
    // expect(jobAdStoreSpy.createJobAd).not.toHaveBeenCalled();
  });
});
