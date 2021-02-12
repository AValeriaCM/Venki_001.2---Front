import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerleccionPage } from './verleccion.page';

describe('VerleccionPage', () => {
  let component: VerleccionPage;
  let fixture: ComponentFixture<VerleccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerleccionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerleccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
