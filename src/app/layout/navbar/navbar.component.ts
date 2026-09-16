import { Component } from '@angular/core';
import { AncoraDirective } from '../../shared/directives/ancora.directive';

/* Componente de apresentação puro. A nav vive dentro do hero e só é visível no
   topo da página, então não há estado de scroll, nem menu, nem seção ativa a
   destacar — quando 'sobre' entra em cena, esta barra já saiu.

   Os links usam amrAncora, e não href="#" cru: com o router ativo, um href de
   âncora dispara popstate, o router reprocessa a URL e o anchorScrolling rola
   uma segunda vez. A diretiva mantém o href de verdade (nova aba, copiar link)
   mas intercepta o clique comum, então não há popstate nem entrada nova no
   histórico — e a URL não ganha `#sobre`. */
@Component({
  selector: 'app-navbar',
  imports: [AncoraDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {}
