import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { InvoicesApiService } from './invoices-api.service';
import { InvoiceDto } from '../models/job-ad';
import { provideHttpClient } from '@angular/common/http';

describe('InvoicesApiService', () => {
  let service: InvoicesApiService;
  let httpMock: HttpTestingController;

  const dummyInvoices: InvoiceDto[] = [
    {
      id: '1',
      amount: 90,
      jobAdId: '5',
      dueDate: new Date('2024-09-16T06:47:13.303Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
      _embedded: undefined,
    },
    {
      id: '2',
      amount: 190,
      jobAdId: '3',
      dueDate: new Date('2024-06-18T00:50:55.867Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
      _embedded: undefined,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InvoicesApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(InvoicesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve invoices - GET', () => {
    service.getInvoices().subscribe((invoices: any) => {
      expect(invoices.length).toBe(2);
      expect(invoices).toEqual(dummyInvoices);
    });

    const req = httpMock.expectOne('http://localhost:3000/invoices');
    expect(req.request.method).toBe('GET');
    req.flush(dummyInvoices);
  });

  it('should create an invoice - POST', () => {
    const newInvoice: InvoiceDto = {
      id: '3',
      amount: 300,
      jobAdId: '5',
      dueDate: new Date('2024-09-16T06:47:13.303Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
      _embedded: undefined,
    };

    service.createInvoice(newInvoice).subscribe((response) => {
      expect(response).toEqual(
        jasmine.objectContaining({
          id: '3',
          amount: 300,
          jobAdId: '5',
          dueDate: new Date('2024-09-16T06:47:13.303Z'),
          createdAt: jasmine.any(Date),
          updatedAt: jasmine.any(Date),
          _embedded: undefined,
        })
      );
    });

    const req = httpMock.expectOne('http://localhost:3000/invoices');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(
      jasmine.objectContaining({
        id: '3',
        amount: 300,
        jobAdId: '5',
        dueDate: new Date('2024-09-16T06:47:13.303Z'),
        createdAt: jasmine.any(Date),
        updatedAt: jasmine.any(Date),
      })
    );
    req.flush(newInvoice);
  });

  it('should delete an invoice - DELETE', () => {
    const invoiceId = '1';

    service.deleteInvoice(invoiceId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/invoices/${invoiceId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
