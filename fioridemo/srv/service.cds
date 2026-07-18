using { stock.app as db } from '../db/schema';

service StockService {


  @restrict:[
    {
        grant:'READ',
        to:'Viewer'
    },
    {
        grant:'CREATE',
        to:'Admin'
    }
  ]
  entity StockMovements as projection on db.StockMovements;


  
  entity Products as projection on db.Products;


  entity Warehouses as projection on db.Warehouses;


  
  entity LowStockMovements as projection on db.StockMovements;




}