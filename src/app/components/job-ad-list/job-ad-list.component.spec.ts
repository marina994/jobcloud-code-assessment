import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobAdListComponent } from './job-ad-list.component';
import { JobAdStore } from '../../store/job-ad.store';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { JobAdDto, InvoiceDto } from '../../models/job-ad';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('JobAdListComponent', () => {
  let component: JobAdListComponent;
  let fixture: ComponentFixture<JobAdListComponent>;
  let jobAdStoreMock: jasmine.SpyObj<JobAdStore>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let matDialog: MatDialog;

  const dummyJobAd: JobAdDto = {
    id: '123',
    title: 'Test Job Ad',
    description: 'Test Description',
    skills: ['skill 1', 'skill 2', 'skill 3'],
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
    _embedded: undefined,
  };

  const dummyInvoice: InvoiceDto = {
    id: '456',
    jobAdId: '123',
    amount: 90,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    _embedded: undefined,
  };

  beforeEach(async () => {
    jobAdStoreMock = jasmine.createSpyObj('JobAdStore', [
      'getJobAds',
      'getInvoices',
      'deleteJobAd',
      'deleteInvoice',
      'editJobAd',
    ]);

    matDialogMock = jasmine.createSpyObj('MatDialog', [
      'open',
      'returnValue',
      'afterClosed',
    ]);

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        { provide: JobAdStore, useValue: jobAdStoreMock },
        {
          provide: MatDialog,
          useValue: matDialogMock,
        },
      ],
    }).compileComponents();
    matDialog = TestBed.inject(MatDialog);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdListComponent);
    component = fixture.componentInstance;
    component.vm$ = of({
      jobAds: [],
      invoices: [],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call jobAdStore methods on ngOnInit', () => {
    component.ngOnInit();
    expect(jobAdStoreMock.getJobAds).toHaveBeenCalled();
    expect(jobAdStoreMock.getInvoices).toHaveBeenCalled();
  });

  // it('should open delete confirmation dialog and delete job ad', () => {
  //   const dialogRefMock = {
  //     afterClosed: () => of(true),
  //   } as MatDialogRef<DeleteConfirmationDialogComponent>;

  //   matDialogMock.open.and.returnValue(dialogRefMock);

  //   component.vm$ = of({
  //     jobAds: [dummyJobAd],
  //     invoices: [dummyInvoice],
  //   });

  //   component.deleteJobAd(dummyJobAd.id);

  //   expect(matDialogMock.open).toHaveBeenCalledWith(
  //     DeleteConfirmationDialogComponent,
  //     jasmine.any(Object)
  //   );

  //   dialogRefMock.afterClosed().subscribe((result: any) => {
  //     expect(result).toBeTrue();
  //     expect(jobAdStoreMock.deleteJobAd).toHaveBeenCalledWith(dummyJobAd.id);
  //     expect(jobAdStoreMock.deleteInvoice).toHaveBeenCalledWith(
  //       dummyInvoice.id
  //     );
  //   });
  // });

  // it('should open edit job ad dialog and edit job ad', () => {
  //   matDialogMock.open.and.returnValue({
  //     afterClosed: () => of(dummyJobAd),
  //   } as any);

  //   component.editJobAd(dummyJobAd);

  //   expect(matDialogMock.open).toHaveBeenCalledWith(
  //     EditJobAdDialogComponent,
  //     jasmine.any(Object)
  //   );
  //   expect(jobAdStoreMock.editJobAd).toHaveBeenCalledWith(dummyJobAd);
  // });
});
