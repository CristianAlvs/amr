import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

/**
 * A home continua navegada por âncoras (#sobre, #agenda, …), mas o site deixou
 * de ser de página única: /william-branham e /pontos-doutrinarios são rotas de
 * verdade. Daí o provideRouter, que antes era omitido de propósito.
 *
 * anchorScrolling é o que faz `routerLink="/" fragment="agenda"` rolar até a
 * seção quando o clique parte de uma subpágina — sem ele o router navega para a
 * home e para no topo.
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
