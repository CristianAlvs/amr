import { Injectable } from '@angular/core';

export interface MensagemContato {
    nome: string;
    email: string;
    assunto: string;
    mensagem: string;
}

/**
 * Envio da mensagem de contato.
 *
 * ATENÇÃO: ainda NÃO existe backend. Este serviço apenas valida o formato e
 * rejeita, para que a interface nunca afirme ao visitante que a mensagem foi
 * entregue quando não foi. Ligue a um destino real (Formspree, EmailJS, Resend
 * ou uma função própria) antes de publicar o formulário.
 */
@Injectable({
    providedIn: 'root'
})
export class SendEmailService {

    /** Trocar por HttpClient apontando para o endpoint real. */
    async enviar(_dados: MensagemContato): Promise<void> {
        throw new Error('Envio de e-mail ainda não configurado.');
    }
}
