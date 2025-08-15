import { useState, useEffect } from "react";
import { PageLayout } from "@/components";
import {
  Table,
  Button,
  CloseIcon,
  CheckIcon,
  StateTag,
  AddDropdownButton,
} from "@/components";
import { ProductService } from "@/domains/maintainers/services";
import type { Product } from "@/domains/maintainers/types";
import { ProductModal } from "@/domains/maintainers/organisms";

export const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productType, setProductType] = useState<'producto' | 'servicio'>('producto');
  const [newProduct, setNewProduct] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    unidadMedida: "",
    categoriaId: 0,
  });

  const resetForm = () => {
    setNewProduct({
      codigo: "",
      nombre: "",
      descripcion: "",
      unidadMedida: "",
      categoriaId: 0,
    });
  };

  const handleCreateProduct = async (data: {
    nombre: string;
    descripcion: string;
    unidadMedida: string;
    categoriaId: number;
  }) => {
    setLoading(true);
    try {
      const payload = { 
        ...data, 
        tipo: productType, 
        estado: true 
      };
      const created = await ProductService.create(payload);
      setProducts((prev) => [created, ...prev]);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      setError(`Error al crear el ${productType}`);
      console.error(`Error al crear ${productType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleStateProduct = async (id: number, currentState: boolean) => {
    setLoading(true);
    try {
      await ProductService.update(id, { estado: !currentState });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, estado: !currentState } : p
        )
      );
    } catch (error) {
      setError("Error al cambiar estado del producto");
      console.error('Error al cambiar estado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const fetchProducts = () => {
    ProductService.getAll().then((res: Product[]) => {
      setProducts(res);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const headers = [
    "Código",
    "Nombre",
    "Descripción", 
    "Unidad",
    "Categoría",
    "Estado",
    "Acciones",
  ];
  
  const rows = products.map((p) => ({
    id: p.id,
    cells: [
      p.codigo,
      p.nombre,
      p.descripcion,
      p.unidadMedida || "No especificado",
      p.categoria?.nombre || "No especificado",
      <StateTag state={p.estado} />,
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          size="tableItemSize"
          variant="tableItemStyle"
          onClick={() => {
            setSelectedProduct(p);
            setIsView(true);
            setIsOpen(true);
          }}
        >
          Ver detalles
        </Button>
        <Button
          size="tableItemSize"
          variant="tableItemStyle"
          onClick={() => {
            handleStateProduct(p.id, p.estado);
          }}
        >
          {p.estado ? <CloseIcon /> : <CheckIcon />}
        </Button>
      </div>,
    ],
  }));
  
  const gridTemplate = "1fr 2fr 1fr 1.5fr 1fr 1fr 1fr 2fr";

  return (
    <PageLayout
      title="Productos"
      subtitle="Listado de productos registrados"
      header={
        <AddDropdownButton
          options={[
            {
              label: "Nuevo producto",
              onClick: () => {
                setProductType('producto');
                resetForm();
                setIsView(false);
                setIsOpen(true);
              },
            },
            {
              label: "Nuevo servicio",
              onClick: () => {
                setProductType('servicio');
                resetForm();
                setIsView(false);
                setIsOpen(true);
              },
            },
          ]}
        />
      }
    >
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />

      <ProductModal
        isOpen={isOpen}
        onClose={handleModal}
        onSubmit={isView ? async () => {} : handleCreateProduct}
        title={isView ? "Detalles del producto" : `Creación de nuevo ${productType}`}
        description={isView ? "Información del producto seleccionado." : `Ingresa los siguientes datos para registrar un ${productType}.`}
        submitLabel={isView ? "Cerrar" : "Guardar"}
        isService={productType === 'servicio'}
        initialValues={isView && selectedProduct ? {
          nombre: selectedProduct.nombre,
          descripcion: selectedProduct.descripcion,
          unidadMedida: selectedProduct.unidadMedida,
          categoriaId: selectedProduct.categoria?.id ?? 0,
        } : newProduct}
      />
    </PageLayout>
  );
};
