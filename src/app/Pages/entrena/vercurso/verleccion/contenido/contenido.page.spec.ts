import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContenidoPage } from './contenido.page';

describe('ContenidoPage', () => {
  let component: ContenidoPage;
  let fixture: ComponentFixture<ContenidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenidoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContenidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
