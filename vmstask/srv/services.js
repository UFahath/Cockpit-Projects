const cds = require('@sap/cds');
const { INSERT, SELECT } = require('@sap/cds/lib/ql/cds-ql');


module.exports = cds.service.impl(async function () {
    const { Vehicles, Orders, Dealers, State, Customers } = this.entities;
    // const StateAPI = await cds.connect.to('StateAPI');
    //Generic handler for logging and basic validation

    //Entity Logging(Task 2)
    this.before(['CREATE', 'UPDATE', 'DELETE'], '*', function (req) {
        console.log(`Event: ${req.event} \nEntity: ${req.target.name}`);
        console.log({
            user: req.user.id,
            event: req.event,
            entity: req.target.name,
            timestamp: new Date().toISOString()
        });

        // console.log(req.user.ifd)
        // console.log(req.event)
        // const role = req.user.is('Admin')
        // console.log(req.user)
        // console.log(req.user.id);
        // console.log(req.user.id.includes('admin'))
        if(!req.user.id.includes('admin')&& req.event === 'CREATE' && req.target.name === 'services.srv.VMS.State'){
            return req.error(403,{msg:'only admin create state details'})
        }
        //------------------------------------------

        //    const userNew = req.user.id
        // console.log(userNew)
        // if(req.event==='CREATE'){
        //    if(!userNew.toLowerCase().includes('admin') && req.target.name==='services.srv.Vehicles'){
        //       return req.reject(401,{msg:"only admin allowed to create vehicle"})
        //    };
        // }
        // console.log(req.event)
        // console.log(req.target.name)
        // if(!req.user.is('admin') && req.event === 'CREATE' && req.target.name === 'services.srv.Vehicles'){
        //     return req.error(401,{msg:'Only admin list Vehicles'})
        // }
    })


    //before Creating Vehicles
    //--------------------------------------
    this.before('CREATE', Vehicles, async function (req) {
        const { modelName, currentPrice, stateName, dealer_dealerId } = req.data;
        // console.log("Req Data:", req.data);
        //1)Validate Empty fields(check if is not falsy value and trim space before and after)
        if (!modelName?.trim() || currentPrice == null || !dealer_dealerId?.trim()) {
            return req.error(400, { msg: "All The Fields Are Required" });
        }

        //2)validate negative price and type other than number
        if (typeof currentPrice !== 'number' || currentPrice <= 0) return req.error(400, { msg: "Price Should Be Positive Number" });

        //3)check dealer exists before vehicle listings
        const dealer = await SELECT.one.from(Dealers).where({ dealerId: dealer_dealerId });
        if (!dealer) return req.error(400, "Dealer does not exist");

        //4)check stateName in the state entity and retrieve the stateCode and tax
        const state = await SELECT.one.from(State).where({ stateName });
        if (!state) {
            return req.error(400, { msg: `Invalid state Name: ${stateName}` });
        }

        //5)extract stateCode and tax using destructuring
        //  delete req.data.stateName;

        const { stateCode, taxPercentage } = state;

        req.data.state_stateCode = stateCode;

        //6)Extract the last Vehicle id created on the stateCode by applying order by in descending order
        const lastVehicle = await SELECT.one.from(Vehicles).where({ state_stateCode: stateCode }).orderBy({ vehicleId: 'desc' });

        //7)Generate the next number and attach statecode with number
        const nextNumber = lastVehicle ? Number(lastVehicle.vehicleId.slice(stateCode.length)) + 1 : 1001;
        const newId = stateCode + nextNumber;
        // console.log(newId);

        //8)Check the vehicle is already Present (There might be the chance that vehicle is list already)
        const vehicle = await SELECT.one.from(Vehicles).where({  
            modelName: modelName,
            dealer_dealerId: dealer_dealerId});
        if (vehicle) return req.error(400, { msg: "Vehicle already listed" })

        //9)Attach vehicleId to the request
        req.data.vehicleId = newId;

        //10)calculate tax for new vehicle based on the state and attach to current price (old price is null)
        const totalPrice = currentPrice + (currentPrice * (taxPercentage / 100));
        req.data.currentPrice = totalPrice;

        //11)Attach who is listing the vehicle(usually admin)
        req.data.createdBy = req.user.id;

        //12)log the generated Vehicle id
        console.log(`Generated Vehicle ID: ${newId}`);
    });


    //Before Creating Dealers
    this.before('CREATE', Dealers, async function (req) {
        //1)Destructure the dealer Name and location
        const { dealerName, location } = req.data;

        //2)Check the dealerName and location fields empty or not
        if (!dealerName || !location) {
            return req.error(400, { msg: "All the Fields Are Required" })
        }

        //3)Check new Dealer already in the System
        const dealer = await SELECT.one.from(Dealers).where({ dealerName, location });
        if (dealer) {
            return req.error(400, "Already Present")
        }

        //4)Check dealer Name must be A-Zora-z or space and between 3 to 50 characters
        if (!/^[A-Za-z ]{3,50}$/.test(req.data.dealerName)) {
            return req.error(400, { msg: 'Dealer name must be at least 3 characters and contain only letters.' });
        }

        //5)Check location must be A-Zora-zor space and between 3 to 40 character
        if (!/^[A-Za-z ]{3,40}$/.test(req.data.location)) {
            return req.error(400, { msg: 'Location must contain only letters.' });
        }

        //6)Get the last dealer id by using ordering by descending with dealerId
        let lastDealerId = await SELECT.one.from(Dealers).orderBy({ dealerId: 'desc' });

        //7)get the last dealerid if present
        // console.log(Number(lastDealerId.dealerId.slice(2)))
        let nextId = lastDealerId
            ? Number(lastDealerId.dealerId.slice(1)) + 1
            : 1001;
        
            // console.log(nextId)
        //8)Add 'D' prefix to that number
        req.data.dealerId = 'D' + nextId;

        //9)Attach who created
        req.data.createdBy = req.user.id

    })


    //Before Creating Order
    this.before('CREATE', Orders, async (req) => {
        const { orderId, vehicleRef_vehicleId, quantity, customer_customerId } = req.data;

        if (!vehicleRef_vehicleId || quantity === undefined || !customer_customerId) {
            return req.error(400, { msg: "All the Fields Are Required" });
        }
        const customer = await SELECT.one.from(Customers).where({ customerId: customer_customerId });
        if (!customer) {
            return req.error(400, { msg: "We Cannot Place Order for Not Exists Customer" });
        }
        if (quantity <= 0) {
            return req.error(400, { msg: "Quantity must be greater than zero" });
        }
        const vehicle = await SELECT.one.from(Vehicles).where({ vehicleId: vehicleRef_vehicleId });
        if (!vehicle) {
            return req.error(404, { msg: `Vehicle ${vehicleRef_vehicleId} does not exist` });
        }

        if (vehicle.vehicleStatus.toLowerCase() !== 'approved') {
            return req.error(400, { msg: "Cannot place order for an not approved vehicle" });
        }
        
         const isOrderAlreadyExist  = await SELECT.one.from(Orders).where({vehicleRef_vehicleId,customer_customerId});
         if(isOrderAlreadyExist) return req.error(409,{msg:"Duplicate Order Not Allowed"});

        if (!orderId) {
            const lastOrder = await SELECT.one.from(Orders).orderBy({ orderId: 'desc' });
            const nextId = lastOrder ? Number(lastOrder.orderId.slice(1)) + 1 : 1001;
            req.data.orderId = 'O' + nextId;
        }
        req.data.createdBy = req.user?.id;
    });




    // before update(vehicle)

    this.before('UPDATE', Vehicles, async function (req) {
        const { vehicleId, currentPrice, vehicleStatus } = req.data;

        // Validate required fields
        if (!vehicleId) return req.error(400, { msg: "VehicleId is required" });
        if (currentPrice !== undefined && currentPrice <= 0) {
            return req.error(400, { msg: "Price should be positive" });
        }

        // Validate status if updating
        const allowedStatuses = ['pending', 'approved', 'rejected'];
        if (vehicleStatus && !allowedStatuses.includes(vehicleStatus.toLowerCase())) {
            return req.error(400, { msg: "Invalid vehicle status" });
        }
        
        req.data.vehicleStatus = vehicleStatus;
        // Track who is updating
        req.data.modifiedBy = req.user.id;
        req.data.modifiedAt = new Date();
    });


    //on vehicle create
    this.on('CREATE', Vehicles, async function (req) {

        const { vehicleId, modelName, currentPrice, dealer_dealerId, state_stateCode, createdBy} = req.data;

        return await INSERT.into(Vehicles).entries({
            vehicleId,
            modelName,
            currentPrice,
            oldPrice: 0,
            state_stateCode,
            dealer_dealerId,
            createdBy,
            createdAt: new Date().toISOString()
        });

    });
    this.on('UPDATE', Vehicles, async function (req) {
        const tx = cds.tx(req);
        const { vehicleId, currentPrice, vehicleStatus } = req.data;

        // Fetch vehicle record
        const vehicle = await tx.run(SELECT.one.from(Vehicles).where({ vehicleId }));
        if (!vehicle) return req.error(404, "Vehicle not found");

        // Fetch state tax info
        const state = await tx.run(SELECT.one.from(State).where({ stateCode: vehicle.state_stateCode }));
        if (!state) return req.error(400, "State tax configuration missing");

        // Update oldPrice if currentPrice is changing
        const updatedData = {};
        if (currentPrice !== undefined) {
            updatedData.oldPrice = vehicle.currentPrice;
            updatedData.currentPrice = currentPrice + (currentPrice * (state.taxPercentage / 100));
        }

    //    console.log(vehicleStatus,vehicle.vehicleStatus)
        //  vehicle approval
        if (vehicleStatus?.toLowerCase() === 'approved' && vehicle?.vehicleStatus.toLowerCase()=== 'pending') {
            updatedData.vehicleStatus = 'approved';
            //Generate Vehicle Number
            let generateVehicleNumber = async (stateCode) => {
                let rto = "01";
                let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let exist = true, result, attempts = 0;
                while (exist && attempts < 20) {
                    let letterSequence = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
                    let numbers = Math.floor(Math.random() * 9000) + 1000;
                    result = `${stateCode}${rto}${letterSequence}${numbers}`;
                    let dataExist = await SELECT.one.from(Vehicles).where({ vehicleNumber: result });
                    if (!dataExist) {
                        exist = false;
                    }
                    attempts++;
                }
                if (exist) throw new Error("Unable to generate unique vehicle number");
                return result;
            }
            updatedData.vehicleNumber = await generateVehicleNumber(state.stateCode);
            // Notify dealer here
        } else if(vehicleStatus?.toLowerCase()==='rejected' && vehicle?.vehicleStatus.toLowerCase()==='pending'){
            updatedData.vehicleStatus = 'rejected'
        }
        
         // Track modification 
        updatedData.modifiedBy = req.user.id;
        updatedData.modifiedAt = new Date();

        // Apply update
        await tx.run(UPDATE(Vehicles).set(updatedData).where({ vehicleId }));
  
        // Return updated record
        return await tx.run(SELECT.one.from(Vehicles).where({ vehicleId }));
    });


   this.on('READ', Vehicles, async (req,next) => {
    // let vehicles;
    // console.log(!req.user.id.includes('admin'))
    // username:admin1 (if sign in popup appeared type admin1)
    // if(req.user&& req.user.id.includes('admin')){
    //     vehicles = await SELECT.from(Vehicles);
    // }else if(req.user&& req.user.id.includes('dealer')){
    //     vehicles = await SELECT.from(Vehicles).where({dealer_dealer_Id,vehicleStatus:'approved'})
    // } if (!req.user.id){
    //     return req.error(403,{msg:'Unauthorized'});
    // }
     if(req.user.id.includes('admin')){
        return await SELECT.from(Vehicles);
     }
     if(req.user.id.includes('dealer')){
        return await SELECT.from(Vehicles).where({dealer_dealerId,vehicleStatus:"approved"});
     }
      
    });
})


 







