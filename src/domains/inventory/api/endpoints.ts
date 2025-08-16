export const INVENTORY_ENDPOINTS={
    GET_INVENTORY: '/inventario',
    GET_INVENTORY_BY_WAREHOUSE_AND_PRODUCT: '/inventario/almacen/:idAlmacen/producto/:idProducto',
    GET_INVENTORY_BY_WAREHOUSE: '/inventario/almacen/:idAlmacen',
    CREATE_INVENTORY: '/inventario',
    GET_KARDEX_MOVEMENTS: '/kardex'
}as const;
