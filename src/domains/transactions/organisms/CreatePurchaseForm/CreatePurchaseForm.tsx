import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePurchaseForm.module.scss";

import { Text, Input, ComboBox, Divider, Button } from "@/components";
import { Table, type TableRow } from "@/components/organisms/Table";
import { TransactionsService } from "../../services/TransactionsService";
import { EntitiesService } from "@/domains/entities/service";
import type { Entidad } from "@/domains/entities/service/types";
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, COMMON_ROUTES } from "@/router";

const TipoCompraEnum = {
  CONTADO: "contado",
  CREDITO: "credito",
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
type TipoComprobanteType =
  (typeof TipoComprobanteEnum)[keyof typeof TipoComprobanteEnum];
type TipoCambioType = (typeof TipoCambioEnum)[keyof typeof TipoCambioEnum];
type MonedaType = (typeof MonedaEnum)[keyof typeof MonedaEnum];
type ProductoType = (typeof ProductoEnum)[keyof typeof ProductoEnum];
type UnidadMedidaType =
  (typeof UnidadMedidaEnum)[keyof typeof UnidadMedidaEnum];

/**
 * Interfaz para los items del detalle de la compra
 */
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
  tipoComprobante: TipoComprobanteType | "";
  fechaEmision: string;
  moneda: MonedaType | "";
  tipoCambio: TipoCambioType | "";
  serie: string;
  numero: string;
  fechaVencimiento: string;
}


const tipoCompraOptions = [
  { value: TipoCompraEnum.CONTADO, label: "Contado" },
  { value: TipoCompraEnum.CREDITO, label: "Crédito" },
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

  // Obtener el correlativo al montar el componente
  useEffect(() => {
    const fetchCorrelativo = async () => {
      try {
        const response = await TransactionsService.getCorrelative('compra');
        setFormState(prev => ({
          ...prev,
          correlativo: response.correlativo
        }));
      } catch (error) {
        console.error('Error al obtener el correlativo:', error);
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

  // Maneja los cambios en los campos de texto
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

    // Agrega un producto al detalle de la venta
  const handleAgregarProducto = () => {
    if (
      !productoSeleccionado ||
      !unidadMedidaSeleccionada ||
      !cantidadIngresada
    ) {
      console.log("Todos los campos son requeridos");
      return;
    }

    const cantidad = parseFloat(cantidadIngresada);
    if (isNaN(cantidad) || cantidad <= 0) {
      console.log("La cantidad debe ser un número válido mayor a 0");
      return;
    }

    // Obtener la descripción del producto seleccionado
    const productoOption = productosOptions.find(
      (option) => option.value === productoSeleccionado
    );
    const descripcion = productoOption ? productoOption.label : "";

    // Precio unitario temporal (en una implementación real vendría de la API)
    const precioUnitario = 10.0;
    const subtotal = cantidad * precioUnitario;
    const baseGravado = subtotal / 1.18; // Base sin IGV
    const igv = subtotal - baseGravado; // IGV 18%
    const isv = 0; // ISV temporal
    const total = subtotal + isv;

    const nuevoItem: DetalleCompraItem = {
      id: `item-${Date.now()}`, // ID temporal
      producto: productoSeleccionado,
      descripcion,
      unidadMedida: unidadMedidaSeleccionada,
      cantidad,
      precioUnitario,
      subtotal,
      baseGravado,
      igv,
      isv,
      total,
    };

    setDetalleCompra((prev) => [...prev, nuevoItem])

    // Limpiar los campos después de agregar
    setProductoSeleccionado("");
    setUnidadMedidaSeleccionada("");
    setCantidadIngresada("");

    console.log("Producto agregado:", nuevoItem);
    console.log("Detalle actual:", [...detalleCompra, nuevoItem]);
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
        idPersona: 1, // Dato fake - en producción vendría del proveedor seleccionado
        tipoOperacion: "compra", // Valor fijo
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
        idPersona: 1, // Dato fake - en producción vendría del proveedor seleccionado
        tipoOperacion: "compra", // Valor fijo
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

      navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}${COMMON_ROUTES.REGISTER}`);
    } catch (error) {
      console.error("Error al registrar la compra:", error);
    }
  };

  const tableHeaders = [
    "Descripción",
    "Cantidad",
    "Unidad",
    "Precio Unitario",
    "Subtotal",
    "Base Gravado",
    "IGV",
    "ISV",
    "Total",
    "Acciones",
  ];

  // Transforma los datos de detalle de compra a formato TableRow
  const tableRows: TableRow[] = detalleCompra.map((item, index) => {
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
          onClick={() => handleEliminarProducto(item, index)}
        >
          Eliminar
        </Button>,
      ],
    };
  });

  // get providers
  const [providers, setProviders] = useState<Entidad[]>([]);
  useEffect(() => {
    EntitiesService.getSuppliers().then((data) => {setProviders(data);console.log(data)});
  }, []);

  // Crear opciones dinámicas para el ComboBox de proveedores
  const proveedoresOptionsFromAPI = providers.map(provider => ({
    value: provider.id.toString(),
    label: provider.numeroDocumento +' '+'-'+' '+ provider.nombreCompleto

  return (
    <div className={styles.CreatePurchaseForm}>
      <Text size="xl" color="neutral-primary">
        Cabecera de compra
      </Text>

      {/** Formulario */}
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
            />
          </div>
        </div>

        {/** Fila 2: Tipo de compra y Tipo de comprobante */}
        <div className={styles.CreatePurchaseForm__FormRow}>
          <div
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--half"]}`}
          >
            <Text size="xs" color="neutral-primary">
              Tipo de compra
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

          <div
            className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--half"]}`}
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
              onChange={handleComboBoxChange("tipoComprobante")}
            />
          </div>
        </div>

        {/** Fila 3: Fecha de emisión, Moneda y Tipo de cambio */}
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

          {/** Campo Tipo de cambio de la SUNAT */}
          {formState.moneda !== MonedaEnum.SOL && formState.moneda !== "" && (
            <div
              className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--third"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Tipo de cambio de la SUNAT
              </Text>
              <ComboBox
                size="xs"
                options={tipoCambioOptions}
                variant="createSale"
                name="tipoCambio"
                value={formState.tipoCambio}
                onChange={handleComboBoxChange("tipoCambio")}
              />
            </div>
          )}
        </div>

        {/** Fila 4: Serie, Número y Fecha de vencimiento */}
        <div className={styles.CreatePurchaseForm__FormRow}>
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

      <Text size="xl" color="neutral-primary">
        Detalle de compra
      </Text>

      <div className={styles.CreatePurchaseForm__AddItems}>
        <div
          className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--descripcion"]}`}
        >
          <Text size="xs" color="neutral-primary">
            Producto / Servicio
          </Text>
          <ComboBox
            options={productosOptions}
            variant="createSale"
            size="xs"
            name="producto"
            value={productoSeleccionado}
            onChange={handleProductoChange}
          />
        </div>

        <div
          className={`${styles.CreatePurchaseForm__FormField} ${styles["CreatePurchaseForm__FormField--small"]}`}
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

      <Divider />

      <div className={styles.CreatePurchaseForm__Actions}>
        <Button onClick={handleAceptarCompra}>Aceptar</Button>
        <Button onClick={handleAceptarYNuevaCompra}>
          Aceptar y nueva compra
        </Button>
      </div>
    </div>
  );
};
