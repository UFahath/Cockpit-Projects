const validateOrderHeader = async function (req) {
        const { totalAmount,customer_ID,shippingAddress_ID} = req.data;
        // console.log(typeof totalAmount)
        try {
            if (totalAmount <= 0) {
                // console.log("Test")
                return req.error(400, "Invalid Total Amount");
            }
             const data = await SELECT.from(Customer).where({ID:customer_ID});
             const isCustomerPresent = data.length>0?true:false;
            //  console.log(isCustomerPresent)
             if(isCustomerPresent){
              const isValidShippingAddress = await SELECT.one.from(CustomerAddress).where({ID:shippingAddress_ID});
              if(!isValidShippingAddress) return req.error(404,"Shipping Address Not found");
             }else{
                return req.error(404,"Customer Not Found");
             }
        } catch (err) {
             return req.error(500,"Internal Server Error");
        }
    }


    module.exports ={validateOrderHeader}