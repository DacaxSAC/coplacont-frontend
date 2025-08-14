import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateSaleForm.module.scss";

import { Text, Input, ComboBox, Divider, Button } from "@/components";
import { Table, type TableRow } from "@/components/organisms/Table";
import { TransactionsService } from "../../services/TransactionsService";
import { EntitiesService } from "@/domains/maintainers/services/entitiesService";
import { ProductService, WarehouseService } from "@/domains/maintainers/services";
import type { Product, Warehouse } from "@/domains/maintainers/types";
import type { Entidad } from "@/domains/maintainers/services/entitiesService";
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, COMMON_ROUTES } from "@/router";
import {
  TipoVentaEnum,
  TipoProductoVentaEnum,
  TipoComprobanteEnum,
  MonedaEnum,
  ProductoEnum,
  UnidadMedidaEnum,
} from "./enums";
import type {
  TipoVentaType,
  TipoProductoVentaType,
  TipoComprobanteType,
  MonedaType,
  ProductoType,
  UnidadMedidaType,
} from "./enums";
import {
  tipoVentaOptions,
  tipoProductoVentaOptions,
  tipoComprobanteOptions,
  monedaOptions,
  unidadMedidaOptions,
} from "./types";
import type { CreateSaleFormState, DetalleVentaItem } from "./types";

