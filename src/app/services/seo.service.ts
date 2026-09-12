import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Data } from '@angular/router';

const ORIGEM = 'https://amensagemrevelada.com.br';

/**
 * Aplica title/description/canonical/Open Graph a partir do `data` da rota.
 *
 * O index.html continua trazendo os metadados da home (e o JSON-LD da igreja,
 * que vale para o site inteiro). Este serviço só reescreve o que muda de rota
 * para rota, para que /william-branham e /pontos-doutrinarios não sirvam o
 * título e a descrição da home.
 *
 * Limite conhecido: o build é SPA puro, sem prerender. Um crawler que não
 * executa JS vê o index.html estático nas três rotas.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);

    apply(data: Data): void {
        const titulo: string | undefined = data['title'];
        const descricao: string | undefined = data['description'];
        const canonical: string | undefined = data['canonical'];

        if (titulo) {
            this.title.setTitle(titulo);
            this.meta.updateTag({ property: 'og:title', content: titulo });
        }

        if (descricao) {
            this.meta.updateTag({ name: 'description', content: descricao });
            this.meta.updateTag({ property: 'og:description', content: descricao });
        }

        if (canonical) {
            const url = `${ORIGEM}${canonical}`;
            this.meta.updateTag({ property: 'og:url', content: url });
            document.getElementById('canonical')?.setAttribute('href', url);
        }
    }
}