//-------------------------------------------------
//     //approveVehicle action
//     this.on('approveVehicle', async function (req) {
//         const tx = cds.tx(req);
//         const { vehicleId } = req.data;
//         const updatedVehicle = await tx.run(UPDATE(Vehicles).set({ vehicleStatus: 'approved' }).where({ vehicleId: vehicleId }));
//         if (updatedVehicle === 0) {
//             return { msg: 'There is no Such vehicle Exist' }
//         }
//         const updatedRecord = await tx.run(SELECT.one.from(Vehicles).where({ vehicleId }))


//         //Generate Vehicle Number
//         let generateVehicleNumber = async (stateCode) => {
//             let rto = "01";
//             let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//             let exist = true, result, attempts = 0;
//             while (exist && attempts < 20) {
//                 let letterSequence = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
//                 let numbers = Math.floor(Math.random() * 9000) + 1000;
//                 result = `${stateCode}${rto}${letterSequence}${numbers}`;
//                 let dataExist = await SELECT.one.from(Vehicles).where({ vehicleNumber: result });
//                 if (!dataExist) {
//                     exist = false;
//                 }
//                 attempts++;
//             }
//             if (exist) throw new Error("Unable to generate unique vehicle number");
//             return result;
//         }

//         let vehicleNumberAssigned = await generateVehicleNumber(updatedRecord.state_stateCode);
//         // console.log(vehicleNumber)
//         await tx.run(UPDATE(Vehicles).set({ vehicleNumber: vehicleNumberAssigned }).where({ vehicleId: updatedRecord.vehicleId }));
//         const { dealer_dealerId } = updatedRecord;
//         await this.emit('notifyDealer', { vehicleId, dealer_dealerId });
//         return { msg: `Vehicle Approved For This ID: ${vehicleId}`, vehicle: updatedRecord };
//     })

