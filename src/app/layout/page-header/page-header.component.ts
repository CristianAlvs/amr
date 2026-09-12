import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Faixa de título das páginas de leitura.
 *
 * A navbar do site vive dentro do hero e só existe na home; fora dela esta
 * faixa é a única navegação acima da dobra — daí carregar o logo e o link de
 * volta, além do título da página.
 */
@Component({
    selector: 'app-page-header',
    imports: [RouterLink],
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
    readonly eyebrow = input.required<string>();
    readonly titulo = input.required<string>();
    readonly subtitulo = input<string>();
}
