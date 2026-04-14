const preventCustomerDeleteWithOrders = async function (req) {
        const { ID } = req.params[0];
        try {
            const data = await SELECT.from(OrderHeader).where({ customer_ID: ID });
            if (data.length > 0) {
                return req.error(405, "Cannot delete customer with orders");
            }
        } catch (err) {
            return req.error(500, "Internal Server Error");
        }
    }

    module.exports = {preventCustomerDeleteWithOrders}