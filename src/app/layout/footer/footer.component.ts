import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/* O rodapé vive no shell, fora do <router-outlet>, então aparece em todas as
   rotas — é a única navegação disponível depois da dobra e também o caminho de
   volta das páginas de leitura. Por isso os links são routerLink + fragment, e
   não âncoras: a partir de /william-branham um href="#agenda" não iria a lugar
   nenhum. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
