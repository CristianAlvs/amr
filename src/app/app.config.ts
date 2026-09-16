import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

/**
 * A home continua navegada por âncoras (#sobre, #agenda, …), mas o site deixou
 * de ser de página única: /william-branham e /pontos-doutrinarios são rotas de
 * verdade. Daí o provideRouter, que antes era omitido de propósito.
 *
 * anchorScrolling fica por causa do LINK COLADO: abrir o site direto em
 * `/#agenda` tem de cair na seção, e é ele quem faz isso na carga inicial.
 *
 * Nenhum clique navega mais com fragmento — quem cuida das âncoras é a
 * AncoraDirective, que rola sem escrever nada na URL. Isso aposenta de quebra o
 * risco de rolagem dupla que existia quando um href de âncora disparava popstate
 * e o anchorScrolling rolava por cima.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    )
  ]
};
