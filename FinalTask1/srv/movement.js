const cds = require('@sap/cds');
const { SELECT, INSERT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const { getWeather } = require('./external_restapi/weatherapi');
const {writeID}=require('./pageIdOfficer');
const { notify } = require('./external_restapi/alertNotfication');
const { data } = require('@sap/cds/lib/dbs/cds-deploy');

module.exports = async function (srv) {
   const { StockMovements,Warehouse } = srv.entities;
   const StockLevels = 'InventoryService.StockLevels';
   const Products = 'InventoryService.Products'
   const Warehouses = 'InventoryService.Warehouses';



   // 1) AgoodsReceipt(productID, warehouseID, qty)
   srv.on('goodsReceipt', async function (req) {
      const { productID, warehouseID, qty } = req.data;
      // const tx = cds.tx(req);
      if (!productID) {
         return req.error(400, "Product ID is Required");
      }
      if (!warehouseID) {
         return req.error(400, "warehouse ID is Required");
      }
      if (!Number.isFinite(qty) || Number(qty) <= 0) {
         return req.error(400, "Enter Valid Quantity");
      }
      const isWarehouseExist = await SELECT.one.from(Warehouses).where({ ID: warehouseID });
      if (!isWarehouseExist) return req.error(404, "There is No Such Ware House Exist");


      const isProductExist = await SELECT.one.from(Products).where({ ID: productID });
      if (!isProductExist) return req.error(404, "There is No Such Product Exist");

      let newStockMovementId = cds.utils.uuid();
      const stockMovementData = {
         ID: newStockMovementId,
         movementType_type: 'GOODSRECEIPT',
         product_ID: productID,
         fromWarehouse_ID: null,
         toWarehouse_ID: warehouseID,
         quantity: Number(qty),
         movedBy_ID: 'u2',
         movementDate: new Date(Date.now())
      };
      console.log("StockMovment in goodsreceipt...next before handler")
      await srv.create(StockMovements).entries(stockMovementData);
      return req.info(204, 'Goods Receipt Generated')
   })


   //before StockMovement
   srv.before('CREATE', StockMovements, async function (req) {
      console.log("Stock Movment before handler ...final stop")
      const tx = cds.tx(req);

      const { product_ID, fromWarehouse_ID, toWarehouse_ID, quantity, movementType_type } = req.data;
      const warehouseID = movementType_type === 'GOODSRECEIPT' ? toWarehouse_ID : fromWarehouse_ID;
      if (movementType_type === 'GOODSRECEIPT') {
         const target = { product_ID, warehouse_ID: warehouseID };
         const targetStockLevel = await tx.run(SELECT.one.from(StockLevels).where(target));
         if (targetStockLevel) {
            await tx.run(UPDATE(StockLevels).set({ currentStock: targetStockLevel.currentStock + quantity }).where(target));
         } else {
            const existingBins = await tx.run(SELECT.from(StockLevels).columns('binLocation').where({ warehouse_ID: warehouseID }))
            const binLocation = generateBinLocation(existingBins);
            const newStockLevel = {
               ID: String(cds.utils.uuid()),
               binLocation,
               product_ID: product_ID,
               warehouse_ID: warehouseID,
               currentStock: quantity,
               reservedStock: 0
            }
            await tx.run(INSERT.into(StockLevels).entries(newStockLevel));
         }
         return;
      }

      if (movementType_type === 'GOODSISSUE') {
         const targetStockLevel = await tx.run(SELECT.one.from(StockLevels).where({ product_ID: product_ID, warehouse_ID: warehouseID }))
         const deduction = targetStockLevel.currentStock - quantity;
         await tx.run(UPDATE(StockLevels).set({ currentStock: deduction }).where({ product_ID: product_ID, warehouse_ID: warehouseID }));
         return;
      }

      if (movementType_type === 'TRANSFER') {
         const sourceWarehouse = await tx.run(SELECT.one.from(StockLevels).where({ product_ID: product_ID, warehouse_ID: fromWarehouse_ID }));
         if (!sourceWarehouse) {
            return req.error(404, 'Source Warehouse Not Found');
         }
         await tx.run(UPDATE(StockLevels).set({ currentStock: sourceWarehouse.currentStock - quantity }).where({ product_ID: product_ID, warehouse_ID: fromWarehouse_ID }));
         const desinationWarehouse = await tx.run(SELECT.one.from(StockLevels).where({ product_ID, warehouse_ID: toWarehouse_ID }));
         if (desinationWarehouse) {
            await tx.run(UPDATE(StockLevels).set({ currentStock: desinationWarehouse.currentStock + quantity }).where({ product_ID: product_ID, warehouse_ID: toWarehouse_ID }));
         } else {
            const existingBins = await tx.run(SELECT.from(StockLevels).columns('binLocation').where({ warehouse_ID: toWarehouse_ID }))
            const binLocation = generateBinLocation(existingBins);
            const newStockLevel = {
               ID: cds.utils.uuid(),
               binLocation,
               product_ID,
               warehouse_ID: toWarehouse_ID,
               currentStock: quantity,
               reservedStock: 0
            }
            await tx.run(INSERT.into(StockLevels).entries(newStockLevel));
         }

      }
   })
   //2)  action goodsIssue(
   //      productID   : UUID,
   //      warehouseID : UUID,
   //      qty         : Integer
   //  ) returns 'StockMovements';

   //before goodsIssue
   srv.before('goodsIssue', async function (req) {
      console.log("goodIssue before")
      const data = req.data;
      if (!data.productID) {
         return req.error(400, "ProductID needed")
      }
      if (!data.warehouseID) {
         return req.error(400, "WarehouseID needed")
      }
      if (!Number.isFinite(data.qty) || Number(data.qty) < 0) {
         return req.error(400, "Invalid Qty")
      }
      let conditions = {
         product_ID: data.productID,
         warehouse_ID: data.warehouseID
      }
      const targetGoods = await SELECT.one.from(StockLevels).columns('currentStock', 'reservedStock').where(conditions);
      if (!targetGoods) {
         return req.error(404, "No Target Goods Exist")
      }
      const availableStock = targetGoods.currentStock - targetGoods.reservedStock;
      // console.log(availableStock)
      //   console.log(targetGoods)
      if (availableStock < data.qty) {
         return req.error(400, `Insufficient stock. Available: ${availableStock}`)
      }

      console.log("goodIssue after")
   });


   //Goods issue on
   srv.on('goodsIssue', async function (req) {
      const { productID, warehouseID, qty } = req.data;
      // console.log(qty)
      console.log("goodsIssue on")
      //   ID,movementType_type,product_ID,fromWarehouse_ID,toWarehouse_ID,quantity,movedBy_ID,movementDate
      const ID = String(cds.utils.uuid());

      const targetGoods = await SELECT.one.from(StockLevels).columns('warehouse_ID').where({ product_ID: productID, warehouse_ID: warehouseID });
      //  console.log(targetGoods)
      const insertData = {
         ID,
         movementType_type: 'GOODSISSUES',
         product_ID: productID,
         fromWarehouse_ID: targetGoods.warehouse_ID,
         toWarehouse_ID: null,
         quantity: qty,
         movedBy_ID: 'u2',
         movementDate: new Date()
      }
      await srv.create(StockMovements).entries(insertData);
      return await SELECT.one.from(StockMovements).where({ ID });
   });


   //onStockTransfer
   srv.on('stockTransfer', async function (req) {
      const { productID, fromWarehouseID, toWarehouseID, qty } = req.data;

      const ID = String(cds.utils.uuid());

      const data = {
         ID,
         movementType_type: 'TRANSFER',
         product_ID: productID,
         fromWarehouse_ID: fromWarehouseID,
         toWarehouse_ID: toWarehouseID,
         quantity: qty,
         movedBy: 'u2',
         movementDate: new Date()
      };

      await srv.create(StockMovements).entries(data);
      return await SELECT.one.from(StockMovements).where({ ID });
   });


   // srv.on("*", "*", async function (req) {
   //    console.log("EVENT:", req.event);

   //    if (req.target) {
   //       console.log("TARGET:", req.target.name);
   //    } else {
   //       console.log("NO TARGET (draft request)");
   //    }
   // });

   // {
   //   ID: '11f1c1c1-0001-0001-0001-000000000001',
   //   movementType_type: 'GOODSRECEIPT',
   //   product_ID: 'f1f1c1c1-0001-0001-0001-000000000001',
   //   quantity: 10,
   //   movedBy_ID: 'u1f1c1c1-0001-0001-0001-000000000001',
   //   movementDate: '2026-05-17T10:00:00.000Z',
   //   fromWarehouse_ID: null,
   //   toWarehouse_ID: '21f1c1c1-0001-0001-0001-000000000001',
   //   fromWarehouseDisplay: 'Main Warehouse(WH01)',
   //   withoutSymbol: 'Main Warehouse',
   //   whouseName: 'Chennai',
   //   warehouseName: ' → Chennai',
   //   goodsCriticality: 3
   // }



   // {
   //   ID: 'c1f1c1c1-0005-0005-0005-000000000005',
   //   binLocation: 'C1',
   //   product_ID: 'f1f1c1c1-0005-0005-0005-000000000005',
   //   warehouse_ID: '21f1c1c1-0005-0005-0005-000000000005',
   //   currentStock: 40,
   //   reservedStock: 8
   // }
   //stockMovement after
   srv.after('READ', StockMovements, async (result, req) => {

      // console.log(data)
      // console.log(result)
      // console.log(req.params)
      let requiredFieldsForStockLevels;
      if (req.params && req.params.length > 0) {
         console.log("Object Page");
         let ID = req.params[0]?.ID;


         // console.log("----------GET Individual StockMovement Record ID----------------")
         let targetStockMovement = await SELECT.one.from(StockMovements).where({ ID });
         let { product_ID, movementType_type, toWarehouse_ID, fromWarehouse_ID } = targetStockMovement;
         let warehouse_ID = movementType_type === 'GOODSRECEIPT' ? toWarehouse_ID : fromWarehouse_ID;
         requiredFieldsForStockLevels = await SELECT.one.from(StockLevels).where({ product_ID, warehouse_ID });
         let { warehouseName, warehouseCode, location } = await SELECT.one.from(Warehouses).where({ ID: warehouse_ID });

         console.log("WarehouseName::",warehouseName);
         console.log("WarehouseCode::",warehouseCode);
         console.log("location",location)
         let weatherData = await getWeather(location);
         let iconUrl = "https:" + weatherData.icon;

         //Today Date
         let today = new Date().toDateString();
         let allMovements = await SELECT.from('StockMovement');

         //Today Date Matching records finding
         let todayMovements = allMovements.filter((m) => {
            let movementDate = new Date(m.movementDate).toDateString();
            return movementDate === today;
         })


         //Movement Today Created
         let totalToday = todayMovements?.length;

         console.log("--------------");
   
         result = result.map((m) => {
            m['totalMovementToday'] = totalToday;
            m.currentStock = requiredFieldsForStockLevels?.currentStock;
            m.weatherIcon = iconUrl;
            let weatherImpact= getWeatherData(weatherData.text);

            m.weatherConditon = weatherImpact.weatherCondition;
            m.weatherConditionCriticality =weatherImpact.weatherConditionCriticality;
            m.impact = weatherImpact.impact;

            if (m.movementType_type === 'GOODSRECEIPT') {
               m.Movement = m.quantity + requiredFieldsForStockLevels?.currentStock;
               m.impactType = 3;
               m.fromWarehouseDisplay = warehouseName + "(" + warehouseCode + ")";
               m.goodsCriticality = 3;

            } else if (m.movementType_type === 'GOODSISSUES') {
               m.Movement = requiredFieldsForStockLevels?.currentStock - m.quantity;
               m.impactType = 1;
               m.goodsCriticality = 1;
               m.fromWarehouseDisplay = warehouseName + "(" + warehouseCode + ")";
            } else {
               m.Movement = requiredFieldsForStockLevels?.currentStock - m.quantity;
               m.impactType = 2;
               m.goodsCriticality = 2;
               m.fromWarehouseDisplay = `From ${warehouseName} stock Transferred`;
            };

            return m;
         })
         
         // console.log(result)
      }else{
         result = result.map((m)=>{
            if(m.movementType_type==='GOODSRECEIPT') m.goodsCriticality=3
            else if(m.movementType_type==='GOODSISSUES') m.goodsCriticality=1;
            else m.goodsCriticality=2
            return m
         })
      }


   });

  //stockMovement create

   srv.on('error', (error) => {
      console.log(error.message);
   });

//    this.before('*', (req) => {
//   console.log("EVENT:", req.event);
//   console.log("USER ROLES:", req.user.roles);
//   console.log("USER SCOPES:", req.user.scopes);
// });
  srv.after(['READ', 'UPDATE'], StockMovements, async (data) => {
   console.log('READ And Update handler...')
   
   //helper(warehousName fetcher)
   async function helperFunction(ID,movementType){
      // console.log(ID)
      if(movementType==='GOODSRECEIPT'){
         // console.log("hi")
         let stockMovement = await SELECT.one.from(StockMovements).columns('toWarehouse_ID').where({ID});
         let warehouseName = await SELECT.one.from(Warehouse).columns('warehouseName').where({ID:stockMovement.toWarehouse_ID});
         // console.log("bye")
         return warehouseName.warehouseName??'Not Present';
      }else if(movementType==='GOODSISSUES'){
         let stockMovement = await SELECT.one.from(StockMovements).columns('fromWarehouse_ID').where({ID});
         let warehouseName = await SELECT.one.from(Warehouse).columns('warehouseName').where({ID:stockMovement.fromWarehouse_ID});
         return warehouseName.warehouseName ?? 'Not Present';
      }else{
         let stockMovement = await SELECT.one.from(StockMovements).columns('fromWarehouse_ID','toWarehouse_ID').where({ID});
         let fromWarehousName = await SELECT.one.from(Warehouse).columns('warehouseName').where({ID:stockMovement.fromWarehouse_ID});
         // console.log("From Warehouse Name::",fromWarehousName.warehouseName)
         let toWarehouseName = await SELECT.one.from(Warehouse).columns('warehouseName').where({ID:stockMovement.toWarehouse_ID});
         // console.log("To Warehouse Name::",toWarehouseName.warehouseName)
         let transfer = `${fromWarehousName?.warehouseName}->${toWarehouseName?.warehouseName}`;
         console.log(transfer);
         return transfer;
      }
   }
  
   const test = await Promise.all(
     data.map(async (movement)=>{
        let ID = movement.ID;
        let movementType = movement.movementType_type;
        let warehouseName  = await helperFunction(ID,movementType);
      //   console.log("Check::",warehouseName)
        movement['whouseName']=warehouseName 
       return movement;
    }));

    console.log(test)


   // calc(data);
   // console.log(data)
});
   srv.on('alertCheck',async(req)=>{
      console.log("Alert ");
      await notify();
      let message = 'Alert Triggered';
      req.info(message)
      return message;
   })
}


function getWeatherData(condition) {

  const text = condition.toLowerCase();

  let output = {};
  output.weatherCondition = condition;

  if (text.includes("sunny") || text.includes("clear")) {
    output.weatherConditionCriticality = 3;
    output.impact = "No Delay";
  }

 
  else if (
    text.includes("cloud") ||
    text.includes("overcast")
  ) {
    output.weatherConditionCriticality = 0 || "Sunny";
    output.impact = "Normal Operation";
  }


  else if (
    text.includes("rain") ||
    text.includes("drizzle")
  ) {
    output.weatherConditionCriticality = 1;
    output.impact = "Delay Possible";
  }


  else if (
    text.includes("storm") ||
    text.includes("thunder") ||
    text.includes("fog") ||
    text.includes("mist") ||
    text.includes("snow") ||
    text.includes("ice")
  ) {
    output.weatherConditionCriticality = 2;
    output.impact = "High Risk / Delay Expected";
  }


  else {
    output.weatherConditionCriticality = 0;
    output.impact = "Normal";
  }

  return output;
}

//generate BinLocation
function generateBinLocation(existingBins) {

   const bin = new Set(existingBins.map((e) => e.binLocation));

   const maxRow = 26, maxCol = 9;
   for (let i = 0; i < maxRow; i++) {
      let row = String.fromCharCode(65 + i);
      for (let j = 1; j <= maxCol; j++) {
         let newBin = `${row}${j}`
         if (!bin.has(newBin)) {
            return newBin;
         }
      }
   }
   return 'NO Bin Available';
}