//     //notifyDealer action
//     this.on('notifyDealer', async function (msg) {
//         // console.log(msg.data.vehicleId, msg.data.dealer_dealerId)
//         await INSERT.into('Notification').entries({
//             vehicle_vehicleId: msg.data.vehicleId,
//             dealer_dealerId: msg.data.dealer_dealerId,
//             message: `Vehicle Approved For This ID: ${msg.data.vehicleId}`,
//             createdAt: new Date()
//         });
//         return { msg: `Dealer Notified For Vehicle ID: ${msg.data.vehicleId}` };
//     })

//     //getTotalOrderValue
//     this.on('getTotalOrderValue', async function (req) {
//         const { vehicleId } = req.data;
//         const tx = cds.tx(req);
//         const data = await tx.run(SELECT.one.from(Vehicles).where({ vehicleId }));
//         // console.log(data)
//         if (!data) {
//             return req.error("404", "Target Vehicle Not Found");
//         }
//         const orders = await tx.run(SELECT.from(Orders).where({ vehicleRef_vehicleId: data.vehicleId }));
//         // console.log(orders)
//         const getTotal = orders.reduce((sum, { quantity, orderStatus }) => {
//             if (orderStatus?.toLowerCase() === 'approved') {
//                 sum += quantity * data.currentPrice;
//             }
//             return sum;
//         }, 0)

//         // console.log(getTotal);

//         return { totalOrderValue: getTotal };
//     })
// })