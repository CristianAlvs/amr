import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

/**
 * A home é eager: é o LCP do site e carregá-la sob demanda só atrasaria a
 * primeira pintura. As duas páginas de leitura são lazy — são texto longo que
 * a maioria das visitas não abre, e não têm por que pesar no chunk inicial.
 *
 * `data` alimenta o SeoService (title/description/canonical por rota).
 */
export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            title: 'A Mensagem Revelada — Igreja Evangélica Tabernáculo da Fé',
            description:
                'Igreja Evangélica Tabernáculo da Fé, em Santo Amaro, São Paulo. '
                + 'Cultos domingo 8h, 16h30 e 18h, e quarta 19h30.',
            canonical: '/'
        }
    },
    {
        path: 'william-branham',
        loadComponent: () =>
            import('./pages/william-branham/william-branham.component')
                .then(m => m.WilliamBranhamComponent),
        data: {
            title: 'William Marrion Branham — A Mensagem Revelada',
            description:
                'A vida e o ministério de William Marrion Branham, o profeta prometido '
                + 'em Malaquias 4 e Apocalipse 10:7 para a última era da Igreja.',
            canonical: '/william-branham'
        }
    },
    {
        path: 'pontos-doutrinarios',
        loadComponent: () =>
            import('./pages/pontos-doutrinarios/pontos-doutrinarios.component')
                .then(m => m.PontosDoutrinariosComponent),
        data: {
            title: 'Pontos doutrinários — A Mensagem Revelada',
            description:
                'No que cremos: o batismo em nome do Senhor Jesus Cristo, a Deidade, '
                + 'Jesus Cristo como o Jeová do Velho Testamento e a Palavra vinda ao profeta.',
            canonical: '/pontos-doutrinarios'
        }
    },
    { path: '**', redirectTo: '' }
];
