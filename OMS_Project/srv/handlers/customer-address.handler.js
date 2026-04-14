const { UPDATE, SELECT } = require("@sap/cds/lib/ql/cds-ql");
const {CustomerAddress} = cds.entities;
 const newAddress = async function (req) {
        //   console.log(req.data);
        try {
            const data = req.data;
            if (!data.customer_ID || data.isDefault === undefined || !data.addressDetail_street || !data.addressDetail_city || !data.addressDetail_pincode) {
                return req.error(400, "Please provide all the details");
            }
            (data.isDefault) &&
                await UPDATE(CustomerAddress).set({ isDefault: false }).where({ customer_ID: data.customer_ID, isDefault: true })
        } catch (err) {
            return req.error(500, "Internal Server Error");
        }
    }


    //action for marking defaultAddress
    const setDefaultAddress = async function(req){
         const {customerID,addressID} = req.data;
         const tx = cds.tx(req);
         try{
            if(!addressID||!customerID) return req.error(400,"Invalid Id");
            // const allAddress = await SELECT.from(CustomerAddress);
            // // console.log(allAddress);
            
            const isCustomerHasAddress = await tx.run(SELECT.from(CustomerAddress).where({customer_ID:customerID}));
            // console.log(isCustomerHasAddress)
            if(isCustomerHasAddress.length===0){
                return req.error(404,"Customer Has No Address");
            }else{
                await tx.run(UPDATE(CustomerAddress).set({isDefault:false}).where({customer_ID:customerID,isDefault:true}));
               const updated = await tx.run(UPDATE(CustomerAddress).set({isDefault:true}).where({customer_ID:customerID,ID:addressID}));
               if (updated === 0) return req.error(404, "Address not found for this customer");
               tx.commit();
               return { success: true, message: "Address Set as Default" };
            }
         }catch(err){
            return req.error(500,"Internal Server Error");
         }
    };

    module.exports ={newAddress,setDefaultAddress}