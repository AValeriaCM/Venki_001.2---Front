import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeccionInicioPage } from './leccion-inicio.page';

describe('LeccionInicioPage', () => {
  let component: LeccionInicioPage;
  let fixture: ComponentFixture<LeccionInicioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeccionInicioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeccionInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
