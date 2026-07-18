
using { wms.db as db } from '../db/wms_db';

@impl: './inventory.js'
service InventoryService{


  @restrict:[
    {
      grant:'READ',
      to:'Operator'
    },
    {
      grant:'READ',
      to:'Manager'
    },
    {
      grant:'*',
      to:'Admin'
    }
  ]
  entity Products    as projection on db.Product {
    ID, productCode, productName, productDescr,
    category, unitOfMeasure, minStockLevel, maxStockLevel
  };


  @restrict:[
    {
      grant:'READ',
      to:'Operator'
    },
    {
      grant:'*',
      to:'Admin'
    }
  ]
  entity Categories  as projection on db.Category{
    ID,
  categoryCode,
  categoryName,
  products ,
  };


  @restrict:[
    {
      grant:'READ',
      to:'Operator'
    },
    {
      grant:'*',
      to:'Admin'
    }
  ]
  entity Warehouses  as projection on db.Warehouse;


  //Stock per warehouse 
  
 @restrict:[
  {
    grant:'READ',
    to:['Operator','Manager','Admin']
  },
  {
    grant:['UPDATE'],
    to:'Admin'
  }
 ]
  entity StockLevels as projection on db.StockLevels {
    ID,
    binLocation,
    product,
    warehouse,
    currentStock,
    reservedStock,

    // availableStock: never negative
    case when currentStock - reservedStock < 0
         then 0
         else currentStock - reservedStock
    end as availableStock : Integer,

    // lowStock: 1 = critical, 
    //3 = ok  
    case when currentStock - reservedStock < product.minStockLevel
         then 1
         else 3
    end as lowStock : Integer,

    // reservedCriticality 
    case when reservedStock > currentStock * 0.7 then 1   
         when reservedStock > currentStock * 0.4 then 2   
         else 3                                          
    end as reservedCriticality : Integer
  };


  //Low-stock alerts view

  // entity StockAlerts as select from StockLevels {
  //   key product.ID            as productID,
  //       warehouse.warehouseName as warehouseName
  // } 


  // one row per product totals across all warehouses
  @restrict: [

  {
    grant: ['READ'],
    to: ['Operator']
  },

  {
    grant: ['READ'],
    to: ['Admin']
  }

]
  entity ProductStockOverview as select from Products as p
    left join StockLevels as s on s.product.ID = p.ID
  {
    key p.ID               as productID,
        p.productCode,
        p.productName,
        p.productDescr,
        p.category,
        p.unitOfMeasure,
        p.minStockLevel,
        p.maxStockLevel,
        
        stockLevels:Association to many StockLevels on stockLevels.product.ID = productID,
        //CurrentStock
        sum(s.currentStock)    as currentStock    : Integer,
        //Reserved Stock
        sum(s.reservedStock)   as reservedStock   : Integer,

        //Available Stock
        sum(s.currentStock)-sum(s.reservedStock)  as availableStock  : Integer,


            //Low Stock for overall Warehouse
          case
            when (sum(s.currentStock)-sum(s.reservedStock)) < p.minStockLevel
                 then 1
            else 3
          end        as isLowStock          : Integer,


        //Reserved stock criticality for KPI header display
          case
            when sum(s.reservedStock) > sum(s.currentStock) * 0.7
                 then 1
            when sum(s.reservedStock) > sum(s.currentStock) * 0.4
                 then 2
            else 3
          end                  as reservedCriticality : Integer,

        // isLowStock for the filter bar
        case when (sum(s.currentStock)-sum(s.reservedStock)<p.minStockLevel)
             then true
             else false
        end as isLowStockFilter : Boolean
  }
  group by
    p.ID, p.productCode, p.productName, p.productDescr,
    p.category, p.unitOfMeasure, p.minStockLevel, p.maxStockLevel;


  //Functions


  type LowStocks {
    product        : Association to db.Product;
    warehouse      : Association to db.Warehouse;
    currentStock   : Integer;
    reservedStock  : Integer;
    availableStock : Integer;
  }

  // Get available stock
  // @requires:'READ'
 action getAvailableStock(
     @Common.ValueList: {
                                 $Type         : 'Common.ValueListType',
                                 CollectionPath: 'Products',
                                 Parameters    : [
                                   {
                                     $Type            : 'Common.ValueListParameterInOut',
                                     ValueListProperty: 'ID'
                                   },
                                   {
                                     $Type            : 'Common.ValueListParameterDisplayOnly',
                                     ValueListProperty: 'productName',
                                   }
                                 ]
                               }
    productID: UUID,
  //  @(
  //   Common.ValueList:{
  //     $Type:'Common.ValueListType',
  //     CollectionPath:'Products',
  //     Parameters:[
  //       {
  //         $Type:'Common.ValueListParameterOut',
  //         // LocalDataProperty:productID,
  //         ValueListProperty:'ID'
  //       },
  //       {
  //         $Type:'Common.ValueListParameterDisplayOnly',
  //         ValueListProperty:'productName'
  //       }
  //     ],
  //     // @Common.ValueListWithFixedValues: false
  //   }
  // ),
   warehouseID: UUID) returns Integer;

  // Get all products below a  threshold
    // @requires:'READ'
  function getLowStockByThreshold(threshold: Integer) returns array of LowStocks;

  // Get all products below their own minStockLevel
    // @requires:'READ'
  function autoLowStockDetect() returns array of LowStocks;


}



