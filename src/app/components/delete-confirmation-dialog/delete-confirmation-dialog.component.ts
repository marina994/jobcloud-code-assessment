import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss'
})
export class DeleteConfirmationDialogComponent {

  constructor(private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
