import { Component } from '@angular/core';
import { NavbarComponent } from '../../../layout/navbar/navbar.component';
import { AncoraDirective } from '../../../shared/directives/ancora.directive';

@Component({
  selector: 'app-hero',
  imports: [NavbarComponent, AncoraDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

}
