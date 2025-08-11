import { apiClient } from "../../../shared/services/apiService";
import { TRANSACTIONS_ENDPOINTS } from './endpoints';

export const transactionsApi = {
    createNewInvoice: (payload: {
        tipo_comprobante: string;
        serie_comprobante: string;
        numero_comprobante: string;
        fecha_emision: string;
        hora_emision: string;
        direccion: string;
        telefono: string;
        email: string;
        nombre_cliente: string;
        ruc_cliente: string;
        items: {
            descripcion: string;
            cantidad: number;
            precio_unitario: number;
            descuento: number;
            impuesto: number;
            total: number;
        }[];
        total: number;
        moneda: string;
        cambio: number;
        total_pagar: number;
    }) => apiClient.post(TRANSACTIONS_ENDPOINTS.NUEVO_COMPROBANTE, payload),
    
    registerSale: (payload: {
        correlativo: string;
        idPersona: number;
        tipoOperacion: string;
        tipoComprobante: string;
        fechaEmision: string;
        moneda: string;
        tipoCambio: number;
        serie: string;
        numero: string;
        fechaVencimiento: string;
        detalles: {
            cantidad: number;
            unidadMedida: string;
            precioUnitario: number;
            subtotal: number;
            igv: number;
            isc: number;
            total: number;
            descripcion: string;
        }[];
    }) => apiClient.post(TRANSACTIONS_ENDPOINTS.REGISTRAR_VENTA, payload),
} as const;

export type TransactionsApi = typeof transactionsApi;
