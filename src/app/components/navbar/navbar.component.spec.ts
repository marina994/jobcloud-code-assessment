import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideRouter } from '@angular/router';
import { routes } from './../../routes'

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter(routes),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title "Careers"', () => {
    expect(component.title).toBe('Careers');
  });

  it('should render the title in the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Careers');
  });

  it('should have router links', () => {
    const compiled = fixture.nativeElement;
    const routerLinks = compiled.querySelectorAll('a');
    expect(routerLinks.length).toBeGreaterThanOrEqual(2);
  });
});
