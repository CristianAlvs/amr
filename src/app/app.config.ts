import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

/**
 * Site de página única navegado por âncoras (#sobre, #agenda, …).
 * Sem provideRouter de propósito: não há rota nem <router-outlet>, e o
 * @angular/router adicionava ~35 kB ao bundle sem ser usado.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })]
};
