import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { InvoiceDto, JobAdDto } from '../models/job-ad';
import { Observable, exhaustMap, map, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { JobsApiService } from '../services/jobs-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InvoicesApiService } from '../services/invoices-api.service';

export interface JobAdState {
  jobAds: JobAdDto[];
  invoices: InvoiceDto[];
  filter: { searchTerm: string };
  error: string | undefined;
}

const defaultState: JobAdState = {
  jobAds: [],
  invoices: [],
  filter: { searchTerm: '' },
  error: undefined,
};

@Injectable()
export class JobAdStore extends ComponentStore<JobAdState> {
  constructor(private jobsApiService: JobsApiService, private invoicesApiService: InvoicesApiService) {
    super(defaultState);
  }

  private jobAds$ = this.select(({jobAds}) => jobAds);
  private invoices$ = this.select(({invoices}) => invoices);
  readonly filter$ = this.select(state => state.filter);
  private error$ = this.select(({ error }) => error);

  readonly filteredJobAds$ = this.select(
    this.jobAds$,
    this.filter$,
    (jobAds, filter) => this.applyFilters(jobAds, filter)
  );

   readonly vm$ = this.select(
    this.filteredJobAds$,
    this.invoices$,
    this.error$,
    (jobAds, invoices) => ({ jobAds, invoices }),
    
  );

  setError = this.updater((state, error: HttpErrorResponse) => ({
    ...state,
    error: error.message
  }));
  setJobAds = this.updater((state, jobAds: JobAdDto[] | null) => ({
    ...state,
    jobAds: jobAds || []
  }));
  addJobAd = this.updater((state, jobAd: JobAdDto) => ({
    ...state,
    jobAds: [...state.jobAds, jobAd],
  }));
  removeJobAd = this.updater((state, jobAdId: string) => ({
    ...state,
    jobAds: state.jobAds.filter(jobAd => jobAd.id !== jobAdId),
  }));
  updateJobAd = this.updater((state, updatedJobAd: JobAdDto) => ({
    ...state,
    jobAds: state.jobAds.map(jobAd =>
      jobAd.id === updatedJobAd.id ? updatedJobAd : jobAd
    ),
  }));
  setInvoices = this.updater((state, invoices: InvoiceDto[] | null) => ({
    ...state,
    invoices: invoices || [],
  }));
  addInvoice = this.updater((state, invoice: InvoiceDto) => ({
    ...state,
    invoices: [...state.invoices, invoice]
  }));
  removeInvoice = this.updater((state, invoiceId: string) => ({
    ...state,
    invoices: state.invoices.filter(invoice => invoice.id !== invoiceId),
  }));

  readonly setFilter = this.updater((state, filter: { searchTerm: string }) => ({
    ...state,
    filter
  }));

  getJobAds = this.effect((trigger$) => {
    return trigger$.pipe(
      exhaustMap(() => {
        return this.jobsApiService.getJobAds().pipe(
          tapResponse(
            (jobAds) => this.setJobAds(jobAds),
            (err : HttpErrorResponse) => this.setError(err)
          )
        )
      })
    )
  });

  createJobAd = this.effect((jobAd$:Observable<JobAdDto>) => {
    return jobAd$.pipe(
      exhaustMap((jobAd) => {
        return this.jobsApiService.createJobAd(jobAd).pipe(
          tapResponse(
            () => {
              this.addJobAd(jobAd as JobAdDto)
              this.getJobAds();
            },
            (err : HttpErrorResponse) => this.setError(err)
          )
        )
      })
    )
  });

  deleteJobAd = this.effect((jobAdId$: Observable<string>) =>
    jobAdId$.pipe(
      exhaustMap((jobAdId) =>
        this.jobsApiService.deleteJobAd(jobAdId).pipe(
          tapResponse(
            () => this.removeJobAd(jobAdId),
            (err: HttpErrorResponse) => this.setError(err)
          )
        )
      )
    )
  );

  editJobAd = this.effect((jobAd$: Observable<JobAdDto>) =>
    jobAd$.pipe(
      exhaustMap((jobAd) =>
        this.jobsApiService.updateJobAd(jobAd).pipe(
          tapResponse(
            (updatedJobAd) => this.updateJobAd(updatedJobAd),
            (err: HttpErrorResponse) => this.setError(err)
          )
        )
      )
    )
  );

  getInvoices = this.effect((trigger$) => {
    return trigger$.pipe(
      exhaustMap(() => {
        return this.invoicesApiService.getInvoices().pipe(
          tapResponse(
            (invoices) => this.setInvoices(invoices as InvoiceDto[]),
            (err : HttpErrorResponse) => this.setError(err)
          )
        )
      })
    )
  });

  createInvoice = this.effect((invoice$:Observable<InvoiceDto>) => {
    return invoice$.pipe(
      exhaustMap((invoice) => {
        return this.invoicesApiService.createInvoice(invoice).pipe(
          tapResponse(
            () => {
              this.addInvoice(invoice)
            },
            (err : HttpErrorResponse) => this.setError(err)
          )
        )
      })
    )
  });

  deleteInvoice = this.effect((invoiceId$: Observable<string>) =>
    invoiceId$.pipe(
      exhaustMap((invoiceId) =>
        this.invoicesApiService.deleteInvoice(invoiceId).pipe(
          tapResponse(
            () => this.removeInvoice(invoiceId),
            (err: HttpErrorResponse) => this.setError(err)
          )
        )
      )
    )
  );

  applyFilters(jobAds: JobAdDto[], filters: { searchTerm: string }): JobAdDto[] {
    const searchTerm = filters.searchTerm.toLowerCase();

    return jobAds.filter((jobAd) => {
      const matchesTitle = jobAd.title.toLowerCase().includes(searchTerm);
      const matchesDescription = jobAd.description.toLowerCase().includes(searchTerm);
      const matchesSkill = jobAd.skills.some(skill => skill.toLowerCase().includes(searchTerm));
      const matchesStatus = jobAd.status.toLowerCase().includes(searchTerm);

      return matchesTitle || matchesDescription || matchesSkill || matchesStatus;
    });
  }
}

