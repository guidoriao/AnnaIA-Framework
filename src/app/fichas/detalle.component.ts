import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FichasService } from './fichas.service';

@Component({
  imports: [RouterLink],
  template: `
    <a class="regresar" routerLink="/listado">← Volver a las fichas</a>
    @if (ficha(); as f) {
      <article class="tarjeta ficha-detalle">
        <span class="materia">{{ f.materia }}</span><h1>{{ f.titulo }}</h1>
        <p class="metadatos">Ficha {{ f.id }} · {{ f.minutos }} minutos</p>
        <h2>Actividad</h2><p>{{ f.actividad }}</p>
      </article>
    } @else {
      <h1>Ficha no encontrada</h1><p>El catálogo no contiene una ficha con el identificador «{{ id() }}».</p>
    }
  `,
})
export class DetalleComponent {
  readonly id = input.required<string>();
  private readonly servicio = inject(FichasService);
  readonly ficha = computed(() => this.servicio.fichas().find(ficha => String(ficha.id) === this.id()));
}
