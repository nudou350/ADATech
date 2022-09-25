import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let el : DebugElement
  const card = {
    titulo : 'titulo',
    conteudo : 'conteudo',
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent],
      imports: [AppModule]
    })
      .compileComponents().then(() => 
        {
          fixture = TestBed.createComponent(CardComponent);
          component = fixture.componentInstance;
          el = fixture.debugElement
        }
      )
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display card', () => {
    component.titulo = card.titulo
    component.conteudo = card.conteudo
    fixture.detectChanges()
    //if the class existis, it means we have the main mat-card available
    const matCard = el.queryAll(By.css(".mat-elevation-z7"))
    expect(matCard).toBeTruthy()
    //only one card is generated in the component
    expect(matCard.length).toBe(1)
    expect(component.titulo).toEqual(card.titulo)
    expect(component.conteudo).toEqual(card.conteudo)
    expect(component).toBeTruthy();
  });
});
