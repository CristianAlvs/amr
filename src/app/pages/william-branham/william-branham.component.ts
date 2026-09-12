import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArtigoNavComponent, SecaoArtigo } from '../../layout/artigo-nav/artigo-nav.component';
import { PageHeaderComponent } from '../../layout/page-header/page-header.component';

@Component({
    selector: 'app-william-branham',
    imports: [PageHeaderComponent, ArtigoNavComponent, RouterLink],
    templateUrl: './william-branham.component.html',
    styleUrl: './william-branham.component.scss'
})
export class WilliamBranhamComponent {
    /** Rótulos curtos: a calha da navegação tem ~190px, o h2 inteiro não cabe. */
    readonly secoes: readonly SecaoArtigo[] = [
        { fragment: 'profeta-hoje',   rotulo: 'Enviaria Deus um profeta hoje?' },
        { fragment: 'sinais',         rotulo: 'Sinais de vindicação' },
        { fragment: 'elias',          rotulo: 'Elias virá primeiro' },
        { fragment: 'quem-e',         rotulo: 'Quem é William Branham?' },
        { fragment: 'mocidade',       rotulo: 'Os anos de mocidade' },
        { fragment: 'chamado',        rotulo: 'O chamado de Deus' },
        { fragment: 'coluna-de-fogo', rotulo: 'A Coluna de Fogo' },
        { fragment: 'nuvem',          rotulo: 'A Nuvem Sobrenatural' }
    ];
}
