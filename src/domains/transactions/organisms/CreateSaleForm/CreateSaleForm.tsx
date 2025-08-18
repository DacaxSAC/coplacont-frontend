import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateSaleForm.module.scss";

import {
  Text,
  Input,
  ComboBox,
  Divider,
  Button,
  CloseIcon,
  Loader,
} from "@/components";
import { Table, type TableRow } from "@/components/organisms/Table";
import { TransactionsService } from "../../services/TransactionsService";
import { EntitiesService } from "@/domains/maintainers/services/entitiesService";
import {
  ProductService,
  WarehouseService,
} from "@/domains/maintainers/services";
import { InventoryService } from "@/domains/inventory/services/InventoryService";
import type { Product, Warehouse } from "@/domains/maintainers/types";
import type { Entidad } from "@/domains/maintainers/services/entitiesService";
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, COMMON_ROUTES } from "@/router";
import { TipoComprobanteEnum, MonedaEnum } from "./enums";
import type {
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
  const [isLoading, setIsLoading] = useState(false);

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
  console.log(productoSeleccionado);
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState<
    UnidadMedidaType | ""
  >("");
  const [cantidadIngresada, setCantidadIngresada] = useState<string>("");
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [precioTotalIngresado, setPrecioTotalIngresado] = useState<string>("");

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
      cliente: "",
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
   * Valida si todas las cabeceras obligatorias están completas y hay productos en el detalle
   * @returns {boolean} true si todas las cabeceras obligatorias están completas y hay al menos un producto en el detalle
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
      detalleVenta.length > 0
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

  /**
   * Maneja el cambio de cantidad y recalcula precios automáticamente
   */
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaCantidad = e.target.value;
    setCantidadIngresada(nuevaCantidad);

    const cantidad = parseFloat(nuevaCantidad);
    if (!isNaN(cantidad) && cantidad > 0) {
      // Si hay precio unitario, recalcular precio total
      if (precioUnitario > 0) {
        const nuevoTotal = cantidad * precioUnitario;
        setPrecioTotalIngresado(nuevoTotal.toString());
      }
      // Si hay precio total, recalcular precio unitario
      else if (precioTotalIngresado && parseFloat(precioTotalIngresado) > 0) {
        const nuevoPrecioUnitario = parseFloat(precioTotalIngresado) / cantidad;
        setPrecioUnitario(nuevoPrecioUnitario);
      }
    }
  };

  /**
   * Maneja el cambio de precio unitario y calcula automáticamente el precio total
   */
  const handlePrecioUnitarioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nuevoPrecioUnitario = e.target.value;
    const precioNumerico = parseFloat(nuevoPrecioUnitario);

    if (!isNaN(precioNumerico) && precioNumerico >= 0) {
      setPrecioUnitario(precioNumerico);

      // Calcular precio total automáticamente si hay cantidad
      const cantidad = parseFloat(cantidadIngresada);
      if (!isNaN(cantidad) && cantidad > 0) {
        const nuevoTotal = cantidad * precioNumerico;
        setPrecioTotalIngresado(nuevoTotal.toString());
      } else {
        setPrecioTotalIngresado("");
      }
    } else {
      setPrecioUnitario(0);
      setPrecioTotalIngresado("");
    }
  };

  /**
   * Maneja el cambio de precio total y calcula automáticamente el precio unitario
   */
  const handlePrecioTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoPrecioTotal = e.target.value;
    setPrecioTotalIngresado(nuevoPrecioTotal);

    const totalNumerico = parseFloat(nuevoPrecioTotal);
    const cantidad = parseFloat(cantidadIngresada);

    if (
      !isNaN(totalNumerico) &&
      totalNumerico >= 0 &&
      !isNaN(cantidad) &&
      cantidad > 0
    ) {
      const nuevoPrecioUnitario = totalNumerico / cantidad;
      setPrecioUnitario(nuevoPrecioUnitario);
    } else if (!nuevoPrecioTotal) {
      setPrecioUnitario(0);
    }
  };

  // Función para agregar producto al detalle
  const handleAgregarProducto = () => {
    // Validaciones
    if (!productoSeleccionado) {
      alert("Debe seleccionar un producto");
      return;
    }
    if (!cantidadIngresada || parseFloat(cantidadIngresada) <= 0) {
      alert("Debe ingresar una cantidad válida");
      return;
    }
    if (!unidadMedidaSeleccionada) {
      alert("Debe seleccionar una unidad de medida");
      return;
    }
    if (precioUnitario <= 0) {
      alert("El precio unitario debe ser mayor a 0");
      return;
    }

    // Buscar el producto seleccionado en el inventario
    const productoInventario = inventarioProductos.find(
      (item) => item.producto.id.toString() === productoSeleccionado
    );

    if (!productoInventario) {
      alert("Producto no encontrado en el inventario");
      return;
    }

    const cantidad = parseFloat(cantidadIngresada);

    // Verificar si el producto ya existe en el detalle
    const productoExistente = detalleVenta.find(
      (item) => item.producto === productoSeleccionado
    );

    if (productoExistente) {
      // Si el producto ya existe, actualizar la cantidad y recalcular totales
      setDetalleVenta((prev) =>
        prev.map((item) => {
          if (item.producto === productoSeleccionado) {
            const nuevaCantidad = item.cantidad + cantidad;
            const nuevoSubtotal = nuevaCantidad * precioUnitario;
            const nuevaBaseGravada = nuevoSubtotal / 1.18;
            const nuevoIgv = nuevoSubtotal - nuevaBaseGravada;
            const nuevoTotal = nuevoSubtotal;

            return {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: nuevoSubtotal,
              baseGravado: nuevaBaseGravada,
              igv: nuevoIgv,
              total: nuevoTotal,
            };
          }
          return item;
        })
      );
    } else {
      // Si el producto no existe, agregarlo como nuevo
      const subtotal = cantidad * precioUnitario;
      const baseGravado = subtotal / 1.18; // Base gravada (sin IGV)
      const igv = subtotal - baseGravado; // IGV (18%)
      const isv = 0; // ISV por defecto 0
      const total = subtotal;

      const nuevoItem: DetalleVentaItem = {
        id: Date.now().toString(), // ID único temporal
        producto: productoSeleccionado,
        descripcion: productoInventario.producto.nombre,
        unidadMedida: unidadMedidaSeleccionada,
        cantidad,
        precioUnitario,
        subtotal,
        baseGravado,
        igv,
        isv,
        total,
        idInventario: productoInventario.id,
      };

      // Agregar al detalle
      setDetalleVenta((prev) => [...prev, nuevoItem]);
    }

    // Limpiar campos
    setProductoSeleccionado("");
    setUnidadMedidaSeleccionada("");
    setCantidadIngresada("");
    setPrecioUnitario(0);
    setPrecioTotalIngresado("");
  };

  const handleAceptarVenta = async () => {
    setIsLoading(true);
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
        idInventario: item.idInventario,
      }));

      const ventaData = {
        correlativo: formState.correlativo,
        idPersona: getSelectedClientId() || 1,
        tipoOperacion: "venta",
        tipoProductoVenta: formState.tipoProductoVenta || "mercaderia", 
        tipoComprobante: formState.tipoComprobante || "FACTURA",
        fechaEmision: formState.fechaEmision || "2025-08-10",
        moneda: formState.moneda === "sol" ? "PEN" : "USD",
        tipoCambio: formState.moneda === "sol" ? 1 : parseFloat(formState.tipoCambio),
        serie: formState.serie || "F001", // Usar valor del form o fake
        numero: formState.numero || "1234567890", // Usar valor del form o fake
        fechaVencimiento: formState.fechaVencimiento || "2025-08-20", // Usar valor del form o fake
        detalles: detallesAPI,
      };

      await TransactionsService.registerSale(ventaData);

      navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}`);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAceptarYNuevaVenta = async () => {
    setIsLoading(true);
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
        idInventario: item.idInventario,
      }));

      const ventaData = {
        correlativo: formState.correlativo || "CORR-12345", // Usar valor del form o fake
        idPersona: getSelectedClientId() || 1, // Usar ID del cliente seleccionado o valor por defecto
        tipoOperacion: "venta", // Valor fijo
        tipoProductoVenta: formState.tipoProductoVenta || "mercaderia", // Tipo de producto/venta
        tipoComprobante: formState.tipoComprobante || "FACTURA", // Usar valor del form o fake
        fechaEmision: formState.fechaEmision || "2025-08-10", // Usar valor del form o fake
        moneda: formState.moneda === "sol" ? "PEN" : "USD", // Mapear moneda
        tipoCambio: formState.moneda === "sol" ? 1 : parseFloat(formState.tipoCambio), // Tipo de cambio fake para dólares
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
    } finally {
      setIsLoading(false);
    }
  };

  const tableHeaders = [
    "Descripción",
    "Cantidad",
    "U.M.",
    "P. Unitario",
    "Subtotal",
    "Base Gravado",
    "IGV",
    "ISV",
    "Total",
    "Acciones",
  ];

  const handleEliminarProducto = (index: number) => {
    const productoEliminado = detalleVenta[index];
    setDetalleVenta((prev) => prev.filter((_, i) => i !== index));
    
    // Si el producto eliminado es el que está actualmente seleccionado, limpiar la selección
    if (productoEliminado && productoSeleccionado === productoEliminado.producto) {
      setProductoSeleccionado("");
      setUnidadMedidaSeleccionada("");
      setCantidadIngresada("");
      setPrecioUnitario(0);
      setPrecioTotalIngresado("");
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
          size="tableItemSize"
          variant="tableItemStyle"
          onClick={() => handleEliminarProducto(index)}
        >
          <CloseIcon />
        </Button>,
      ],
    };
  });

  // CLIENTES
  const [clients, setClients] = useState<Entidad[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  console.log(products);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  console.log(warehouses);
  const [inventarioProductos, setInventarioProductos] = useState<any[]>([]);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState<string>("");

  useEffect(() => {
    EntitiesService.getClients().then((data) => {
      setClients(data);
    });
    ProductService.getAll().then((data) => {
      setProducts(data);
    });
    WarehouseService.getAll().then((data) => {
      setWarehouses(data);
    });
  }, []);

  // Cargar productos del inventario cuando se selecciona un almacén
  useEffect(() => {
    const loadInventarioProductos = async () => {
      if (almacenSeleccionado) {
        try {
          const data = await InventoryService.getInventoryByWarehouse(
            Number(almacenSeleccionado)
          );
          setInventarioProductos(data);
        } catch (error) {
          console.error("Error al cargar productos del inventario:", error);
        }
      } else {
        setInventarioProductos([]);
      }
    };

    loadInventarioProductos();
  }, [almacenSeleccionado]);

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

  const getAlmacenesOptions = () => {
    return warehouses.map((warehouse) => ({
      value: warehouse.id.toString(),
      label: warehouse.nombre,
    }));
  };

  const getProductosInventarioOptions = () => {
    const productosEnDetalle = detalleVenta.map(item => item.producto);
    return inventarioProductos
      .filter(item => !productosEnDetalle.includes(item.producto.id.toString()))
      .map((item) => ({
        value: item.producto.id.toString(),
        label: `${item.producto.nombre} (Stock: ${item.stockActual})`,
      }));
  };

  const handleAlmacenChange = (value: string | number) => {
    const stringValue = String(value);
    setAlmacenSeleccionado(stringValue);
    // Limpiar campos relacionados cuando cambia el almacén
    setProductoSeleccionado("");
    setUnidadMedidaSeleccionada("");
    setPrecioUnitario(0);
  };

  const handleProductoInventarioChange = (value: string | number) => {
    const stringValue = String(value);
    setProductoSeleccionado(stringValue as ProductoType);
    const selectedItem = inventarioProductos.find(
      (item) => item.producto.id.toString() === stringValue
    );
    if (selectedItem) {
      // Establecer unidad de medida del producto
      setUnidadMedidaSeleccionada(selectedItem.producto.unidadMedida || "");
      debugger;
      // Establecer precio unitario del producto
      setPrecioUnitario(selectedItem.producto.precioVenta || 0);
    } else {
      // Limpiar campos si no se encuentra el producto
      setUnidadMedidaSeleccionada("");
      setPrecioUnitario(0);
    }
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
              Fecha de vencimiento (opcional)
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
                options={getAlmacenesOptions()}
                variant="createSale"
                name="almacen"
                value={almacenSeleccionado}
                onChange={handleAlmacenChange}
                disabled={!isDetalleVentaEnabled()}
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
                options={getProductosInventarioOptions()}
                variant="createSale"
                name="producto"
                value={productoSeleccionado}
                onChange={handleProductoInventarioChange}
                disabled={!isDetalleVentaEnabled() || !almacenSeleccionado}
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
                value={unidadMedidaSeleccionada}
                disabled={true}
              />
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
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--third"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Precio unitario
              </Text>
              <Input
                size="xs"
                type="number"
                variant="createSale"
                value={precioUnitario.toString()}
                onChange={handlePrecioUnitarioChange}
                disabled={!isDetalleVentaEnabled()}
              />
            </div>

            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--small"]}`}
            >
              <Text size="xs" color="neutral-primary">
                Precio Total
              </Text>
              <Input
                size="xs"
                type="number"
                variant="createSale"
                value={precioTotalIngresado}
                onChange={handlePrecioTotalChange}
                disabled={!isDetalleVentaEnabled()}
              />
            </div>

            <div
              className={`${styles.CreateSaleForm__FormField} ${styles["CreateSaleForm__FormField--button"]}`}
            >
              <Button
                size="small"
                onClick={handleAgregarProducto}
                disabled={!isDetalleVentaEnabled()}
              >
                Agregar
              </Button>
            </div>
          </div>

          {/** Table */}
          {detalleVenta.length > 0 && (
            <>
              <Table
                headers={tableHeaders}
                rows={tableRows}
                gridTemplate="2.5fr 1fr 1fr 1.2fr 1.2fr 1.2fr 1fr 1fr 1.2fr 1fr"
              />

              {/* Totales */}
              <div className={styles.CreateSaleForm__Totals}>
                <div className={styles.CreateSaleForm__TotalsRow}>
                  <Text size="xs" color="neutral-primary">
                    Subtotal:
                  </Text>
                  <Text size="xs" color="neutral-primary">
                    S/{" "}
                    {detalleVenta
                      .reduce((sum, item) => sum + item.subtotal, 0)
                      .toFixed(2)}
                  </Text>
                </div>
                <div className={styles.CreateSaleForm__TotalsRow}>
                  <Text size="xs" color="neutral-primary">
                    IGV:
                  </Text>
                  <Text size="xs" color="neutral-primary">
                    S/{" "}
                    {detalleVenta
                      .reduce((sum, item) => sum + item.igv, 0)
                      .toFixed(2)}
                  </Text>
                </div>
                <div className={styles.CreateSaleForm__TotalsRow}>
                  <Text size="xs" color="neutral-primary">
                    ISV:
                  </Text>
                  <Text size="xs" color="neutral-primary">
                    S/{" "}
                    {detalleVenta
                      .reduce((sum, item) => sum + item.isv, 0)
                      .toFixed(2)}
                  </Text>
                </div>
                <div
                  className={`${styles.CreateSaleForm__TotalsRow} ${styles["CreateSaleForm__TotalsRow--total"]}`}
                >
                  <Text size="sm" color="neutral-primary">
                    Total:
                  </Text>
                  <Text size="sm" color="neutral-primary">
                    S/{" "}
                    {detalleVenta
                      .reduce((sum, item) => sum + item.total, 0)
                      .toFixed(2)}
                  </Text>
                </div>
              </div>
            </>
          )}
          <Divider />
        </>
      )}

      {isLoading && <Loader text="Procesando venta..." />}

      <div className={styles.CreateSaleForm__Actions}>
        <Button
          onClick={handleAceptarVenta}
          disabled={!areRequiredHeadersComplete() || isLoading}
        >
          Aceptar
        </Button>
        <Button
          onClick={handleAceptarYNuevaVenta}
          disabled={!areRequiredHeadersComplete() || isLoading}
        >
          Aceptar y nueva venta
        </Button>
      </div>
    </div>
  );
};
