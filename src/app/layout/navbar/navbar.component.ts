import { Component } from '@angular/core';

/* Componente de apresentação puro. A nav vive dentro do hero e só é visível no
   topo da página, então não há estado de scroll, nem menu, nem seção ativa a
   destacar — quando 'sobre' entra em cena, esta barra já saiu. */
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {}
