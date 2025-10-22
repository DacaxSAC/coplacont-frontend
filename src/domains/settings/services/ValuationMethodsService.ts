import { handleApiError } from "@/shared";
import { PeriodosApi } from "../api/periodosApi";
import type { MetodoValoracion, UpdateMetodoValoracionDto } from "../types";

/**
 * Servicio para gestión de métodos de valoración
 * Maneja las operaciones relacionadas con la configuración de métodos de valoración
 */
export class ValuationMethodsService {
  /**
   * Actualiza el método de valoración activo en el sistema
   * @param metodoValoracion - Nuevo método de valoración a establecer
   * @returns Promise con la respuesta del servidor
   */
  static async updateMetodoValoracion(metodoValoracion: MetodoValoracion) {
    try {
      const payload: UpdateMetodoValoracionDto = {
        metodoValoracion
      };
      
      const response = await PeriodosApi.updateMetodoValoracion(payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Activa un método de valoración específico
   * @param metodo - Método de valoración a activar
   * @returns Promise con la respuesta del servidor
   */
  static async activateMethod(metodo: MetodoValoracion) {
    return this.updateMetodoValoracion(metodo);
  }

  /**
   * Desactiva el método de valoración actual (establece PROMEDIO como predeterminado)
   * @returns Promise con la respuesta del servidor
   */
  static async deactivateMethod() {
    // Al desactivar, establecemos PROMEDIO como método predeterminado
    return this.updateMetodoValoracion('PROMEDIO' as MetodoValoracion);
  }

  /**
   * Cambia el estado de un método de valoración
   * @param metodo - Método de valoración
   * @param activate - true para activar, false para desactivar
   * @returns Promise con la respuesta del servidor
   */
  static async toggleMethodStatus(metodo: MetodoValoracion, activate: boolean) {
    if (activate) {
      return this.activateMethod(metodo);
    } else {
      return this.deactivateMethod();
    }
  }
}