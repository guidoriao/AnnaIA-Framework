import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MATERIAS } from '../core/datos-mock';
import { FichasService } from './fichas.service';

export function tituloDisponible(servicio: FichasService): ValidatorFn {
  return control => servicio.existeTitulo(control.value ?? '') ? { tituloOcupado: true } : null;
}

@Component({
  imports: [ReactiveFormsModule],
  templateUrl: './alta.component.html',
})
export class AltaComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly servicio = inject(FichasService);
  private readonly router = inject(Router);
  readonly materias = MATERIAS;
  readonly formulario = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(80),
      Validators.pattern(/^\S(?:.*\S)?$/), tituloDisponible(this.servicio)]],
    materia: ['', Validators.required],
    duracion: this.fb.control<number | null>(null, [Validators.required, Validators.min(5),
      Validators.max(120), Validators.pattern(/^\d+$/)]),
    actividad: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(800),
      Validators.pattern(/^\S[\s\S]*\S$/)]],
  });

  error(campo: keyof typeof this.formulario.controls): string {
    const control = this.formulario.controls[campo];
    if (control.valid || !(control.touched || control.dirty)) return '';
    if (control.hasError('required')) return 'Completa este campo.';
    if (control.hasError('tituloOcupado')) return 'Ya existe una ficha con este título.';
    if (control.hasError('minlength')) return 'Escribe al menos ' + control.getError('minlength').requiredLength + ' caracteres.';
    if (control.hasError('maxlength')) return 'Usa hasta ' + control.getError('maxlength').requiredLength + ' caracteres.';
    if (campo === 'duracion') return 'Escribe un número entero entre 5 y 120.';
    return 'Quita los espacios del comienzo y del final.';
  }

  guardar(): void {
    if (this.formulario.invalid) return;
    const { titulo, materia, duracion, actividad } = this.formulario.getRawValue();
    if (duracion === null) return;
    this.servicio.agregar({ titulo: titulo.trim(), materia, minutos: duracion, actividad: actividad.trim() });
    this.formulario.reset();
    void this.router.navigate(['/listado']);
  }
}
