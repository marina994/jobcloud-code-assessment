import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { EditJobAdDialogComponent } from './edit-job-ad-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobAdStore } from '../../store/job-ad.store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EditJobAdDialogComponent', () => {
  let component: EditJobAdDialogComponent;
  let fixture: ComponentFixture<EditJobAdDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditJobAdDialogComponent>>;
  let mockJobAdStore: jasmine.SpyObj<JobAdStore>;

  const mockData = {
    id: '1',
    title: 'Test Job',
    description: 'Test Description',
    skills: ['Skill1', 'Skill2'],
    status: 'draft',
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockJobAdStore = jasmine.createSpyObj('JobAdStore', ['createInvoice']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        EditJobAdDialogComponent,
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: JobAdStore, useValue: mockJobAdStore },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditJobAdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockJobAdStore = TestBed.inject(JobAdStore) as jasmine.SpyObj<JobAdStore>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with provided data', () => {
    expect(component.editJobAdForm.value).toEqual({
      title: 'Test Job',
      description: 'Test Description',
      skills: ['Skill1', 'Skill2'],
      status: 'draft',
    });
  });

  it('should add a new skill', () => {
    component.newSkillControl.setValue('NewSkill');
    component.addSkill();
    expect(component.skills.length).toBe(3);
    expect(component.skills.at(2).value).toBe('NewSkill');
  });

  it('should remove a skill', () => {
    component.removeSkill(0);
    expect(component.skills.length).toBe(1);
    expect(component.skills.at(0).value).toBe('Skill2');
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should mark all fields as touched if form is invalid on save', () => {
    component.editJobAdForm.patchValue({
      title: '',
      description: '',
    });
    component.onSave();
    expect(component.editJobAdForm.touched).toBeTrue();
  });
});
