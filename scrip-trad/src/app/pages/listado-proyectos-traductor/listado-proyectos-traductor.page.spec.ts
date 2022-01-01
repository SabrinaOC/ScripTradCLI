import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoProyectosTraductorPage } from './listado-proyectos-traductor.page';

describe('ListadoProyectosTraductorPage', () => {
  let component: ListadoProyectosTraductorPage;
  let fixture: ComponentFixture<ListadoProyectosTraductorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoProyectosTraductorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoProyectosTraductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
