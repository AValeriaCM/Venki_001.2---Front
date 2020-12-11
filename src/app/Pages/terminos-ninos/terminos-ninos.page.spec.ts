import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TerminosNinosPage } from './terminos-ninos.page';

describe('TerminosNinosPage', () => {
  let component: TerminosNinosPage;
  let fixture: ComponentFixture<TerminosNinosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminosNinosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TerminosNinosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
