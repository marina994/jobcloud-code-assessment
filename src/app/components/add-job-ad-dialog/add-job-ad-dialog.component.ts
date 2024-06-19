import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-job-ad-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-job-ad-dialog.component.html',
  styleUrls: ['./add-job-ad-dialog.component.scss']
})
export class AddJobAdDialogComponent implements OnInit {
  addJobAdForm: FormGroup = this.fb.group({});
  newSkillControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddJobAdDialogComponent>) {}

  ngOnInit() {
    this.addJobAdForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      skills: this.fb.array([], Validators.required),
      status: ['draft']
    });
  }

  get skills(): FormArray {
    return this.addJobAdForm.get('skills') as FormArray;
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
    if (this.skills.length === 0) {
      this.skills.setErrors({ required: true });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.addJobAdForm.valid) {
      const jobAdData = {
        ...this.addJobAdForm.value,
        skills: this.skills.value
      };

      this.dialogRef.close(jobAdData);
    } else {
      this.addJobAdForm.markAllAsTouched();
    }
  }
}
