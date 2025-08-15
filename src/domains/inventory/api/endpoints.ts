export const INVENTORY_ENDPOINTS={
    GET_INVENTORY: '/inventario',
    GET_INVENTORY_BY_WAREHOUSE_AND_PRODUCT: '/api/inventario/almacen/:idAlmacen/producto/:idProducto',
    GET_INVENTORY_BY_WAREHOUSE: '/inventario/almacen/:idAlmacen'
}as const;
