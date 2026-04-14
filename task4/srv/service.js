const cds = require('@sap/cds');
const { SELECT, UPDATE, UPSERT, INSERT } = cds.ql;
// const { executeHttpRequest } = require('@sap-cloud-sdk/core');
//Implementation Function
 
module.exports = cds.service.impl(async function () {

    const geoService = await cds.connect.to('GeoCode');
    const { Logs, Vehicles, Dealers, States } = this.entities;
   
    //Vehicle ID Format Validation(8th validation)
    this.before('CREATE', Vehicles, async function (req) {
        const { isErrorOccured, error } = await createVehicleValidator(req, Dealers, States, Vehicles);
        if (isErrorOccured) {
            if (error.message === 'Invalid Dealer') {
                return req.error(403, error.message)
            }
            return req.error(400, error.message)
        }
    })

    //before Creating Dealer
    this.before('CREATE',Dealers,async function(req){
       
        const {dealerName,location} = req.data;
        if(!dealerName || !location){
            return req.error(400,"All the Fields Are Required");
        }
         const response = await geoService.send({
         method:"GET",
         path:`/odata/v4/my/getMap(loc='${location}')`
       });
        const dealers = await SELECT.one.from(Dealers).columns('dealerId').orderBy('dealerId Desc');
        let lastId = dealers?.dealerId.slice(1);
        let lastDealerId = parseInt(lastId);
        req.data.dealerId = "D"+(String(lastDealerId+1).padStart(3,"0"));
        // console.log(response)
        req.data.district = response.value[0].name;
        req.data.lat = response.value[0].latitude;
        req.data.lon = response.value[0].longitude;
    
        // console.log("dealerId1:",req.data.dealerId)
    })

    //Vehicle Creation(6th handler override)
    this.on('CREATE', Vehicles, async function (req) {
        const { isErrorOccured, result } = await insertVehicleData(req, Vehicles);
        if (isErrorOccured) {
            return req.error(409, result);
        }
        return result;
    })
    //Read Vehicle(on)
    this.on('CREATE', Dealers, async function (req,next) {
        // console.log("dealerId2:",req.data)
        // const {dealerId,dealerName,location}=req.data;
         const targetDealer = await SELECT.one.from(Dealers).where({dealerId:req.data.dealerId,status:"ACTIVE"});
         if(targetDealer){
            return req.error(400,"Dealer already present")
         };


         const dealerCreated = await INSERT.into(Dealers).entries(req.data);
        //  console.log(dealerCreated)
        return dealerCreated;
    });


     //after
    //  this.after('CREATE',Dealers,async (result)=>{
    //     // console.log(result[0].location)
    //     // console.log(result)
    // //    let location = result.location;
    // //    console.log(location)
    //    const response = await geoService.send({
    //      method:"GET",
    //      path:`/odata/v4/my/getMap(loc='${location}')`
    //    });
    //    console.log(response.value[0])
    // //    result.district = response.value[0].name
       
    //     result.district =response.value[0].name;
    //     // console.log(result.district)
    //     result.lat=response.value[0].latitude;
    //     result.lon=response.value[0].longitude

    //  })

    //Price Swap(5th) validator
    this.before('UPDATE', Vehicles, async function (req) {
        const { isErrorOccured, error } = await priceUpdateValidater(req);
        if (isErrorOccured) {
            return req.error(400, error.message);
        }
    });

    //Price Swap(5th) Update
    this.on('UPDATE', Vehicles, async function (req) {
        const { isErrorOccured, error, data } = await updatePrice(req, Vehicles, States);
        if (isErrorOccured) {
            return req.error(404, error.message);
        }
        return data;
    })
 ///-------------------ReserVe Vehicle
//  Only allow if vehicle is Available
// Change status → Reserved
// Create a Log entry
// Disable button after reservation
// Show success message (UI logic)
   this.on('reserveVehicle',async function(req){
    console.log("hello")
       const{vehicleId}= req.params[0]
       console.log(vehicleId)
       if(!vehicleId){
        return req.error(400,"Vehicle Id Required");
       }
       const isVehicleAvaliable = await SELECT.one.from(Vehicles).where({vehicleId,vehicleStatus:'Available'});
       if(!isVehicleAvaliable) return req.error(404,"No Avaliable Vehicle Exist");
      const data =  await UPDATE(Vehicles).set({vehicleStatus:'Reserved', isReservable: false }).where({vehicleId,vehicleStatus:'Available'});
    //    console.log(data)
      await globalLogger(req,Logs);
       return SELECT.one.from(Vehicles).where({vehicleId})
   });



//--------------------------
    //Logger(4th (capture user detail in store in logs entity))
    this.after('*', '*', async (results, req) => {
   
        if (req.target?.name === 'Logs') return;
        try {
            await globalLogger(req, Logs);
            return results;
        } catch (err) {
            console.error('Logging failed', err);
        }
    });

    this.on('getCoordinates', async function (req) {

      const state = req.data.state;
         console.log(state)
        // const response = await executeHttpRequest(
        //     { destinationName: 'GeoCode' },
        //     { method: 'GET', url: '/odata/v4/my/getMap?loc=Chennai' }
        // );

        const response = await geoService.send({
          method: 'GET',
          path: `/odata/v4/my/getMap(loc='${state}')`
        });
         console.log(response)
        return response;
    })

})



