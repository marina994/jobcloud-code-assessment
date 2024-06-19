import { Route } from '@angular/router';
import { JobAdContainerComponent } from './components/job-ad-container/job-ad-container.component';
import { InvoicesComponent } from './components/invoices/invoices.component';

export const routes: Route[] = [
  {
    path: '',
    component: JobAdContainerComponent,
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
  },
  {
    path: '**',
    redirectTo: 'jobAds',
  },
];
