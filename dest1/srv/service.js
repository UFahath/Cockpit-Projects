const cds = require('@sap/cds');
const alertFun = require('./triggerNotification');
require('dotenv').config();
//  weather
// const { getDestination } = require('@sap-cloud-sdk/connectivity');
const { SELECT, UPDATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');
const req = require('express/lib/request');
module.exports = cds.service.impl(async function () {
    const weather = await cds.connect.to('Weather_Api');
    const { SalesOrderHeader, externalSalesOrderHeader,Department } = this.entities;
    const s4 = await cds.connect.to('API_SALES_ORDER_SRV');


    this.on('getWeatherData', async (req) => {
        // let destination = await getDestination({destinationName:'weathernew'});
        // 9f85b3bc06274c7990e92411262506
        // console.log(destination.headers)
        //    const data = await weather.get(`/v1/current.json?q=Chennai&key=${process.env.API_KEY}`);
        const data = await weather.send({
            method: 'GET',
            path: `/v1/current.json?q=Chennai&key=${process.env.API_KEY}`
        })
        return data;
    })

    //s4 salesorder
    // console.log(SalesOrde)
    // this.on("READ", SalesOrderHeader, async (req) => {

    //     let fields = ['SalesOrder', 'SoldToParty', 'SalesOrderDate', 'TotalNetAmount', 'TransactionCurrency']

    //     // 1)Return all sales orders where TotalNetAmount > 200
    //     // 2)Find orders created after 2016-09-01
    //     // 3)Get top 5 highest value sales orders
    //     // let data = await s4.run(req.query.where({TotalNetAmount:{'>':200}}));

    //     //   let data1 = await s4.run(SELECT.from('A_SalesOrder').columns(fields).limit(40).where({SalesOrderDate:{'>':'2016-09-01'}}))
    //     //   let data2 = await s4.run(SELECT.from('A_SalesOrder').columns(fields).orderBy('TotalNetAmount desc').limit(5))
    //     // console.log(req)
    //     let data2 = await s4.run(SELECT.from('A_SalesOrder').columns(fields).limit(40));
    //     console.log(data2)
    //     //  console.log(req);
    //     //  console.log(cds.context)
    //     // await this.emit('salesAbove', cds.context)
    //     return data2;
    // });


    //Create
    this.on("CREATE", SalesOrderHeader, async (req) => {
        const { SalesOrder, SoldToParty, SalesOrderDate, TotalNetAmount, TransactionCurrency } = req.data;
        if (!SalesOrder || !SoldToParty || !SalesOrderDate || !TotalNetAmount || !TransactionCurrency) {
            return req.error(400, 'Invalid input')
        }
        const data = await INSERT.into(SalesOrderHeader).entries(req.data);
        if (data) {
            this.emit('orderCreation', req.data)
        }

    })




    //Order Creation Mail Send
    this.on('orderCreation', async (result) => {
        // console.log(result)
        await alertFun(result.data)
        console.log("Successfully Order Created");

    })




    //readonlyfield datacreation
    this.on("createSalesOrder", async (req) => {
        const { SalesOrder, SoldToParty, SalesOrderDate, TotalNetAmount, TransactionCurrency } = req.data;
        if (!SalesOrder || !SoldToParty || !SalesOrderDate || !TotalNetAmount || !TransactionCurrency) {
            return req.error(400, 'Invalid input')
        }
        const data = await INSERT.into(SalesOrderHeader).entries(req.data);
        return data;
    });

   //criticality applying
    this.on('applyCriticality',async(req)=>{
        const data = await SELECT.from(SalesOrderHeader).columns('SalesOrder','TotalNetAmount').where({MyCriticality:null});
        if(data.length===0){
            let msg = "No Change Made";
            req.info(msg)
            return msg
        }
        //  console.log(data)
        
         for (let obj of data){
            await UPDATE(SalesOrderHeader).set({MyCriticality:obj.TotalNetAmount>400?1:3}).where({SalesOrder:obj.SalesOrder});
         }
    });


   this.on('READ',SalesOrderHeader,async function(req,next){
    console.log(s4);
    return next();
   })
    
    this.after('READ',SalesOrderHeader,async(result,req)=>{
         console.log(s4)
         let data = await SELECT.from(SalesOrderHeader);
         let countOfRecords = data.length
  
       result.forEach((obj)=>{
          obj.TotalSales = countOfRecords
       })
    //    console.log(result)

    });



    //create for auto exposed Entity 
  this.on('createDept', async (req) => {
    // console.log("ACTION HIT");

        // console.log("BEFORE INSERT");

        const result = await INSERT.into(Department).entries(req.data);

        // console.log("AFTER INSERT");

        return { status: "OK", result };
});
})





