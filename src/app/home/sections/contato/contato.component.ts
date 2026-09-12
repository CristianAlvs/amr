import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SendEmailService } from '../../../services/send-email.service';

type EstadoEnvio = 'ocioso' | 'enviando' | 'sucesso' | 'erro';
type DadoCopiavel = 'endereco' | 'telefone';

@Component({
  selector: 'app-contato',
  imports: [ReactiveFormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly sendEmail = inject(SendEmailService);

  readonly estado = signal<EstadoEnvio>('ocioso');

  /** Qual dado acabou de ser copiado — volta a null depois de COPIA_MS. */
  readonly copiado = signal<DadoCopiavel | null>(null);
  private copiaTimer?: ReturnType<typeof setTimeout>;
  private static readonly COPIA_MS = 2000;

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    assunto: ['', [Validators.required, Validators.minLength(3)]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });

  /** Só mostra erro depois que o campo foi tocado — não acusa quem ainda nem digitou. */
  invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  erro(campo: keyof typeof this.form.controls): string {
    const c = this.form.controls[campo];
    if (!this.invalido(campo)) {
      return '';
    }
    if (c.hasError('required')) {
      return 'Este campo é obrigatório.';
    }
    if (c.hasError('email')) {
      return 'Digite um e-mail válido, como nome@exemplo.com.';
    }
    if (c.hasError('minlength')) {
      const min = c.getError('minlength').requiredLength;
      return `Escreva pelo menos ${min} caracteres.`;
    }
    return 'Verifique este campo.';
  }

  /**
   * A Clipboard API só existe em contexto seguro (https ou localhost) e pode
   * ser negada pelo usuário; o execCommand é o plano B para esses casos.
   */
  async copiar(dado: DadoCopiavel, texto: string): Promise<void> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(texto);
      } else {
        this.copiarLegado(texto);
      }
      this.sinalizarCopia(dado);
    } catch {
      try {
        this.copiarLegado(texto);
        this.sinalizarCopia(dado);
      } catch {
        /* Sem área de transferência: o valor continua visível e selecionável. */
      }
    }
  }

  private sinalizarCopia(dado: DadoCopiavel): void {
    clearTimeout(this.copiaTimer);
    this.copiado.set(dado);
    this.copiaTimer = setTimeout(() => this.copiado.set(null), ContatoComponent.COPIA_MS);
  }

  private copiarLegado(texto: string): void {
    const campo = document.createElement('textarea');
    campo.value = texto;
    // Fora de vista sem sair do fluxo de foco, senão o iOS rola a página até ele
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.appendChild(campo);
    campo.select();
    document.execCommand('copy');
    document.body.removeChild(campo);
  }

  ngOnDestroy(): void {
    clearTimeout(this.copiaTimer);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.estado.set('enviando');
    try {
      await this.sendEmail.enviar(this.form.getRawValue());
      this.estado.set('sucesso');
      this.form.reset();
    } catch {
      this.estado.set('erro');
    }
  }
}
