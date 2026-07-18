using { wms.db as db } from '../db/service';

service inventoryService{
    entity Product as projection on db.Product;
    entity Category as projection on db.Category;
    entity Warehouse  as projection on db.Warehouse;
    entity StockLevels as projection on db.StockLevels;

    function getAvailableStock(productID: UUID, warehouseID: UUID) returns Integer;
    function getLowStockByThreshold(threshold: Integer) returns String;
    function getLowStockAlerts(threshold);
}
