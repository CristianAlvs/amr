import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AncoraDirective } from '../../shared/directives/ancora.directive';

/* O rodapé vive no shell, fora do <router-outlet>, então aparece em todas as
   rotas — é a única navegação disponível depois da dobra e também o caminho de
   volta das páginas de leitura.

   É justamente por isso que os links de seção precisam de `rota="/"` explícito:
   a partir de /william-branham, "Agenda" tem de dizer onde a seção mora. Quando
   o rodapé está na própria home, a diretiva percebe que o alvo já existe na
   página e só rola, sem tocar na URL. Os dois links de página continuam sendo
   routerLink — ali a troca de rota é real e a URL deve mudar mesmo. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, AncoraDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
