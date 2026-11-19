import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: '<h1>Página no encontrada</h1><p>Error 404. Esta dirección no corresponde a una vista de Anna IA.</p><a class="regresar" routerLink="/listado">Volver al listado</a>',
})
export class NoEncontradaComponent {}
