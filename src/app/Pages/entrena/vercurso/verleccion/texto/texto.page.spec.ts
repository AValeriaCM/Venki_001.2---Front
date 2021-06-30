import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TextoPage } from './texto.page';

describe('TextoPage', () => {
  let component: TextoPage;
  let fixture: ComponentFixture<TextoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TextoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
