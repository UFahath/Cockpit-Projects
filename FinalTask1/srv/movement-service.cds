using {wms.db as db} from '../db/wms_db';

using{InventoryService as inv} from './inventory-service';
@impl: './movement.js'
service MovementService{
   @restrict: [

  // READ access (all operational roles)
  {
    grant: ['READ'],
    to: ['Operator','Admin','Manager']
  },

  // CREATE movements (Operator)
  {
    grant: ['CREATE'],
    to: 'Operator'
  },

  // UPDATE allowed only for Admin corrections
  {
    grant: ['UPDATE','DELETE'],
    to: 'Admin'
  },

]
    @odata.draft.enabled
entity StockMovements as projection on db.StockMovement {

    key ID,
    movementType,
    product,
    quantity,
    movedBy,
    movementDate,
    fromWarehouse,
    toWarehouse,
    // fromWarehouse.warehouseName as fromWarehouseName,
    // toWarehouse.warehouseName as toWarehouseName,
    // fromWarehouse.warehouseCode as fromWarehouseCode,
    // toWarehouse.warehouseCode as toWarehouseCode,
    virtual totalMovementToday : Integer,
    virtual Movement:Integer,
    virtual currentStock:Integer,
    virtual previousStock:Integer,
    virtual impactType:String,
    virtual fromWarehouseDisplay:String,
    virtual goodsCriticality:Integer,
    virtual weatherCondition:String,
    virtual weatherConditionCriticality:Integer,
    virtual impact:String,
    virtual weatherIcon:String,
    virtual withoutSymbol:String,
    virtual whouseName:String,
    // case
    //     when movementType = 'GOODSRECEIPT'
    //     then toWarehouse.warehouseName || '(' || toWarehouse.warehouseCode || ')'

    //     when movementType = 'GOODSISSUES'
    //     then fromWarehouse.warehouseName || '(' || fromWarehouse.warehouseCode || ')'

    //     else 'Location Transferred'
    // end as fromWarehouseDisplay : String,

    // case
    //     when movementType = 'GOODSRECEIPT'
    //     then toWarehouse.warehouseName

    //     when movementType = 'GOODSISSUES'
    //     then fromWarehouse.warehouseName

    //     else fromWarehouse.warehouseName || ' → ' || toWarehouse.warehouseName
    // end as withoutSymbol : String,

    // case
    //     when movementType = 'GOODSRECEIPT'
    //     then toWarehouse.location

    //     when movementType = 'GOODSISSUES'
    //     then fromWarehouse.location

    //     else fromWarehouse.location || ' → ' || toWarehouse.location
    // end as whouseName : String,


    case
        when movementType = 'GOODSRECEIPT'
        then ' → ' || toWarehouse.location

        when movementType = 'GOODSISSUES'
        then fromWarehouse.location || ' → '

        else fromWarehouse.location || ' → ' || toWarehouse.location
    end as warehouseName : String,
//    cast(
//     case
//         when movementType = 'GOODSRECEIPT'
//         then 3
//         when movementType = 'GOODSISSUES'
//         then 1
//         else 2
//     end as Integer)as goodsCriticality 
// };
};

  entity Product as projection on inv.Products;
  entity Warehouse as projection on inv.Warehouses;
    action goodsReceipt(productID: String,
                        warehouseID: String,
                        qty: Integer)  returns StockMovements;

    action goodsIssue(productID: UUID,
                      warehouseID: UUID,
                      qty: Integer)    returns StockMovements;

    action stockTransfer(productID: UUID,
                         fromWarehouseID: UUID,
                         toWarehouseID: UUID,
                         qty: Integer) returns StockMovements;

action approveMovement(ID: UUID) returns StockMovements;
//   // @(requires: 'Movement.Approve');

action rejectMovement(ID: UUID) returns StockMovements;
//   @(requires: 'Movement.Approve');

  action alertCheck() returns String;
}