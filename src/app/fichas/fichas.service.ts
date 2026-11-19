import { Injectable, signal } from '@angular/core';

export interface Ficha {
  readonly id: number;
  readonly titulo: string;
  readonly materia: string;
  readonly minutos: number;
  readonly actividad: string;
}

const INICIALES: Ficha[] = [
  { id: 1, titulo: 'El viaje de una gota', materia: 'Ciencias Naturales', minutos: 15,
    actividad: 'Dibuja el recorrido del agua entre el mar, una nube y un río. Marca con flechas dónde ocurre la evaporación, la condensación y la precipitación. Explica qué energía inicia el recorrido.' },
  { id: 2, titulo: 'Un mapa del camino a la escuela', materia: 'Geografía', minutos: 20,
    actividad: 'Traza el camino desde un punto conocido hasta la escuela. Diseña una leyenda con tres símbolos y señala el norte. Intercambia el mapa con alguien que pueda seguir tus indicaciones.' },
  { id: 3, titulo: 'Fracciones en un tejido', materia: 'Matemáticas', minutos: 10,
    actividad: 'Dibuja una franja de doce cuadros. Colorea seis de un color, cuatro de otro y dos de un tercero. Escribe y simplifica la fracción que ocupa cada color. Comprueba que juntas sumen una unidad.' },
];

export const normalizar = (s: string) => s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');

@Injectable({ providedIn: 'root' })
export class FichasService {
  private readonly registros = signal<readonly Ficha[]>(INICIALES);
  readonly fichas = this.registros.asReadonly();

  existeTitulo(titulo: string): boolean {
    return this.fichas().some(ficha => normalizar(ficha.titulo) === normalizar(titulo));
  }

  agregar(datos: Omit<Ficha, 'id'>): void {
    this.registros.update(actuales => [
      ...actuales, { ...datos, id: Math.max(0, ...actuales.map(ficha => ficha.id)) + 1 },
    ]);
  }
}
