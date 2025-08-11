import React, { useState } from 'react';
import styles from './CreateSaleForm.module.scss';
import { Text, Input, ComboBox, Divider } from "@/components";

const ClienteEnum = {
  JUAN_PEREZ: 'cli-001',
  ACME_SAC: 'cli-002',
  MARIA_LOPEZ: 'cli-003',
} as const;

const TipoVentaEnum = {
  CONTADO: 'contado',
  CREDITO: 'credito',
} as const;

const TipoComprobanteEnum = {
  FACTURA: 'fac',
  BOLETA: 'bol',
  NOTA_CREDITO: 'nc',
  NOTA_DEBITO: 'nd',
} as const;

const TipoCambioEnum = {
  SUNAT: 'sunat',
  SBS: 'sbs',
} as const;

const MonedaEnum = {
  SOL: 'sol',
  DOLAR: 'dolar',
} as const;

type ClienteType = typeof ClienteEnum[keyof typeof ClienteEnum];
type TipoVentaType = typeof TipoVentaEnum[keyof typeof TipoVentaEnum];
type TipoComprobanteType = typeof TipoComprobanteEnum[keyof typeof TipoComprobanteEnum];
type TipoCambioType = typeof TipoCambioEnum[keyof typeof TipoCambioEnum];
type MonedaType = typeof MonedaEnum[keyof typeof MonedaEnum];

interface CreateSaleFormState {
  correlativo: string;
  cliente: ClienteType | '';
  tipoVenta: TipoVentaType | '';
  tipoComprobante: TipoComprobanteType | '';
  fechaEmision: string;
  moneda: MonedaType | '';
  tipoCambio: TipoCambioType | '';
  serie: string;
  numero: string;
  fechaVencimiento: string;
}

// Datos para los ComboBox basados en los enums
const clientesOptions = [
  { value: ClienteEnum.JUAN_PEREZ, label: 'Juan Pérez' },
  { value: ClienteEnum.ACME_SAC, label: 'Acme S.A.C.' },
  { value: ClienteEnum.MARIA_LOPEZ, label: 'María López' },
];

const tipoVentaOptions = [
  { value: TipoVentaEnum.CONTADO, label: 'Contado' },
  { value: TipoVentaEnum.CREDITO, label: 'Crédito' },
];

const tipoComprobanteOptions = [
  { value: TipoComprobanteEnum.FACTURA, label: 'Factura' },
  { value: TipoComprobanteEnum.BOLETA, label: 'Boleta' },
  { value: TipoComprobanteEnum.NOTA_CREDITO, label: 'Nota de Crédito' },
  { value: TipoComprobanteEnum.NOTA_DEBITO, label: 'Nota de Débito' },
];

const tipoCambioOptions = [
  { value: TipoCambioEnum.SUNAT, label: 'SUNAT' },
  { value: TipoCambioEnum.SBS, label: 'SBS' },
];

const monedaOptions = [
  { value: MonedaEnum.SOL, label: 'Sol' },
  { value: MonedaEnum.DOLAR, label: 'Dólar' },
];

