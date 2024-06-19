import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JobAdStore } from '../../store/job-ad.store';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  providers: [JobAdStore]
})
export class InvoicesComponent implements OnInit {
  vm$ = this.jobAdStore.vm$;

  constructor(private jobAdStore: JobAdStore) {}

  ngOnInit(): void {
    this.jobAdStore.getInvoices();
  }
}
