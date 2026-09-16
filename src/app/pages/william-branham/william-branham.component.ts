import { Component } from '@angular/core';
import { ArtigoNavComponent, SecaoArtigo } from '../../layout/artigo-nav/artigo-nav.component';
import { PageHeaderComponent } from '../../layout/page-header/page-header.component';
import { AncoraDirective } from '../../shared/directives/ancora.directive';
import { BlocosRecolhiveisDirective } from '../../shared/directives/blocos-recolhiveis.directive';

export interface Marco {
    /** Data como se lê em voz alta, não como se ordena: "11 de junho de 1933". */
    data: string;
    titulo: string;
    texto: string;
}

@Component({
    selector: 'app-william-branham',
    imports: [PageHeaderComponent, ArtigoNavComponent, BlocosRecolhiveisDirective, AncoraDirective],
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
        { fragment: 'linha-do-tempo', rotulo: 'A vida em dez marcos' },
        { fragment: 'mocidade',       rotulo: 'Os anos de mocidade' },
        { fragment: 'chamado',        rotulo: 'O chamado de Deus' },
        { fragment: 'coluna-de-fogo', rotulo: 'A Coluna de Fogo' },
        { fragment: 'nuvem',          rotulo: 'A Nuvem Sobrenatural' }
    ];

    /**
     * A linha do tempo. Sai do template pela mesma razão que os paralelos de
     * /pontos-doutrinarios: são dez blocos de forma idêntica a menos do texto, e
     * em HTML seriam quarenta linhas repetidas, ilegíveis de revisar.
     *
     * Toda data aqui já está na prosa das seções abaixo — a linha do tempo
     * reordena o que a página conta, não acrescenta fato nenhum.
     */
    readonly marcos: readonly Marco[] = [
        {
            data: '6 de abril de 1909',
            titulo: 'A Luz sobre a cabana',
            texto: 'Nasce numa cabana de madeira no Condado de Cumberland, Kentucky, '
                + 'primogênito de dez filhos de uma família que não frequentava igreja. '
                + 'Na manhã do parto uma Luz entra no quarto e paira sobre o recém-nascido.'
        },
        {
            data: '1916, aos sete anos',
            titulo: 'A Voz no redemoinho',
            texto: 'Voltando do poço com um pouco de água, ouve de um redemoinho no topo '
                + 'de uma árvore: "Nunca fumes nem bebas, nem corrompas o teu corpo de '
                + 'forma alguma, porque haverá uma obra para tu fazeres quando tiveres mais idade."'
        },
        {
            data: '1923, aos catorze anos',
            titulo: 'O ferimento na caçada',
            texto: 'Fica sete meses hospitalizado. É o começo de uma juventude passada a '
                + 'fugir daquilo que seria o propósito de Deus em sua vida.'
        },
        {
            data: '1929',
            titulo: 'A morte do irmão Edward',
            texto: 'Durante o culto fúnebre sente Deus intervindo novamente. Atende ao '
                + 'pedido da mãe e volta para Indiana.'
        },
        {
            data: '11 de junho de 1933',
            titulo: 'A Luz sobre o Rio Ohio',
            texto: 'Batizando em Jeffersonville diante de uma multidão, desce do céu uma '
                + 'Luz em forma de bola de fogo: "Assim como João Batista foi enviado para '
                + 'ser o precursor da Primeira Vinda de Cristo, a tua Mensagem precursará a '
                + 'Sua Segunda Vinda." No mesmo ano lança a pedra angular do Tabernáculo Branham.'
        },
        {
            data: 'Janeiro de 1937',
            titulo: 'A Bíblia seca sobre o púlpito',
            texto: 'A pior enchente de que se tem registro no Rio Ohio submerge o '
                + 'Tabernáculo. Quando as águas baixam, o púlpito e as cadeiras voltam aos '
                + 'seus lugares e a Bíblia está intacta e seca, aberta em Mateus 24:35.'
        },
        {
            data: '7 de maio de 1947',
            titulo: 'O Anjo em Green’s Mill',
            texto: 'Orando em sua caverna, vê um Homem vindo da Luz: "Eu sou enviado por '
                + 'Deus para te dizer que tu deves orar pelos doentes." Recebe ali os dois '
                + 'sinais — a oração pelos enfermos e o discernimento dos segredos do coração.'
        },
        {
            data: '24 de janeiro de 1950',
            titulo: 'A Coluna de Fogo fotografada',
            texto: 'No Coliseu Sam Houston, a câmera de um fotógrafo contratado por um '
                + 'ministro cético capta a Coluna de Fogo pairando sobre a cabeça do '
                + 'profeta. George Lacy, examinador frequentemente contratado pelo FBI, '
                + 'autentica a fotografia cinco dias depois.'
        },
        {
            data: '28 de fevereiro de 1963',
            titulo: 'A Nuvem sobre Flagstaff',
            texto: 'Cerca de duzentos observatórios atmosféricos testemunham uma Nuvem a '
                + '43 km de altitude — 27 km acima de onde as nuvens se formam —, visível '
                + 'por 28 minutos e estendendo-se por cerca de 80 km.'
        },
        {
            data: '17 a 24 de março de 1963',
            titulo: 'Os Sete Selos',
            texto: 'De volta a Jeffersonville, como a Voz lhe ordenara no monte Pôr do Sol, '
                + 'revela os mistérios escondidos nos Sete Selos.'
        }
    ];
}