export const CreateSaleForm = () => {
  const [formState, setFormState] = useState<CreateSaleFormState>({
    correlativo: '',
    cliente: '',
    tipoVenta: '',
    tipoComprobante: '',
    fechaEmision: '',
    moneda: '',
    tipoCambio: '',
    serie: '',
    numero: '',
    fechaVencimiento: '',
  });

  /**
   * Maneja los cambios en los campos de texto
   */
  const handleInputChange = (field: keyof CreateSaleFormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  /**
   * Maneja los cambios en los ComboBox
   */
  const handleComboBoxChange = (field: keyof CreateSaleFormState) => (
    value: string | number
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: String(value)
    }));
  };

  return (
      <div className={styles.CreateSaleForm}>
        <Text size="xl" color="neutral-primary">
          Ingresa los siguientes campos
        </Text>

        {/** Formulario */}
        <div className={styles.CreateSaleForm__Form}>
          
          {/** Fila 1: Correlativo y Cliente */}
          <div className={styles.CreateSaleForm__FormRow}>
            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--correlativo']}`}>
              <Text size="sm" color="neutral-primary">
                Correlativo
              </Text>
              <Input 
                variant="createSale" 
                value={formState.correlativo}
                onChange={handleInputChange('correlativo')}
              />
            </div>

            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--cliente']}`}>
              <Text size="sm" color="neutral-primary">
                Cliente
              </Text>
              <ComboBox
                options={clientesOptions}
                variant="createSale"
                name="cliente"
                value={formState.cliente}
                onChange={handleComboBoxChange('cliente')}
              />
            </div>
          </div>

          {/** Fila 2: Tipo de venta y Tipo de comprobante */}
          <div className={styles.CreateSaleForm__FormRow}>
            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--half']}`}>
              <Text size="sm" color="neutral-primary">
                Tipo de venta
              </Text>
              <ComboBox
                options={tipoVentaOptions}
                variant='createSale'
                name="tipoVenta"
                value={formState.tipoVenta}
                onChange={handleComboBoxChange('tipoVenta')}
              />
            </div>

            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--half']}`}>
              <Text size="sm" color="neutral-primary">
                Tipo de comprobante
              </Text>
              <ComboBox
                options={tipoComprobanteOptions}
                variant="createSale"
                name="tipoComprobante"
                value={formState.tipoComprobante}
                onChange={handleComboBoxChange('tipoComprobante')}
              />
            </div>
          </div>

          {/** Fila 3: Fecha de emisión, Moneda y Tipo de cambio */}
          <div className={styles.CreateSaleForm__FormRow}>
            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--third']}`}>
              <Text size="sm" color="neutral-primary">
                Fecha de emisión
              </Text>
              <Input 
                type="date"
                variant="createSale" 
                value={formState.fechaEmision}
                onChange={handleInputChange('fechaEmision')}
              />
            </div>

            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--third']}`}>
              <Text size="sm" color="neutral-primary">
                Moneda
              </Text>
              <ComboBox
                options={monedaOptions}
                variant="createSale"
                name="moneda"
                value={formState.moneda}
                onChange={handleComboBoxChange('moneda')}
              />
            </div>

            {/** Campo Tipo de cambio de la SUNAT */}
            {(formState.moneda !== MonedaEnum.SOL && formState.moneda !== '') && (
              <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--third']}`}>
                <Text size="sm" color="neutral-primary">
                  Tipo de cambio de la SUNAT
                </Text>
                <ComboBox
                  options={tipoCambioOptions}
                  variant="createSale"
                  name="tipoCambio"
                  value={formState.tipoCambio}
                  onChange={handleComboBoxChange('tipoCambio')}
                />
              </div>
            )}
          </div>

          {/** Fila 4: Serie, Número y Fecha de vencimiento */}
          <div className={styles.CreateSaleForm__FormRow}>
            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--third']}`}>
              <Text size="sm" color="neutral-primary">
                Serie
              </Text>
              <Input 
                variant="createSale"
                value={formState.serie}
                onChange={handleInputChange('serie')}
              />
            </div>

            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--third']}`}>
              <Text size="sm" color="neutral-primary">
                Número
              </Text>
              <Input 
                variant="createSale" 
                value={formState.numero}
                onChange={handleInputChange('numero')}
              />
            </div>

            <div className={`${styles.CreateSaleForm__FormField} ${styles['CreateSaleForm__FormField--third']}`}>
              <Text size="sm" color="neutral-primary">
                Fecha de vencimiento
              </Text>
              <Input 
                type="date"
                variant="createSale" 
                value={formState.fechaVencimiento}
                onChange={handleInputChange('fechaVencimiento')}
              />
            </div>
          </div>
        </div>

        <Divider/>

        <Text size="xl" color="neutral-primary">
          Detalle de la venta
        </Text>

      </div>
  );
};