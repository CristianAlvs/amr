import { Component } from '@angular/core';
import { ContatoComponent } from './sections/contato/contato.component';
import { HeroComponent } from './sections/hero/hero.component';
import { SobreComponent } from './sections/sobre/sobre.component';
import { AgendaComponent } from './sections/agenda/agenda.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    SobreComponent,
    AgendaComponent,
    ContatoComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
