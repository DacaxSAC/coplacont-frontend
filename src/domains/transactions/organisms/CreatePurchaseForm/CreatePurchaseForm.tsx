import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePurchaseForm.module.scss";

import { Text, Input, ComboBox, Divider, Button } from "@/components";
import { Table, type TableRow } from "@/components/organisms/Table";
import { TransactionsService } from "../../services/TransactionsService";
import { EntitiesService } from "@/domains/entities";
import { MaintainersService } from "@/domains/maintainers/services";
import type { Product, Warehouse } from "@/domains/maintainers/services";
import type { Entidad } from "@/domains/entities/service";
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, COMMON_ROUTES } from "@/router";

const TipoCompraEnum = {
  CONTADO: "contado",
  CREDITO: "credito",
} as const;

const TipoProductoCompraEnum = {
  MERCADERIA: "mercaderia",
  SERVICIO: "servicio",
} as const;

const TipoComprobanteEnum = {
  FACTURA: "FACTURA",
  BOLETA: "BOLETA",
  NOTA_CREDITO: "nc",
  NOTA_DEBITO: "nd",
} as const;

const TipoCambioEnum = {
  SUNAT: "sunat",
  SBS: "sbs",
} as const;

const MonedaEnum = {
  SOL: "sol",
  DOLAR: "dol",
} as const;

const ProductoEnum = {
  PRODUCTO_A: "prod-001",
  PRODUCTO_B: "prod-002",
  SERVICIO_A: "serv-001",
  SERVICIO_B: "serv-002",
} as const;

const UnidadMedidaEnum = {
  UNIDAD: "und",
  KILOGRAMO: "kg",
  METRO: "m",
  LITRO: "lt",
  CAJA: "cja",
} as const;

type TipoCompraType = (typeof TipoCompraEnum)[keyof typeof TipoCompraEnum];
type TipoProductoCompraType =
  (typeof TipoProductoCompraEnum)[keyof typeof TipoProductoCompraEnum];
type TipoComprobanteType =
  (typeof TipoComprobanteEnum)[keyof typeof TipoComprobanteEnum];
type TipoCambioType = (typeof TipoCambioEnum)[keyof typeof TipoCambioEnum];
type MonedaType = (typeof MonedaEnum)[keyof typeof MonedaEnum];
type ProductoType = (typeof ProductoEnum)[keyof typeof ProductoEnum];
type UnidadMedidaType =
  (typeof UnidadMedidaEnum)[keyof typeof UnidadMedidaEnum];

interface DetalleCompraItem {
  id: string;
  producto: ProductoType;
  descripcion: string;
  unidadMedida: UnidadMedidaType;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  baseGravado: number;
  igv: number;
  isv: number;
  total: number;
}

interface CreatePurchaseFormState {
  correlativo: string;
  proveedor: string | "";
  tipoCompra: TipoCompraType | "";
  tipoProductoCompra: TipoProductoCompraType | "";
  tipoComprobante: TipoComprobanteType | "";
  fechaEmision: string;
  moneda: MonedaType | "";
  tipoCambio: string;
  serie: string;
  numero: string;
  fechaVencimiento: string;
}

const tipoCompraOptions = [
  { value: TipoCompraEnum.CONTADO, label: "Contado" },
  { value: TipoCompraEnum.CREDITO, label: "Crédito" },
];

const tipoProductoCompraOptions = [
  { value: TipoProductoCompraEnum.MERCADERIA, label: "Mercadería" },
  { value: TipoProductoCompraEnum.SERVICIO, label: "Servicio" },
];

const tipoComprobanteOptions = [
  { value: TipoComprobanteEnum.FACTURA, label: "Factura" },
  { value: TipoComprobanteEnum.BOLETA, label: "Boleta" },
  { value: TipoComprobanteEnum.NOTA_CREDITO, label: "Nota de Crédito" },
  { value: TipoComprobanteEnum.NOTA_DEBITO, label: "Nota de Débito" },
];

const tipoCambioOptions = [
  { value: TipoCambioEnum.SUNAT, label: "SUNAT" },
  { value: TipoCambioEnum.SBS, label: "SBS" },
];

const monedaOptions = [
  { value: MonedaEnum.SOL, label: "Sol" },
  { value: MonedaEnum.DOLAR, label: "Dólar" },
];

