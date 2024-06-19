import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog.component';

describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<
    MatDialogRef<DeleteConfirmationDialogComponent>
  >;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with true', () => {
    component.confirmDelete();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog without arguments', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});
