const cds = require('@sap/cds');
const { SELECT } = cds.ql;


module.exports = function (srv) {
    console.log(srv)
    const { Products, StockLevels,Categories  } = srv.entities;


    //logger
//     srv.before('*', (req) => {
//    const caller = req.http?.req?.headers?.['x-sap-caller'];
//   console.log(caller)
//    if (caller === 'MovementService') {
//       console.log('Called from MovementService');
//    }
// });

    //Function getAvailableStock
    srv.on('getAvailableStock', async (req) => {
        const { productID, warehouseID } = req.data;
        if (!productID) {
            return req.error(400, "Product ID Needed")
        }
        if (!warehouseID) {
            return req.error(400, "Warehouse ID Needed");
        }

        try {
            const availableStock = await getAvailableStock(productID, warehouseID, StockLevels);
            // console.log(typeof availableStock)
            let output = availableStock<0?(availableStock*-1).toString():availableStock.toString();
            req.info(`Available Stock:: ${output}`)
            return output;
        } catch (err) {
            const statusCode = err.message === 'No Data Found' ? 404 : 500;
            return req.error(statusCode, err.message);
        }
    })


    //// Function: getLowStock(threshold)
    srv.on('getLowStockByThreshold', async (req) => {
        try {
            return await detectLowStock(req, StockLevels)
        } catch (err) {
            return req.error(500, "Internal Server Error")
        }

    })


    ///Function:autoLowStockDetect()
    srv.on('autoLowStockDetect', async (req) => {
        try{
            return await autoLowStockDetect(StockLevels)
        }catch(err){
            return req.error(500,"Internal Server Error")
        }
       
    })

    //ProductStockOverview after handler
    // srv.after('READ','ProductStockOverview',async(result)=>{
    //     console.log(Object.keys(result[0]));
    //     let targetCategory = await SELECT.from(Categories);
    //     console.log(typeof targetCategory)
    //     console.log("checker..........")
    //     // result = result.map((p,i)=>{
    //     //     console.log(p)
    //     //     console.log("count::",i++)
    //     //     let categoryID = p.category_ID;
    //     //     console.log(categoryID)
    //     //     console.log( targetCategory)
    //     //     let category = targetCategory.find((t)=>{
    //     //         return t.ID === categoryID
    //     //     });
    //     //     console.log(category)
    //     //     p.categoryType =category.categoryName;
    //     //     return p;
    //     // });
    //     console.log(result)
    // })





   let i =0;
    srv.after('READ','StockAlerts',async(result)=>{
        try{
         console.log('hi')
      
       console.log(result);
        }catch(err){
            console.log(err.message)
        }
        
    })
// srv.on('READ', 'StockAlerts', async (req) => {
//     console.log 
//     const tx = cds.transaction(req);
// console.log("jo")
//     // remove filter manually
//     req.query.SELECT.where = [];

//     const active = await tx.run(SELECT.from('StockAlerts'));
//     const drafts = await tx.run(SELECT.from('StockAlerts_drafts'));

//     return [...active, ...drafts];
// });
}


//functions------------------
async function getAvailableStock(productID, warehouseID, StockLevels) {
    const targetData = await SELECT.one.from(StockLevels).where({ product_ID: productID, warehouse_ID: warehouseID }).columns('currentStock', 'reservedStock');
    console.log(targetData)
    if (!targetData) {
        throw new Error('No Data Found');
    }
    return targetData.currentStock - targetData.reservedStock;
}

//detect low Stock---------------
async function detectLowStock(req, StockLevels) {
    const { threshold } = req.data;
    const limitation = Number(threshold)
    if (!Number.isFinite(limitation) || limitation < 0) {
        return req.error(400, "Invalid Input");
    }
    const lowStockData = await SELECT.from(StockLevels).where`(currentStock-reservedStock)<${limitation}`;
    return lowStockData;

}

//auto detect low stock items
async function autoLowStockDetect(StockLevels) {
    const lowStockData = await SELECT.from(StockLevels).where`(currentStock-reservedStock)<product.minStockLevel`;
    return lowStockData;
}