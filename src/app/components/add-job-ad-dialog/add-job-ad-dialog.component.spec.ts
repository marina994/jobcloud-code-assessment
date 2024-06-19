import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AddJobAdDialogComponent } from './add-job-ad-dialog.component';

describe('AddJobAdDialogComponent', () => {
  let component: AddJobAdDialogComponent;
  let fixture: ComponentFixture<AddJobAdDialogComponent>;
  let mockMatDialogRef: MatDialogRef<AddJobAdDialogComponent>;

  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj(['close']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        AddJobAdDialogComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobAdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly', () => {
    expect(component.addJobAdForm).toBeDefined();
    expect(component.addJobAdForm.get('title')).toBeDefined();
    expect(component.addJobAdForm.get('description')).toBeDefined();
    expect(component.addJobAdForm.get('skills')).toBeDefined();
    expect(component.addJobAdForm.get('status')).toBeDefined();
  });

  it('should add a skill to skills array', () => {
    component.newSkillControl.setValue('Angular');
    component.addSkill();

    const skillsArray = component.skills;
    expect(skillsArray.length).toBe(1);
    expect(skillsArray.at(0).value).toBe('Angular');
  });

  it('should remove a skill from skills array', () => {
    component.skills.push(new FormControl('Angular'));
    component.removeSkill(0);

    expect(component.skills.length).toBe(0);
  });

  it('should disable save button when form is invalid', () => {
    expect(component.addJobAdForm.valid).toBe(false);
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});