const productosOptions = [
  {
    value: ProductoEnum.PRODUCTO_A,
    label: "Producto A - Descripción del producto A",
    unidadMedida: UnidadMedidaEnum.UNIDAD,
  },
  {
    value: ProductoEnum.PRODUCTO_B,
    label: "Producto B - Descripción del producto B",
    unidadMedida: UnidadMedidaEnum.KILOGRAMO,
  },
  {
    value: ProductoEnum.SERVICIO_A,
    label: "Servicio A - Descripción del servicio A",
    unidadMedida: UnidadMedidaEnum.UNIDAD,
  },
  {
    value: ProductoEnum.SERVICIO_B,
    label: "Servicio B - Descripción del servicio B",
    unidadMedida: UnidadMedidaEnum.METRO,
  },
];

const unidadMedidaOptions = [
  { value: UnidadMedidaEnum.UNIDAD, label: "Unidad" },
  { value: UnidadMedidaEnum.KILOGRAMO, label: "Kilogramo" },
  { value: UnidadMedidaEnum.METRO, label: "Metro" },
  { value: UnidadMedidaEnum.LITRO, label: "Litro" },
  { value: UnidadMedidaEnum.CAJA, label: "Caja" },
];

export const CreatePurchaseForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<CreatePurchaseFormState>({
    correlativo: "",
    proveedor: "",
    tipoCompra: "",
    tipoProductoCompra: "",
    tipoComprobante: "",
    fechaEmision: "",
    moneda: "",
    tipoCambio: "",
    serie: "",
    numero: "",
    fechaVencimiento: "",
  });

  // Estados para el detalle de productos
  const [detalleCompra, setDetalleCompra] = useState<DetalleCompraItem[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<
    ProductoType | ""
  >("");
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState<
    UnidadMedidaType | ""
  >("");
  const [cantidadIngresada, setCantidadIngresada] = useState<string>("");

  // Estados para datos de maintainers
  const [proveedores, setProveedores] = useState<Entidad[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);

  // Estado para tipo de cambio automático
  const [tipoCambioAutomatico, setTipoCambioAutomatico] = useState<string>("");

  // Obtener el correlativo al montar el componente
  useEffect(() => {
    const fetchCorrelativo = async () => {
      try {
        const response = await TransactionsService.getCorrelative("compra");
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

  // Cargar datos de maintainers al montar el componente
  useEffect(() => {
    const loadMaintainerData = async () => {
      try {
        const [productosData, almacenesData] = await Promise.all([
          MaintainersService.getProducts(),
          MaintainersService.getWarehouses(),
        ]);
        setProductos(productosData);
        setAlmacenes(almacenesData);
      } catch (error) {
        console.error("Error al cargar datos de maintainers:", error);
      }
    };

    loadMaintainerData();
  }, []);

  // Cargar proveedores al montar el componente
  useEffect(() => {
    const loadProveedores = async () => {
      try {
        const proveedoresData = await EntitiesService.getSuppliers();
        console.log("Proveedores cargados:", proveedoresData);
        setProveedores(proveedoresData);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };

    loadProveedores();
  }, []);

  // Obtener tipo de cambio automático cuando cambia la moneda
  useEffect(() => {
    const fetchTipoCambio = async () => {
      if (formState.moneda === MonedaEnum.DOLAR) {
        try {
          const tipoCambioData = await TransactionsService.getTypeExchange(
            formState.fechaEmision
          );
          const tipoCambioValue =
            tipoCambioData.data?.compra?.toString() || "3.75";
          setTipoCambioAutomatico(tipoCambioValue);
          setFormState((prev) => ({
            ...prev,
            tipoCambio: tipoCambioValue,
          }));
        } catch (error) {
          console.error("Error al obtener tipo de cambio:", error);
        }
      } else if (formState.moneda === MonedaEnum.SOL) {
        setTipoCambioAutomatico("1.00");
        setFormState((prev) => ({
          ...prev,
          tipoCambio: "1.00",
        }));
      }
    };

    fetchTipoCambio();
  }, [formState.moneda]);

  // Maneja los cambios en los inputs de texto
  const handleInputChange =
    (field: keyof CreatePurchaseFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // Maneja los cambios en los ComboBox
  const handleComboBoxChange =
    (field: keyof CreatePurchaseFormState) => (value: string | number) => {
      setFormState((prev) => ({
        ...prev,
        [field]: String(value),
      }));
    };

  // Maneja específicamente el cambio de tipo de comprobante
  const handleTipoComprobanteChange = (value: string | number) => {
    const tipoComprobanteValue = String(value) as TipoComprobanteType;

    setFormState((prev) => ({
      ...prev,
      tipoComprobante: tipoComprobanteValue,
      proveedor: "", // Limpiar proveedor al cambiar tipo de comprobante
    }));
  };

  // Maneja el cambio de producto seleccionado
  const handleProductoChange = (value: string | number) => {
    const productoValue = String(value) as ProductoType;
    setProductoSeleccionado(productoValue);

    // Buscar la unidad de medida correspondiente al producto seleccionado
    const productoOption = productosOptions.find(
      (option) => option.value === productoValue
    );
    if (productoOption) {
      setUnidadMedidaSeleccionada(productoOption.unidadMedida);
    }
  };

  // Maneja el cambio de unidad de medida seleccionada
  const handleUnidadMedidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnidadMedidaSeleccionada(e.target.value as UnidadMedidaType);
  };

  // Maneja el cambio de cantidad ingresada
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidadIngresada(e.target.value);
  };

  // Función para validar si todos los campos obligatorios del header están completos
  const areRequiredHeadersComplete = (): boolean => {
    const baseFieldsComplete = !!(
      formState.correlativo &&
      formState.proveedor &&
      formState.tipoCompra &&
      formState.tipoProductoCompra &&
      formState.tipoComprobante &&
      formState.fechaEmision &&
      formState.moneda &&
      formState.serie &&
      formState.numero &&
      formState.fechaVencimiento
    );

    // Si la moneda es dólar, también se requiere tipo de cambio
    if (formState.moneda === MonedaEnum.DOLAR) {
      return baseFieldsComplete && !!formState.tipoCambio;
    }

    // Si la moneda es sol, no se requiere tipo de cambio
    return baseFieldsComplete;
  };

  // Función para filtrar proveedores según el tipo de comprobante
  const getFilteredProviderOptions = () => {
    if (!formState.tipoComprobante) return [];

    let filteredProviders = proveedores;

    if (formState.tipoComprobante === TipoComprobanteEnum.FACTURA) {
      // Para facturas, solo proveedores jurídicos
      filteredProviders = proveedores.filter(
        (proveedor) => proveedor.tipo === "JURIDICA"
      );
    } else if (formState.tipoComprobante === TipoComprobanteEnum.BOLETA) {
      // Para boletas, solo proveedores naturales
      filteredProviders = proveedores.filter(
        (proveedor) => proveedor.tipo === "NATURAL"
      );
    }

    return filteredProviders.map((proveedor) => ({
      value: proveedor.id.toString(),
      label: `${proveedor.numeroDocumento} - ${
        proveedor.razonSocial ||
        proveedor.nombre +
          " " +
          proveedor.apellidoPaterno +
          " " +
          proveedor.apellidoMaterno
      }`,
    }));
  };

  // Función para obtener el ID del proveedor seleccionado
  const getSelectedProviderId = (): number | null => {
    if (!formState.proveedor) return null;
    return parseInt(formState.proveedor);
  };

  // Agrega un producto al detalle de la compra
  const handleAgregarProducto = () => {
    if (
      !productoSeleccionado ||
      !cantidadIngresada ||
      !unidadMedidaSeleccionada
    ) {
      console.warn("Faltan datos para agregar el producto");
      return;
    }

    const cantidad = parseFloat(cantidadIngresada);
    const precioUnitario = 100; // Precio fake
    const subtotal = cantidad * precioUnitario;
    const igv = subtotal * 0.18;
    const isv = 0; // ISV fake
    const total = subtotal + igv + isv;

    const nuevoProducto: DetalleCompraItem = {
      id: `${Date.now()}`,
      producto: productoSeleccionado,
      descripcion:
        productosOptions.find((p) => p.value === productoSeleccionado)?.label ||
        "",
      unidadMedida: unidadMedidaSeleccionada,
      cantidad,
      precioUnitario,
      subtotal,
      baseGravado: subtotal,
      igv,
      isv,
      total,
    };

    setDetalleCompra((prev) => [...prev, nuevoProducto]);

    // Limpiar campos después de agregar
    setProductoSeleccionado("");
    setUnidadMedidaSeleccionada("");
    setCantidadIngresada("");
  };

  // Elimina un producto del detalle de la compra
  const handleEliminarProducto = (record: DetalleCompraItem, index: number) => {
    setDetalleCompra((prev) => prev.filter((_, i) => i !== index));
    console.log("Producto eliminado:", record);
  };

  // Maneja el envío del formulario de compra
  const handleAceptarCompra = async () => {
    try {
      const detallesAPI = detalleCompra.map((item) => ({
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida.toUpperCase(),
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal,
        igv: item.igv,
        isc: item.isv, // Mapear isv a isc
        total: item.total,
        descripcion: item.descripcion,
      }));

      const compraData = {
        correlativo: formState.correlativo || "CORR-12345", // Usar valor del form o fake
        idPersona: getSelectedProviderId() || 1, // Usar ID del proveedor seleccionado o valor por defecto
        tipoOperacion: "compra", // Valor fijo
        tipoProductoCompra: formState.tipoProductoCompra || "mercaderia", // Tipo de producto/compra
        tipoComprobante: formState.tipoComprobante || "FACTURA", // Usar valor del form o fake
        fechaEmision: formState.fechaEmision || "2025-08-10", // Usar valor del form o fake
        moneda: formState.moneda === "sol" ? "PEN" : "USD", // Mapear moneda
        tipoCambio: formState.moneda === "sol" ? 1 : 3.75, // Tipo de cambio fake para dólares
        serie: formState.serie || "F001", // Usar valor del form o fake
        numero: formState.numero || "1234567890", // Usar valor del form o fake
        fechaVencimiento: formState.fechaVencimiento || "2025-08-20", // Usar valor del form o fake
        detalles: detallesAPI,
      };

      await TransactionsService.registerSale(compraData);

      navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}`);
    } catch (error) {
      console.error("Error al registrar la compra:", error);
    }
  };

  // Maneja el envío del formulario de compra y navegación para nueva compra
  const handleAceptarYNuevaCompra = async () => {
    try {
      const detallesAPI = detalleCompra.map((item) => ({
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida.toUpperCase(),
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal,
        igv: item.igv,
        isc: item.isv, // Mapear isv a isc
        total: item.total,
        descripcion: item.descripcion,
      }));

      const compraData = {
        correlativo: formState.correlativo || "CORR-12345", // Usar valor del form o fake
        idPersona: getSelectedProviderId() || 1, // Usar ID del proveedor seleccionado o valor por defecto
        tipoOperacion: "compra", // Valor fijo
        tipoProductoCompra: formState.tipoProductoCompra || "mercaderia", // Tipo de producto/compra
        tipoComprobante: formState.tipoComprobante || "FACTURA", // Usar valor del form o fake
        fechaEmision: formState.fechaEmision || "2025-08-10", // Usar valor del form o fake
        moneda: formState.moneda === "sol" ? "PEN" : "USD", // Mapear moneda
        tipoCambio: formState.moneda === "sol" ? 1 : 3.75, // Tipo de cambio fake para dólares
        serie: formState.serie || "F001", // Usar valor del form o fake
        numero: formState.numero || "1234567890", // Usar valor del form o fake
        fechaVencimiento: formState.fechaVencimiento || "2025-08-20", // Usar valor del form o fake
        detalles: detallesAPI,
      };

      await TransactionsService.registerSale(compraData);

      setFormState({
        correlativo: "",
        proveedor: "",
        tipoCompra: "",
        tipoProductoCompra: "",
        tipoComprobante: "",
        fechaEmision: "",
        moneda: "",
        tipoCambio: "",
        serie: "",
        numero: "",
        fechaVencimiento: "",
      });
      setDetalleCompra([]);
      setProductoSeleccionado("");
      setUnidadMedidaSeleccionada("");
      setCantidadIngresada("");

      navigate(
        `${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}${COMMON_ROUTES.REGISTER}`
      );
    } catch (error) {
      console.error("Error al registrar la compra:", error);
    }
  };

  // Configuración de la tabla
  const tableHeaders = [
    "Producto",
    "Descripción",
    "U.M.",
    "Cantidad",
    "P. Unitario",
    "Subtotal",
    "Base Gravado",
    "IGV",
    "ISV",
    "Total",
  ];

  const tableRows: TableRow[] = detalleCompra.map((item, index) => ({
    id: item.id,
    cells: [
      item.producto,
      item.descripcion,
      item.unidadMedida,
      item.cantidad.toString(),
      `S/ ${item.precioUnitario.toFixed(2)}`,
      `S/ ${item.subtotal.toFixed(2)}`,
      `S/ ${item.baseGravado.toFixed(2)}`,
      `S/ ${item.igv.toFixed(2)}`,
      `S/ ${item.isv.toFixed(2)}`,
      `S/ ${item.total.toFixed(2)}`,
    ],
    onDelete: () => handleEliminarProducto(item, index),
  }));

  const proveedoresOptionsFromAPI = getFilteredProviderOptions();

  return (
    <div className={styles.CreatePurchaseForm}>
      <Text size="xl" color="neutral-primary">
        Cabecera de compra
      </Text>

      <div className={styles.CreatePurchaseForm__Form}>
        {/** Fila 1: Correlativo y Proveedor */}
        <div className={styles.CreatePurchaseForm__FormRow}>
          <div
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--correlativo"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Correlativo
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={formState.correlativo}
              onChange={handleInputChange("correlativo")}
            />
          </div>
          <div
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--full"]}`}
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
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--proveedor"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Proveedor
            </Text>
            <ComboBox
              size="xs"
              options={proveedoresOptionsFromAPI}
              variant="createSale"
              name="proveedor"
              value={formState.proveedor}
              onChange={handleComboBoxChange("proveedor")}
              disabled={!formState.tipoComprobante}
            />
          </div>
        </div>

        {/** Fila 4: Fecha de emisión, Moneda y Tipo de cambio */}
        <div className={styles.CreatePurchaseForm__FormRow}>
          <div
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--third"]}`}
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
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--third"]}`}
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
              onChange={handleComboBoxChange("moneda")}
            />
          </div>

          {/* Solo mostrar tipo de cambio si la moneda es dólar */}
          {formState.moneda === MonedaEnum.DOLAR && (
            <div
              className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--third"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Tipo de cambio
              </Text>
              <Input
                size="xs"
                variant="createSale"
                value={formState.tipoCambio}
                onChange={handleInputChange("tipoCambio")}
                disabled={!formState.moneda}
              />
            </div>
          )}
          <div
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--half"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Condiciones de pago
            </Text>
            <ComboBox
              size="xs"
              options={tipoCompraOptions}
              variant="createSale"
              name="tipoCompra"
              value={formState.tipoCompra}
              onChange={handleComboBoxChange("tipoCompra")}
            />
          </div>
        </div>

        {/** Fila 5: Serie, Número y Fecha de vencimiento */}
        <div className={styles.CreatePurchaseForm__FormRow}>
          <div
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--half"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Tipo de compra
            </Text>
            <ComboBox
              size="xs"
              options={tipoProductoCompraOptions}
              variant="createSale"
              name="tipoProductoCompra"
              value={formState.tipoProductoCompra}
              onChange={handleComboBoxChange("tipoProductoCompra")}
            />
          </div>
          <div
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--third"]}`}
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
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--third"]}`}
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
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--third"]}`}
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

      {/** Detalle de compra - Solo se muestra si se ha seleccionado un tipo de producto/compra */}
      {formState.tipoProductoCompra && (
        <>
          <Text size="xl" color="neutral-primary">
            Detalle de compra
          </Text>

          <div className={styles.CreatePurchaseForm__AddItems}>
            <div
              className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--large"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Producto
              </Text>
              <ComboBox
                size="xs"
                options={productosOptions}
                variant="createSale"
                name="producto"
                value={productoSeleccionado}
                onChange={handleProductoChange}
              />
            </div>

            <div
              className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--medium"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Unidad de medida
              </Text>
              <Input
                size="xs"
                variant="createSale"
                value={unidadMedidaSeleccionada}
                onChange={handleUnidadMedidaChange}
                disabled={true}
              />
            </div>

            <div
              className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--small"]}`}
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
              />
            </div>

            <div
              className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--button"]}`}
            >
              <Button size="small" onClick={handleAgregarProducto}>
                Agregar
              </Button>
            </div>
          </div>

          {/** Table */}
          {detalleCompra.length > 0 && (
            <Table
              headers={tableHeaders}
              rows={tableRows}
              gridTemplate="2.5fr 1fr 1fr 1.2fr 1.2fr 1.2fr 1fr 1fr 1.2fr 1fr"
            />
          )}
        </>
      )}

      <Divider />

      <div className={styles.CreatePurchaseForm__Actions}>
        <Button
          onClick={handleAceptarCompra}
          disabled={!areRequiredHeadersComplete()}
        >
          Aceptar
        </Button>
        <Button
          onClick={handleAceptarYNuevaCompra}
          disabled={!areRequiredHeadersComplete()}
        >
          Aceptar y nueva compra
        </Button>
      </div>
    </div>
  );
};