export const CreateSaleForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<CreateSaleFormState>({
    correlativo: "",
    cliente: "",
    tipoVenta: "",
    tipoProductoVenta: "",
    tipoComprobante: "",
    fechaEmision: "",
    moneda: "",
    tipoCambio: "",
    serie: "",
    numero: "",
    fechaVencimiento: "",
  });

  // Estados para el detalle de productos
  const [detalleVenta, setDetalleVenta] = useState<DetalleVentaItem[]>([]);

  // Obtener el correlativo al montar el componente
  useEffect(() => {
    const fetchCorrelativo = async () => {
      try {
        const response = await TransactionsService.getCorrelative("venta");
        setFormState((prev) => ({
          ...prev,
          correlativo: response.correlativo,
        }));
      } catch (error) {
        console.error("Error al obtener el correlativo:", error);
      }
    };

    fetchCorrelativo();
  }, []);
  const [productoSeleccionado, setProductoSeleccionado] = useState<
    ProductoType | ""
  >("");
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState<
    UnidadMedidaType | ""
  >("");
  const [cantidadIngresada, setCantidadIngresada] = useState<string>("");

  const handleInputChange =
    (field: keyof CreateSaleFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleComboBoxChange =
    (field: keyof CreateSaleFormState) => (value: string | number) => {
      setFormState((prev) => ({
        ...prev,
        [field]: String(value),
      }));
    };

  const handleTipoComprobanteChange = (value: string | number) => {
    const tipoComprobanteValue = String(value) as TipoComprobanteType;

    setFormState((prev) => ({
      ...prev,
      tipoComprobante: tipoComprobanteValue,
      cliente: "", // Limpiar cliente al cambiar tipo de comprobante
    }));
  };

  const isMonedaEnabled = (): boolean => {
    return formState.fechaEmision !== "";
  };

  const isClienteEnabled = (): boolean => {
    return (
      formState.tipoComprobante === TipoComprobanteEnum.FACTURA ||
      formState.tipoComprobante === TipoComprobanteEnum.BOLETA
    );
  };

  const isDetalleVentaEnabled = () => {
    return formState.tipoProductoVenta !== "";
  };

  /**
   * Valida si todas las cabeceras obligatorias están completas
   * @returns {boolean} true si todas las cabeceras obligatorias están completas
   */
  const areRequiredHeadersComplete = (): boolean => {
    return (
      formState.tipoComprobante !== "" &&
      formState.fechaEmision !== "" &&
      formState.moneda !== "" &&
      formState.tipoVenta !== "" &&
      formState.tipoProductoVenta !== "" &&
      formState.serie !== "" &&
      formState.numero !== "" &&
      formState.fechaVencimiento !== ""
    );
  };

  /**
   * Maneja el cambio de moneda y actualiza el tipo de cambio
   * Si se selecciona dólar, obtiene el tipo de cambio de la SUNAT según la fecha de emisión
   */
  const handleMonedaChange = async (value: string | number) => {
    const monedaValue = String(value) as MonedaType;

    if (monedaValue === MonedaEnum.DOLAR) {
      try {
        // Obtener tipo de cambio de la SUNAT usando la fecha de emisión
        const typeExchangeData = await TransactionsService.getTypeExchange(
          formState.fechaEmision
        );

        setFormState((prev) => ({
          ...prev,
          moneda: monedaValue,
          tipoCambio: typeExchangeData.data?.compra?.toString() || "3.75", // Usar el valor de compra
        }));
      } catch (error) {
        console.error("Error al obtener tipo de cambio:", error);
        // En caso de error, usar valor por defecto
        setFormState((prev) => ({
          ...prev,
          moneda: monedaValue,
          tipoCambio: "3.75",
        }));
      }
    } else {
      // Para soles, limpiar el tipo de cambio
      setFormState((prev) => ({
        ...prev,
        moneda: monedaValue,
        tipoCambio: "",
      }));
    }
  };

  // Maneja el cambio de producto seleccionado
  //const handleProductoChange = (value: string | number) => {
  //  const productoValue = String(value) as ProductoType;
  //  setProductoSeleccionado(productoValue);
  //
  //  // Buscar la unidad de medida correspondiente al producto seleccionado
  //  const productoOption = productosOptions.find(
  //    (option) => option.value === productoValue
  //  );
  //  if (productoOption) {
  //    setUnidadMedidaSeleccionada(productoOption.unidadMedida);
  //  }
  //};

  // Maneja el cambio de cantidad ingresada
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidadIngresada(e.target.value);
  };

  const handleAceptarVenta = async () => {
    try {
      const detallesAPI = detalleVenta.map((item) => ({
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida.toUpperCase(),
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal,
        igv: item.igv,
        isc: item.isv, // Mapear isv a isc
        total: item.total,
        descripcion: item.descripcion,
      }));

      const ventaData = {
        correlativo: formState.correlativo || "CORR-12345",
        idPersona: getSelectedClientId() || 1, // Usar ID del cliente seleccionado o valor por defecto
        tipoOperacion: "venta", // Valor fijo
        tipoProductoVenta: formState.tipoProductoVenta || "mercaderia", // Tipo de producto/venta
        tipoComprobante: formState.tipoComprobante || "FACTURA", // Usar valor del form o fake
        fechaEmision: formState.fechaEmision || "2025-08-10", // Usar valor del form o fake
        moneda: formState.moneda === "sol" ? "PEN" : "USD", // Mapear moneda
        tipoCambio: formState.moneda === "sol" ? 1 : 3.75, // Tipo de cambio fake para dólares
        serie: formState.serie || "F001", // Usar valor del form o fake
        numero: formState.numero || "1234567890", // Usar valor del form o fake
        fechaVencimiento: formState.fechaVencimiento || "2025-08-20", // Usar valor del form o fake
        detalles: detallesAPI,
      };

      await TransactionsService.registerSale(ventaData);

      navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}`);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    }
  };

  const handleAceptarYNuevaVenta = async () => {
    try {
      const detallesAPI = detalleVenta.map((item) => ({
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida.toUpperCase(),
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal,
        igv: item.igv,
        isc: item.isv, // Mapear isv a isc
        total: item.total,
        descripcion: item.descripcion,
      }));

      const ventaData = {
        correlativo: formState.correlativo || "CORR-12345", // Usar valor del form o fake
        idPersona: getSelectedClientId() || 1, // Usar ID del cliente seleccionado o valor por defecto
        tipoOperacion: "venta", // Valor fijo
        tipoProductoVenta: formState.tipoProductoVenta || "mercaderia", // Tipo de producto/venta
        tipoComprobante: formState.tipoComprobante || "FACTURA", // Usar valor del form o fake
        fechaEmision: formState.fechaEmision || "2025-08-10", // Usar valor del form o fake
        moneda: formState.moneda === "sol" ? "PEN" : "USD", // Mapear moneda
        tipoCambio: formState.moneda === "sol" ? 1 : 3.75, // Tipo de cambio fake para dólares
        serie: formState.serie || "F001", // Usar valor del form o fake
        numero: formState.numero || "1234567890", // Usar valor del form o fake
        fechaVencimiento: formState.fechaVencimiento || "2025-08-20", // Usar valor del form o fake
        detalles: detallesAPI,
      };

      await TransactionsService.registerSale(ventaData);

      setFormState({
        correlativo: "",
        cliente: "",
        tipoVenta: "",
        tipoProductoVenta: "",
        tipoComprobante: "",
        fechaEmision: "",
        moneda: "",
        tipoCambio: "",
        serie: "",
        numero: "",
        fechaVencimiento: "",
      });
      setDetalleVenta([]);
      setProductoSeleccionado("");
      setUnidadMedidaSeleccionada("");
      setCantidadIngresada("");

      navigate(
        `${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}${COMMON_ROUTES.REGISTER}`
      );
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    }
  };

  const tableRows: TableRow[] = detalleVenta.map((item, index) => {
    const unidad = unidadMedidaOptions.find(
      (option) => option.value === item.unidadMedida
    );

    return {
      id: item.id,
      cells: [
        item.descripcion,
        item.cantidad.toFixed(2),
        unidad ? unidad.label : item.unidadMedida,
        `S/ ${item.precioUnitario.toFixed(2)}`,
        `S/ ${item.subtotal.toFixed(2)}`,
        `S/ ${item.baseGravado.toFixed(2)}`,
        `S/ ${item.igv.toFixed(2)}`,
        `S/ ${item.isv.toFixed(2)}`,
        `S/ ${item.total.toFixed(2)}`,
        <Button
          key={`delete-${item.id}`}
          size="small"
          variant="danger"
          onClick={() => {}}
        >
          Eliminar
        </Button>,
      ],
    };
  });

  // CLIENTES
  const [clients, setClients] = useState<Entidad[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  useEffect(() => {
    EntitiesService.getClients().then((data) => {
      setClients(data);
      console.log(data);
    });
    ProductService.getAll().then((data) => {
      setProducts(data);
      console.log(data);
    });
    WarehouseService.getAll().then((data) => {
      setWarehouses(data);
      console.log(data);
    });
  }, []);

  const getFilteredClientOptions = () => {
    let filteredClients = clients;

    if (formState.tipoComprobante === TipoComprobanteEnum.FACTURA) {
      filteredClients = clients.filter((client) => client.tipo === "JURIDICA");
    } else if (formState.tipoComprobante === TipoComprobanteEnum.BOLETA) {
      filteredClients = clients.filter((client) => client.tipo === "NATURAL");
    }

    return filteredClients.map((client) => ({
      value: client.id.toString(),
      label: `${client.razonSocial || client.nombreCompleto} - ${
        client.numeroDocumento
      }`,
    }));
  };

  const clientesOptionsFromAPI = getFilteredClientOptions();

  const getSelectedClientId = (): number | null => {
    if (!formState.cliente) return null;

    const selectedClient = clients.find(
      (client) => client.id.toString() === formState.cliente
    );
    return selectedClient ? selectedClient.id : null;
  };

  return (
    <div className={styles.CreateSaleForm}>
      <Text size="xl" color="neutral-primary">
        Cabecera de venta
      </Text>

      {/** Formulario */}
      <div className={styles.CreateSaleForm__Form}>
        {/** Fila 1: Correlativo y Cliente */}
        <div className={styles.CreateSaleForm__FormRow}>
          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--correlativo"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Correlativo
            </Text>
            <Input
              disabled={true}
              size="xs"
              variant="createSale"
              value={formState.correlativo}
              onChange={handleInputChange("correlativo")}
            />
          </div>

          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--half"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Tipo de comprobante
            </Text>
            <ComboBox
              size="xs"
              options={tipoComprobanteOptions}
              variant="createSale"
              name="tipoComprobante"
              value={formState.tipoComprobante}
              onChange={handleTipoComprobanteChange}
            />
          </div>

          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--cliente"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Cliente
            </Text>
            <ComboBox
              size="xs"
              options={clientesOptionsFromAPI}
              variant="createSale"
              name="cliente"
              value={formState.cliente}
              onChange={handleComboBoxChange("cliente")}
              disabled={!isClienteEnabled()} // Habilitado solo para FACTURA o BOLETA
            />
          </div>
        </div>

        {/** Fila 2: Fecha de emisión, Moneda y Tipo de cambio */}
        <div className={styles.CreateSaleForm__FormRow}>
          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Fecha de emisión
            </Text>
            <Input
              size="xs"
              type="date"
              variant="createSale"
              value={formState.fechaEmision}
              onChange={handleInputChange("fechaEmision")}
            />
          </div>

          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Moneda
            </Text>
            <ComboBox
              size="xs"
              options={monedaOptions}
              variant="createSale"
              name="moneda"
              value={formState.moneda}
              onChange={handleMonedaChange} // Usar el nuevo manejador
              disabled={!isMonedaEnabled()} // Habilitado solo cuando hay fecha de emisión
            />
          </div>

          {/** Campo Tipo de cambio de la SUNAT - Ahora como Input bloqueado */}
          {formState.moneda !== MonedaEnum.SOL && formState.moneda !== "" && (
            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Tipo de cambio de la SUNAT
              </Text>
              <Input
                size="xs"
                variant="createSale"
                value={formState.tipoCambio}
                disabled={true}
              />
            </div>
          )}

          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--half"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Condiciones de pago
            </Text>
            <ComboBox
              size="xs"
              options={tipoVentaOptions}
              variant="createSale"
              name="tipoVenta"
              value={formState.tipoVenta}
              onChange={handleComboBoxChange("tipoVenta")}
            />
          </div>
        </div>

        {/** Fila 3: Serie, Número y Fecha de vencimiento */}
        <div className={styles.CreateSaleForm__FormRow}>
          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Tipo de venta
            </Text>
            <ComboBox
              size="xs"
              options={tipoProductoVentaOptions}
              variant="createSale"
              name="tipoProductoVenta"
              value={formState.tipoProductoVenta}
              onChange={handleComboBoxChange("tipoProductoVenta")}
            />
          </div>

          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Serie
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={formState.serie}
              onChange={handleInputChange("serie")}
            />
          </div>

          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Número
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={formState.numero}
              onChange={handleInputChange("numero")}
            />
          </div>

          <div
            className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Fecha de vencimiento
            </Text>
            <Input
              size="xs"
              type="date"
              variant="createSale"
              value={formState.fechaVencimiento}
              onChange={handleInputChange("fechaVencimiento")}
            />
          </div>
        </div>

      </div>

      <Divider />

      {/* Mostrar sección de detalle solo si se ha seleccionado un tipo de producto venta */}
      {formState.tipoProductoVenta && (
        <>
          <Text size="xl" color="neutral-primary">
            Detalle de venta
          </Text>

          <div className={styles.CreateSaleForm__AddItems}>
            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Almacen
              </Text>
              <ComboBox
                size="xs"
                options={tipoProductoVentaOptions}
                variant="createSale"
                name="tipoProductoVenta"
                value={formState.tipoProductoVenta}
                onChange={handleComboBoxChange("tipoProductoVenta")}
              />
            </div>

            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Producto
              </Text>
              <ComboBox
                size="xs"
                options={tipoProductoVentaOptions}
                variant="createSale"
                name="tipoProductoVenta"
                value={formState.tipoProductoVenta}
                onChange={handleComboBoxChange("tipoProductoVenta")}
                disabled={!isDetalleVentaEnabled()}
              />
            </div>

            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--small"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Unidad de medida
              </Text>
              <Input
                size="xs"
                variant="createSale"
                value={
                  unidadMedidaSeleccionada
                    ? unidadMedidaOptions.find(
                        (option) => option.value === unidadMedidaSeleccionada
                      )?.label || ""
                    : ""
                }
                disabled={!isDetalleVentaEnabled()}
              />
            </div>

            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Precio unitario
              </Text>
            </div>

            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--small"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Cantidad
              </Text>
              <Input
                size="xs"
                type="number"
                variant="createSale"
                value={cantidadIngresada}
                onChange={handleCantidadChange}
                disabled={!isDetalleVentaEnabled()}
              />
            </div>

            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--button"]}`}
            >
              <Button
                size="small"
                onClick={() => {}}
                disabled={!isDetalleVentaEnabled()}
              >
                Agregar
              </Button>
            </div>
          </div>

          {/** Table */}
          {/**{detalleVenta.length > 0 && (
            <Table
              headers={tableHeaders}
              rows={tableRows}
              gridTemplate="2.5fr 1fr 1fr 1.2fr 1.2fr 1.2fr 1fr 1fr 1.2fr 1fr"
            />
          )}*/}
       <Divider />
        </>
      )}



      <div className={styles.CreateSaleForm__Actions}>
        <Button 
          onClick={handleAceptarVenta}
          disabled={!areRequiredHeadersComplete()}
        >
          Aceptar
        </Button>
        <Button 
          onClick={handleAceptarYNuevaVenta}
          disabled={!areRequiredHeadersComplete()}
        >
          Aceptar y nueva venta
        </Button>
      </div>
    </div>
  );
};
