import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../layout/page-header/page-header.component';

export interface Versiculo {
    texto: string;
    referencia: string;
}

export interface Paralelo {
    jeova: Versiculo[];
    jesus: Versiculo[];
}

@Component({
    selector: 'app-pontos-doutrinarios',
    imports: [PageHeaderComponent, RouterLink],
    templateUrl: './pontos-doutrinarios.component.html',
    styleUrl: './pontos-doutrinarios.component.scss'
})
export class PontosDoutrinariosComponent {
    /**
     * Único trecho da página que sai do template: doze pares de versículos com
     * a mesma forma repetida. Em HTML seriam 24 blocos idênticos a menos do
     * texto — ilegível de revisar. A prosa fica no template, onde o markup
     * inline (citações, ênfases) não precisa passar por sanitização.
     */
    readonly paralelos: readonly Paralelo[] = [
        {
            jeova: [{
                texto: 'Nos seus dias Judá será salvo, e Israel habitará seguro; e este será o seu nome com que o nomearão: SENHOR, JUSTIÇA NOSSA.',
                referencia: 'Jeremias 23:6'
            }],
            jesus: [{
                texto: 'Mas vós sois dele, em Jesus Cristo, o qual para nós foi feito por Deus sabedoria, e justiça, e santificação, e redenção.',
                referencia: 'I Coríntios 1:30'
            }]
        },
        {
            jeova: [{
                texto: 'Assim diz o Senhor… Eu sou o primeiro e eu sou o último, e fora de mim não há Deus.',
                referencia: 'Isaías 44:6'
            }],
            jesus: [
                {
                    texto: 'E, quando o vi, caí a seus pés como morto; e ele pôs sobre mim a sua destra, dizendo-me: Não temas; eu sou o primeiro e o último.',
                    referencia: 'Apocalipse 1:17'
                },
                {
                    texto: 'Eu sou o Alfa e o Ômega, o princípio e o fim, o primeiro e o derradeiro.',
                    referencia: 'Apocalipse 22:13'
                }
            ]
        },
        {
            jeova: [{
                texto: 'Mas o sétimo dia é o sábado do Senhor teu Deus.',
                referencia: 'Êxodo 20:10'
            }],
            jesus: [{
                texto: 'Porque o Filho do homem até do sábado é Senhor.',
                referencia: 'Mateus 12:8'
            }]
        },
        {
            jeova: [{
                texto: 'E disse Deus a Moisés: EU SOU O QUE SOU… Assim dirás aos filhos de Israel: EU SOU me enviou a vós.',
                referencia: 'Êxodo 3:14'
            }],
            jesus: [{
                texto: 'Disse-lhes Jesus: Em verdade, em verdade vos digo que antes que Abraão existisse, eu sou.',
                referencia: 'João 8:58'
            }]
        },
        {
            jeova: [{
                texto: 'Então disse-lhe Jesus: Vai-te, Satanás, porque está escrito: Ao Senhor teu Deus adorarás, e só a ele servirás.',
                referencia: 'Mateus 4:10'
            }],
            jesus: [{
                texto: 'E elas, chegando, abraçaram os seus pés, e o adoraram.',
                referencia: 'Mateus 28:9'
            }]
        },
        {
            jeova: [{
                texto: 'Ao Senhor teu Deus temerás e a ele servirás, e pelo seu nome jurarás.',
                referencia: 'Deuteronômio 6:13'
            }],
            jesus: [{
                texto: 'Ele disse: Creio, Senhor. E o adorou.',
                referencia: 'João 9:38'
            }]
        },
        {
            jeova: [{
                texto: 'Amando ao Senhor teu Deus, dando ouvidos à sua voz e te achegando a ele; pois ele é a tua vida, e a longura dos teus dias.',
                referencia: 'Deuteronômio 30:20'
            }],
            jesus: [{
                texto: 'Nele estava a vida, e a vida era a luz dos homens.',
                referencia: 'João 1:4'
            }]
        },
        {
            jeova: [{
                texto: 'O Senhor é o meu pastor; nada me faltará.',
                referencia: 'Salmo 23:1'
            }],
            jesus: [{
                texto: 'Eu sou o bom Pastor; o bom Pastor dá a sua vida pelas ovelhas.',
                referencia: 'João 10:11'
            }]
        },
        {
            jeova: [{
                texto: 'O Senhor é a minha luz e a minha salvação.',
                referencia: 'Salmo 27:1'
            }],
            jesus: [{
                texto: 'Falou-lhes, pois, Jesus outra vez, dizendo: Eu sou a luz do mundo.',
                referencia: 'João 8:12'
            }]
        },
        {
            jeova: [{
                texto: 'Vede agora que eu, eu o sou, e mais nenhum deus há comigo.',
                referencia: 'Deuteronômio 32:39'
            }],
            jesus: [{
                texto: '…e negam a Deus, único dominador e Senhor nosso, Jesus Cristo.',
                referencia: 'Judas 4'
            }]
        },
        {
            jeova: [{
                texto: 'Não terás outros deuses diante de mim.',
                referencia: 'Êxodo 20:3'
            }],
            jesus: [{
                texto: 'E Tomé respondeu, e disse-lhe: Senhor meu, e Deus meu!',
                referencia: 'João 20:28'
            }]
        },
        {
            jeova: [{
                texto: 'O Senhor tem o seu caminho na tormenta… Ele repreende o mar e o faz secar.',
                referencia: 'Naum 1:3-4'
            }],
            jesus: [{
                texto: 'Então, levantando-se, repreendeu os ventos e o mar, e seguiu-se uma grande bonança.',
                referencia: 'Mateus 8:26'
            }]
        }
    ];
}
