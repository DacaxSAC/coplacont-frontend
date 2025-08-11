import styles from './CreateSaleForm.module.scss';
import { Text } from "@/components";

export const CreateSaleForm = () => {
  return (
      <div className={styles.CreateSaleForm}>
        <Text size="xl" color="neutral-primary">
          Ingresa los siguientes campos
        </Text>

        {/** Formulario */}
        <div className={styles.CreateSaleForm__Fields}>
          {/** Campo Correlativo */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Correlativo
            </Text>
            <input type="text" />
          </div>

          {/** Campo Cliente */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Cliente
            </Text>
            <input type="text" />
          </div>

          {/** Campo Tipo de venta */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Tipo de venta
            </Text>
            <input type="text" />
          </div>

          {/** Campo Tipo de comprobante */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Tipo de comprobante
            </Text>
            <input type="text" />
          </div>

          {/** Campo Fecha de emisión */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Fecha de emision
            </Text>
            <input type="text" />
          </div>

          {/** Campo Moneda */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Tipo de cambio de la SUNAT
            </Text>
            <input type="text" />
          </div>

          {/** Campo Serie */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Serie
            </Text>
            <input type="text" />
          </div>

          {/** Campo Numero */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Numero
            </Text>
            <input type="text" />
          </div>

          {/** Campo Fecha de vencimiento */}
          <div className={styles.CreateSaleForm__FormField}>
            <Text size="sm" color="neutral-primary">
              Fecha de vencimiento
            </Text>
            <input type="text" />
          </div>
        </div>
      </div>
  );
};