import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { JobAdStore } from '../../store/job-ad.store';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InvoiceDto, JobAdDto } from '../../models/job-ad';
import { EditJobAdDialogComponent } from '../edit-job-ad-dialog/edit-job-ad-dialog.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-job-ad-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './job-ad-list.component.html',
  styleUrls: ['./job-ad-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobAdListComponent implements OnInit {
  vm$ = this.jobAdStore.vm$;

  constructor(private jobAdStore: JobAdStore, public dialog: MatDialog) {}

  ngOnInit() {
    this.jobAdStore.getJobAds();
    this.jobAdStore.getInvoices();
  }

  deleteJobAd(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        let invoice: InvoiceDto | undefined;

        this.vm$
          .pipe(
            map((vm) => {
              invoice = vm.invoices.find((invoice) => invoice.jobAdId === id);
            })
          )
          .subscribe();

        this.jobAdStore.deleteJobAd(id);
        if (invoice) {
          this.jobAdStore.deleteInvoice(invoice.id);
        }
      }
    });
  }

  editJobAd(jobAd: JobAdDto): void {
    const dialogRef = this.dialog.open(EditJobAdDialogComponent, {
      width: '800px',
      data: { ...jobAd },
    });

    dialogRef.afterClosed().subscribe((updatedJobAd) => {
      if (updatedJobAd) {
        this.jobAdStore.editJobAd(updatedJobAd);
      }
    });
  }
}
