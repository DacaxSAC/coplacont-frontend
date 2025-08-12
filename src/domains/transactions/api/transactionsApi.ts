import { apiClient } from "../../../shared/services/apiService";
import { TRANSACTIONS_ENDPOINTS } from './endpoints';

export const transactionsApi = {
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
    getSales: ()  => apiClient.get(TRANSACTIONS_ENDPOINTS.OBTENER_VENTAS),
    getPurchases: ()  => apiClient.get(TRANSACTIONS_ENDPOINTS.OBTENER_COMPRAS),
} as const;

export type TransactionsApi = typeof transactionsApi;
