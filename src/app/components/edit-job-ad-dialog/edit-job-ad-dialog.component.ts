import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceDto, JobAdDto } from '../../models/job-ad';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobAdStore } from '../../store/job-ad.store';

@Component({
  selector: 'app-edit-job-ad-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule],
  templateUrl: './edit-job-ad-dialog.component.html',
  styleUrls: ['./edit-job-ad-dialog.component.scss'],
  providers: [JobAdStore]
})
export class EditJobAdDialogComponent {
  editJobAdForm: FormGroup = this.fb.group({});
  newSkillControl: FormControl = new FormControl('', Validators.required);
  invoiceAmount = 90;

  constructor(
    public dialogRef: MatDialogRef<EditJobAdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JobAdDto,
    private fb: FormBuilder,
    private jobAdStore:JobAdStore
  ) {}

  ngOnInit(): void {
    this.editJobAdForm = this.fb.group({
      title: [this.data.title, Validators.required],
      description: [this.data.description, Validators.required],
      skills: this.fb.array([], Validators.required),
      status: [this.data.status]
    });

    if (this.data.skills && this.data.skills.length > 0) {
      this.data.skills.forEach(skill => {
        this.skills.push(new FormControl(skill, Validators.required));
      });
    }
  }

  get skills(): FormArray {
    return this.editJobAdForm.get('skills') as FormArray;
  }

  addSkill(): void {
    if (this.newSkillControl.valid) {
      this.skills.push(new FormControl(this.newSkillControl.value, Validators.required));
      this.newSkillControl.reset();
      this.skills.setErrors(null);
    }
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editJobAdForm.valid) {
      const jobAdData = {
        ...this.editJobAdForm.value,
        id: this.data.id,
        skills: this.skills.value
      };

      if(jobAdData.status === 'published') {
        const newInvoice = {
          jobAdId: jobAdData.id,
          amount: this.invoiceAmount,
          dueDate: this.setDueDate()
        };
      this.jobAdStore.createInvoice(newInvoice as InvoiceDto);
      }

      this.dialogRef.close(jobAdData);
    } else {
      this.editJobAdForm.markAllAsTouched();
    }
  }

  setDueDate() {
    let today = new Date();
    return new Date(new Date().setDate(today.getDate() + this.invoiceAmount));
  }
}