//  UI Annotations

annotate InventoryService.ProductStockOverview with @(

  UI.HeaderInfo: {
    TypeName      : 'Product',
    TypeNamePlural: 'Products',
    TypeImageUrl  : 'sap-icon://add-product',
    Title         : { Value: productName }
  },

 
  UI.DataPoint #TotalStock: {
    Value                    : currentStock,
    Title                    : 'Total Stock',
    Criticality              : isLowStock,
    CriticalityRepresentation: #WithIcon
  },
  UI.DataPoint #Reserved: {
    Value      : reservedStock,
    Title      : 'Reserved Stock',
    Criticality: reservedCriticality
  },
  UI.DataPoint #Available: {
    Value      : availableStock,
    Title      : 'Available Stock',
    Criticality: isLowStock
  },

  UI.HeaderFacets: [
    { 
     $Type: 'UI.ReferenceFacet',
     Label: 'Total Stock',    
     Target: '@UI.DataPoint#TotalStock' 
     },
    {
       $Type: 'UI.ReferenceFacet', 
       Label: 'Reserved Stock', 
       Target: '@UI.DataPoint#Reserved'   
    },
    {
       $Type: 'UI.ReferenceFacet', 
       Label: 'Available Stock',
       Target: '@UI.DataPoint#Available'
    }
  ],


  UI.FieldGroup #ProductInfo: {
    $Type: 'UI.FieldGroupType',
    Data: [
      { 
        $Type: 'UI.DataField',
         Label: 'Product Code',   
         Value: productCode   
      },
      {
       $Type: 'UI.DataField', 
       Label: 'Product Name',  
       Value: productName  
       },
      {
       $Type: 'UI.DataField', 
       Label: 'Description',  
       Value: productDescr 
       },
      { 
      $Type: 'UI.DataField', 
      Label: 'Min Stock Level',
     Value: minStockLevel 
     },
      { 
        $Type: 'UI.DataField', 
        Label: 'Max Stock Level', 
        Value: maxStockLevel 
      }
    ]
  },

  UI.Facets: [
    { 
      $Type: 'UI.ReferenceFacet', 
      Label: 'Product Info',  
      Target: '@UI.FieldGroup#ProductInfo'          
    },
    { 
      $Type: 'UI.ReferenceFacet', 
      Label: 'Stock Levels',  
      Target: 'stockLevels/@UI.LineItem'          
          }
  ],

  UI.LineItem: [
    { $Type: 'UI.DataField',
      Label: 'Product Name',   
      Value: productName,      
      @HTML5.CssDefaults: { width: '150px' } 
    },
    { 
      $Type: 'UI.DataField', 
      Label: 'Category',       
      Value: category.categoryName,       
     @HTML5.CssDefaults: { width: '150px' } 
     },
    { 
      $Type: 'UI.DataField', 
      Label: 'Unit of Measure', 
      Value: unitOfMeasure_name,
      @HTML5.CssDefaults: { width: '150px' } 
    },
    { 
      $Type: 'UI.DataField', 
      Label: 'Min Stock',     
      Value: minStockLevel,    
      @HTML5.CssDefaults: { width: '150px' }
     },
    {
       $Type: 'UI.DataField', 
       Label: 'Max Stock',    
       Value: maxStockLevel,     
       @HTML5.CssDefaults: { width: '150px' }
    },
    { 
      $Type: 'UI.DataField', 
      Label: 'Current Stock',   
      Value: currentStock       
     },
    { 
      $Type: 'UI.DataField', 
      Label: 'Low Stock',       
      Value: isLowStock,
      Criticality: isLowStock
     },
    { 
      $Type: 'UI.DataFieldForAction', 
      Label: 'Get Available Stock',
      Action: 'InventoryService.EntityContainer/getAvailableStock' 
    }
  ],

  UI.SelectionFields: [ isLowStockFilter ]
);




// annotate InventoryService.StockAlerts with @(
//   UI.DataPoint #StockAlerts: {
//     Title      : 'Stock Alert',
//     Value      : warehouseName,
//     Criticality: 1   
//   }
// );




annotate InventoryService.StockLevels with @(
  UI.LineItem: [
    { 
      $Type: 'UI.DataField',
      Label: 'Warehouse',        
      Value: warehouse.warehouseName
     },
    { 
      $Type: 'UI.DataField', 
      Label: 'Current Stock',     
     Value: currentStock           
     },
    { 
      $Type: 'UI.DataField', 
      Label: 'Reserved Stock',    
     Value: reservedStock          
      },
    { 
      $Type: 'UI.DataField',
     Label: 'Available Stock',    
     Value: availableStock          
     },
    {
       $Type: 'UI.DataField', 
       Label: 'Warehouse Location', 
       Value: warehouse.location      
      }
  ],
  UI.SelectionFields: [ warehouse.location ]
);
