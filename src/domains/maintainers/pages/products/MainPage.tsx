import { useState, useEffect } from "react";
import { PageLayout } from "@/components";
import {
  Table,
  Button,
  CloseIcon,
  CheckIcon,
  StateTag,
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
  const [newProduct, setNewProduct] = useState({
    descripcion: "",
    unidadMedida: "",
    codigo: "",
    precio: "",
    stockMinimo: 0,
    categoriaId: 0,
  });

  const resetForm = () => {
    setNewProduct({
      descripcion: "",
      unidadMedida: "",
      codigo: "",
      precio: "",
      stockMinimo: 0,
      categoriaId: 0,
    });
  };

  const handleCreateProduct = async (data: {
    descripcion: string;
    unidadMedida: string;
    codigo: string;
    precio: string;
    stockMinimo: number;
    categoriaId: number;
  }) => {
    setLoading(true);
    try {
      const payload = { 
        ...data, 
        tipo: 'producto' as const, 
        estado: true 
      };
      const created = await ProductService.create(payload);
      setProducts((prev) => [created, ...prev]);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      setError("Error al crear el producto");
      console.error('Error al crear producto:', error);
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
    "Descripción", 
    "Unidad",
    "Categoría",
    "Precio",
    "Stock Mín.",
    "Estado",
    "Acciones",
  ];
  
  const rows = products.map((p) => ({
    id: p.id,
    cells: [
      p.codigo,
      p.descripcion,
      p.unidadMedida || "No especificado",
      p.categoria?.nombre || "No especificado",
      p.precio,
      p.stockMinimo,
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
        <Button
          onClick={() => {
            resetForm();
            setIsView(false);
            setIsOpen(true);
          }}
          size="large"
        >
          + Nuevo producto
        </Button>
      }
    >
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />

      <ProductModal
        isOpen={isOpen}
        onClose={handleModal}
        onSubmit={isView ? async () => {} : handleCreateProduct}
        initialValues={isView && selectedProduct ? {
          descripcion: selectedProduct.descripcion,
          unidadMedida: selectedProduct.unidadMedida,
          codigo: selectedProduct.codigo,
          precio: selectedProduct.precio,
          stockMinimo: selectedProduct.stockMinimo,
          categoriaId: selectedProduct.categoria?.id ?? 0,
        } : newProduct}
      />
    </PageLayout>
  );
};
