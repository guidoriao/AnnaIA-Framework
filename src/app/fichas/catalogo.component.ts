import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="catalogo-barra">
      <a class="catalogo-marca" routerLink="/listado"><img src="/img/anna.jpeg" alt="">Anna IA</a>
      <nav aria-label="Catálogo de fichas">
        <a routerLink="/listado" routerLinkActive="elegido" ariaCurrentWhenActive="page">Fichas</a>
        <a routerLink="/alta" routerLinkActive="elegido" ariaCurrentWhenActive="page">Nueva ficha</a>
        <a routerLink="/inicio">Aula</a>
      </nav>
    </header>
    <main class="catalogo-pagina"><router-outlet /></main>
  `,
})
export class CatalogoComponent {}
