namespace wms.db;
using {sap.common.CodeList,managed,cuid} from '@sap/cds/common';


entity MovementType:CodeList{
 @assert.range:['GOODSRECEIPT','GOODSISSUES','TRANSFER']
 key type:String enum{
  GOODSRECEIPT;
  GOODSISSUES;
  TRANSFER;
 }
}
//  (UUID, ProductCode, Name, Description, Category assoc, UnitOfMeasure, MinStockLevel, MaxStockLevel) 
//Product


//Unit of Measures(Kg,pcs etc)

entity Unit:CodeList{
  key name:String;
};

entity Product : managed {
  key ID           : UUID;
  productCode      : String(10);
  productName      : String(100) @mandatory;
  productDescr     : String(255);

  category         : Association to one Category;
  unitOfMeasure    : Association to Unit ;

  minStockLevel    : Integer;
  maxStockLevel    : Integer;

  warehouses     : Association to many StockLevels
                     on warehouses.product = $self;
};

entity Category:managed {
  key ID           : UUID;
  categoryCode     : String(5);
  categoryName     : String(30);

  products : Composition of many Product
             on products.category = $self;
};

entity Warehouse:managed {
  key ID           : UUID;
  warehouseCode    : String(4);
  warehouseName    : String(30);
  location         : String(30);
  capacity         : Integer;
  products         :Association to many StockLevels on products.warehouse = $self;
};


entity StockLevels{
  key ID           : UUID;
  binLocation      : String;

  product          : Association to Product;
  warehouse        : Association to Warehouse;
  
  currentStock     : Integer;
  reservedStock :Integer;

};
// annotate StockLevels with @assert.unique.stock:[binLocation,product,warehouse];

entity Users : managed {
  key ID     : UUID;
  userID     : String;
  name       : String;
  email      : String;
};


entity StockMovement : managed {
  key ID : UUID;

  movementType  : Association to MovementType;
  product       : Association to Product;

  fromWarehouse : Association to Warehouse;
  toWarehouse   : Association to  Warehouse;

  quantity      : Integer @assert.range:[1,999];
  movedBy       : Association to Users;
  movementDate  : Timestamp;
  status : String enum {
  PENDING;
  APPROVED;
  REJECTED;
} default 'PENDING';
};






