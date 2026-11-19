import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, expect, it, vi } from 'vitest';
import { routes } from '../app.routes';
import { AltaComponent } from './alta.component';
import { FichasService } from './fichas.service';
import { ListadoComponent } from './listado.component';

afterEach(() => vi.useRealTimers());

it('valida al tocar, comprueba el mínimo y rechaza un título repetido', () => {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const alta = TestBed.createComponent(AltaComponent).componentInstance;
  const f = alta.formulario;
  expect(alta.error('titulo')).toBe('');
  f.markAllAsTouched();
  expect(alta.error('titulo')).toBe('Completa este campo.');
  f.controls.duracion.setValue(4);
  expect(f.controls.duracion.hasError('min')).toBe(true);
  f.controls.duracion.setValue(5);
  expect(f.controls.duracion.valid).toBe(true);
  f.controls.titulo.setValue('EL VIAJE DE UNA GOTA');
  expect(f.controls.titulo.hasError('tituloOcupado')).toBe(true);
  f.controls.titulo.setValue('La sombra al mediodía');
  expect(f.controls.titulo.valid).toBe(true);
});

it('convierte los datos, agrega una ficha y reinicia el alta', async () => {
  TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] });
  const alta = TestBed.createComponent(AltaComponent).componentInstance;
  alta.formulario.setValue({ titulo: 'La sombra al mediodía', materia: 'Geografía',
    duracion: 15, actividad: 'Dibuja cómo cambia la sombra de un árbol durante el día.' });
  alta.guardar();
  expect(TestBed.inject(FichasService).fichas().at(-1)).toMatchObject({ minutos: 15, id: 4 });
  expect(alta.formulario.pristine).toBe(true);
  expect(alta.formulario.controls.titulo.value).toBe('');
  await TestBed.inject(ApplicationRef).whenStable();
});

it('filtra una sola vez tras 300 ms y omite búsquedas equivalentes', () => {
  vi.useFakeTimers();
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const listado = TestBed.createComponent(ListadoComponent).componentInstance;
  const inicial = listado.visibles();
  for (const valor of ['f', 'fr', 'fra']) {
    listado.busqueda.setValue(valor);
    vi.advanceTimersByTime(50);
    expect(listado.visibles()).toBe(inicial);
  }
  vi.advanceTimersByTime(249);
  expect(listado.visibles()).toBe(inicial);
  vi.advanceTimersByTime(1);
  const filtradas = listado.visibles();
  expect(filtradas.map(f => f.id)).toEqual([3]);
  listado.busqueda.setValue('FRA');
  vi.advanceTimersByTime(300);
  expect(listado.visibles()).toBe(filtradas);
});

it('resuelve el detalle, un identificador inexistente y la ruta 404 sin sesión', async () => {
  TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] });
  const web = await RouterTestingHarness.create('/detalle/1');
  expect(web.routeNativeElement?.textContent).toContain('El viaje de una gota');
  await web.navigateByUrl('/detalle/99999');
  expect(web.routeNativeElement?.textContent).toContain('Ficha no encontrada');
  await web.navigateByUrl('/ruta-inexistente');
  expect(web.routeNativeElement?.textContent).toContain('Error 404');
});
