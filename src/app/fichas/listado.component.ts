import { Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { FichasService, normalizar } from './fichas.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h1>Fichas de estudio</h1>
    <p class="introduccion">Elige una actividad para trabajar en clase o agrega una ficha para el grupo.</p>
    <label class="filtro">Buscar por título o materia
      <input type="search" [formControl]="busqueda" placeholder="Por ejemplo, fracciones">
    </label>
    <p class="conteo" aria-live="polite">{{ visibles().length }} {{ visibles().length === 1 ? 'ficha' : 'fichas' }}</p>
    <div class="rejilla-fichas">
      @for (ficha of visibles(); track ficha.id) {
        <a class="tarjeta ficha-resumen" [routerLink]="['/detalle', ficha.id]">
          <span class="materia">{{ ficha.materia }}</span><h2>{{ ficha.titulo }}</h2>
          <span>{{ ficha.minutos }} minutos</span>
        </a>
      } @empty { <p>Sin coincidencias. Prueba con otro título o materia.</p> }
    </div>
  `,
})
export class ListadoComponent {
  private readonly servicio = inject(FichasService);
  readonly busqueda = new FormControl('', { nonNullable: true });
  private readonly filtro = toSignal(this.busqueda.valueChanges.pipe(
    map(normalizar), debounceTime(300), distinctUntilChanged(),
  ), { initialValue: '' });
  readonly visibles = computed(() => this.servicio.fichas().filter(ficha =>
    normalizar(ficha.titulo + ' ' + ficha.materia).includes(this.filtro()),
  ));
}
