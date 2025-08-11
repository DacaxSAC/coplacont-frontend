import React from "react";
import styles from "./RegisterSalePage.module.scss";
import { Text } from "@/components";
import { PageLayout } from "@/components";

export const RegisterSalePage: React.FC = () => {
  return (
    <PageLayout
      title="Registrar venta"
      subtitle="Permite registrar una nueva venta con sus datos."
    >
      {/** Cabecera del formulario */}
      <div className={styles.RegisterSalePage__HeaderArea}>
        <Text size="xl" color="neutral-primary">
          Ingresa los siguientes campos
        </Text>

        {/** Formulario */}
        <div className={styles.RegisterSalePage__HeaderArea__Fields}>
          {/** Campo Correlativo */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Correlativo
            </Text>
            <input type="text" />
          </div>

          {/** Campo Cliente */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Cliente
            </Text>
            <input type="text" />
          </div>

          {/** Campo Tipo de venta */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Tipo de venta
            </Text>
            <input type="text" />
          </div>

          {/** Campo Tipo de comprobante */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Tipo de comprobante
            </Text>
            <input type="text" />
          </div>

          {/** Campo Fecha de emisión */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Fecha de emision
            </Text>
            <input type="text" />
          </div>

          {/** Campo Moneda */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Tipo de cambio de la SUNAT
            </Text>
            <input type="text" />
          </div>

          {/** Campo Serie */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Serie
            </Text>
            <input type="text" />
          </div>

          {/** Campo Numero */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Numero
            </Text>
            <input type="text" />
          </div>

          {/** Campo Fecha de vencimiento */}
          <div className={styles.RegisterSalePage__FormField}>
            <Text size="sm" color="neutral-primary">
              Fecha de vencimiento
            </Text>
            <input type="text" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
