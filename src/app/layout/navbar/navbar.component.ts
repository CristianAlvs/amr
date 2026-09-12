import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/* Componente de apresentação puro. A nav vive dentro do hero e só é visível no
   topo da página, então não há estado de scroll, nem menu, nem seção ativa a
   destacar — quando 'sobre' entra em cena, esta barra já saiu.

   Os links usam [routerLink]="[]" + fragment em vez de href="#": com o router
   ativo, um href de âncora dispara popstate, o router reprocessa a URL e o
   anchorScrolling rola uma segunda vez. */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {}
