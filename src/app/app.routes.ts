import { CatalogoComponent } from './fichas/catalogo.component';
import { Routes } from '@angular/router';
import { docenteGuard, sesionGuard } from './core/rol.guard';
import { LayoutComponent } from './layout/layout.component';
import { AyudaComponent } from './paginas/ayuda/ayuda.component';
import { BibliotecaComponent } from './paginas/biblioteca/biblioteca.component';
import { ChatComponent } from './paginas/chat/chat.component';
import { ConfiguracionComponent } from './paginas/configuracion/configuracion.component';
import { IngresoComponent } from './paginas/ingreso/ingreso.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { MisConsultasComponent } from './paginas/mis-consultas/mis-consultas.component';
import { PanelDocenteComponent } from './paginas/panel-docente/panel-docente.component';

export const routes: Routes = [
  {
    path: '', component: CatalogoComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'listado' },
      { path: 'listado', title: 'Fichas de estudio', loadComponent: () => import('./fichas/listado.component').then(m => m.ListadoComponent) },
      { path: 'alta', title: 'Nueva ficha', loadComponent: () => import('./fichas/alta.component').then(m => m.AltaComponent) },
      { path: 'detalle/:id', title: 'Detalle de la ficha', loadComponent: () => import('./fichas/detalle.component').then(m => m.DetalleComponent) },
    ],
  },
  { path: 'ingreso', component: IngresoComponent, title: 'Ingreso' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [sesionGuard],
    children: [
      { path: 'inicio', component: InicioComponent, title: 'Inicio' },
      { path: 'biblioteca', component: BibliotecaComponent, title: 'Biblioteca' },
      { path: 'anna', component: ChatComponent, title: 'Anna IA' },
      { path: 'consultas', component: MisConsultasComponent, title: 'Mis consultas' },
      { path: 'configuracion', component: ConfiguracionComponent, title: 'Configuración' },
      { path: 'ayuda', component: AyudaComponent, title: 'Ayuda' },
      { path: 'docente', component: PanelDocenteComponent, title: 'Panel docente', canActivate: [docenteGuard] },

    ],
  },
  { path: '', component: CatalogoComponent, children: [
    { path: '**', title: 'Página no encontrada', loadComponent: () => import('./fichas/no-encontrada.component').then(m => m.NoEncontradaComponent) },
  ] },
];
