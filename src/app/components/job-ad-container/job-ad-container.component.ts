import { Component, OnInit } from '@angular/core';
import { JobAdStore } from '../../store/job-ad.store';
import { JobsApiService } from '../../services/jobs-api.service';
import { JobAdListComponent } from '../job-ad-list/job-ad-list.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddJobAdDialogComponent } from '../add-job-ad-dialog/add-job-ad-dialog.component';
import { CommonModule } from '@angular/common';
import { InvoicesApiService } from '../../services/invoices-api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'app-job-ad-container',
  standalone: true,
  imports: [
    CommonModule,
    JobAdListComponent,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './job-ad-container.component.html',
  styleUrls: ['./job-ad-container.component.scss'],
  providers: [JobAdStore, JobsApiService, InvoicesApiService],
})
export class JobAdContainerComponent implements OnInit {
  vm$ = this.jobAdStore.vm$;
  filterForm: FormGroup = this.fb.group({});
  filteredJobAds$: any = of([]);
  private searchTerm$ = new BehaviorSubject<string>('');

  constructor(
    private dialog: MatDialog,
    private jobAdStore: JobAdStore,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      searchTerm: [''],
    });

    this.filterForm.valueChanges.subscribe((filter) => {
      this.jobAdStore.setFilter(filter);
    });
  }

  addJobAd() {
    const dialogRef = this.dialog.open(AddJobAdDialogComponent, {
      width: '800px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((newJobAd) => {
      if (newJobAd) {
        this.jobAdStore.createJobAd(newJobAd);
      }
    });
  }
}