//Logger handler (Point -4)
async function globalLogger(req, Logs) {
    const { user, event, target } = req;
    await UPSERT.into(Logs).entries(
        {
            logId: cds.utils.uuid(),
            userId: user.id,
            action: event,
            entityName: target?.name,
            timeStamp: new Date().toISOString()
        }
    )
}


//Vehicle Price Swap validate handler (Point - 5)
async function priceUpdateValidater(req) {
    const { newPrice } = req.data;
    const vehicleId = req.data.vehicleId || req.params[0]?.vehicleId;
    let error = null;
    if (!vehicleId) {
        error = new Error("Vehicle ID is required")
        return { isErrorOccured: true, error }
    }
    if (newPrice === undefined) {
        error = new Error("New Price is Required")
        return { isErrorOccured: true, error }
    }
    if (newPrice <= 0) {
        error = new Error("Price must be Valid")
        return { isErrorOccured: true, error }
    }

    return { isErrorOccured: false }
}


//Vehicle Swap Update Main logic handler (Point -5)
async function updatePrice(req, Vehicles, States) {
    const { newPrice } = req.data;
    const vehicleId = req.data.vehicleId || req.params[0]?.vehicleId;
    let error = null;
    const isVehicleExist = await SELECT.one.from(Vehicles).where({ vehicleId });
    if (!isVehicleExist) {
        error = new Error('Vehicle Not Exist');
        return { isErrorOccured: true, error }
    }
    const { tax } = await SELECT.one.from(States).where({ ID: isVehicleExist.state_ID });

    const updatedRecord = {
        oldPrice: isVehicleExist.newPrice,
        newPrice: newPrice * (1 + tax / 100)
    }
    await UPDATE(Vehicles).set(updatedRecord).where({ vehicleId });
    return {
        isErrorOccured: false,
        data: {
            vehicleId,
            ...updatedRecord
        },
    }
}

//create Vehicle validator handler(Point -8)
async function createVehicleValidator(req, Dealers, States, Vehicles) {
    const { modelName, newPrice, dealer_ID, state_ID } = req.data;
    let error = null;

    const isDealerExist = await SELECT.one.from(Dealers).where({ dealerId: dealer_ID });
    if (!isDealerExist) {
        error = new Error('Invalid Dealer');
        return { isErrorOccured: true, error };
    }
    if (!modelName) {
        error = new Error('Model Name is Required');
        return { isErrorOccured: true, error };
    }
    if (newPrice === undefined || newPrice <= 0) {
        error = new Error('Vehicle Price must be greater Zero');
        return { isErrorOccured: true, error };
    }

    const { tax, stateCode } = await SELECT.one.from(States).where({ ID: state_ID });
    req.data.newPrice = req.data.newPrice * (1 + tax / 100);


    const lastVehicle = await SELECT.one.from(Vehicles)
        .where({ state_ID })
        .orderBy('vehicleId desc');

    let lastNumber = 0;
    // console.log(lastVehicle.vehicleId);
    if (lastVehicle && lastVehicle.vehicleId) {
        const numberPart = lastVehicle.vehicleId.slice(2);
        lastNumber = Number(numberPart);
    }

    const newNumber = lastNumber + 1;
    req.data.vehicleId = `${stateCode}${newNumber}`;

    return { isErrorOccured: false };
}

//CreateVehicle
async function insertVehicleData(req, Vehicles) {
    const { vehicleId, modelName, newPrice, dealer_ID, state_ID } = req.data;
    const vehicle = await SELECT.one.from(Vehicles).where({ vehicleId });
    let error = null;
    if (vehicle) {
        error = new Error('Already Vehicle Exist');
        return { isErrorOccured: true, error };
    }
    const inserted = await INSERT.into(Vehicles).entries({
        vehicleId,
        modelName,
        vehicleStatus: 'Available',
        newPrice,
        dealer_ID,
        state_ID
    });
    return { isErrorOccured: false, inserted }
}


//Read Vehicle 
async function readVehicle(Vehicles) {
    // const data = await SELECT.from(Vehicles)
    //     .columns([
    //         'vehicleId',
    //         'dealer.dealerName',
    //         'state.stateCode'
    //     ])
    //     .where({ vehicleStatus: 'Available' });
    const data = await SELECT.from(Vehicles);
    return data;
}