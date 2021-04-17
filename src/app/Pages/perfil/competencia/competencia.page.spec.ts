import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompetenciaPage } from './competencia.page';

describe('CompetenciaPage', () => {
  let component: CompetenciaPage;
  let fixture: ComponentFixture<CompetenciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetenciaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompetenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
