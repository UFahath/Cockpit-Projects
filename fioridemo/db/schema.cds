namespace stock.app;

using { cuid, managed } from '@sap/cds/common';

entity Warehouses : cuid, managed {
  name        : String;
  location    : String;
}

entity Products : cuid, managed {
  name        : String;
  minStock    : Integer;
}

entity StockMovements : cuid, managed {
  movementType : String; // IN / OUT
  quantity     : Integer;
  movementDate : Date;

  product      : Association to Products;
  warehouse    : Association to Warehouses;
}