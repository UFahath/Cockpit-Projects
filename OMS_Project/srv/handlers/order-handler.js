const { serve } = require("@sap/cds");
const INSERT = require("@sap/cds/lib/ql/INSERT");
const SELECT = require("@sap/cds/lib/ql/SELECT");
const UPDATE = require("@sap/cds/lib/ql/UPDATE");
const { OrderHeader, OrderDetail, SupplierProduct, Inventory,Shipping} = cds.entities;
const placeOrder = async function (req) {
    const { customerID, productID, quantity, addressID } = req.data;
    const tx = cds.tx(req);
    try {
        if (!customerID || !productID || quantity == undefined || !addressID) {
            return req.error(400, "All The Fields Are Required");
        }
        const product = await tx.run(SELECT.one.from(SupplierProduct).where({ product_ID: productID }));
        // console.log('2')
        if (!product) {
            return req.error(404, "Product Not Found");
        }

        const inventory = await tx.run(
            SELECT.one.from(Inventory).where({ product_ID: productID })
        );

        if (!inventory || inventory.stockQuantity < quantity) {
            return req.error(400, "Insufficient Stock");
        }

        const totalAmount = product.price * quantity;

        const order = await tx.run(INSERT.into(OrderHeader).entries({
            customer_ID: customerID,
            status: "Ordered",
            shippingAddress_ID: addressID,
            totalAmount,
        }));

        const orderID = order.ID;

        // console.log("6")
        await tx.run(INSERT.into(OrderDetail).entries({
            order_ID: orderID,
            product_ID: productID,
            quantity,
            price: product.price,
            status: "Ordered"
        }));
        // console.log("7")

        await tx.run(UPDATE(Inventory).set({ stockQuantity: inventory.stockQuantity - quantity }).where({ product_ID: productID }));
        await this.emit("createShipment", {
            orderID,
            addressID
        });

        return {
            msg: "Order Placed Successfully",
            orderID
        };

    } catch (err) {
        return req.error(500, "Internal Server Error");
    }
}


const createShipmentRequest = async function (msg) {

    const { orderID, addressID } = msg.data ;

    const tx = cds.tx(msg);

    await tx.run(
        INSERT.into(Shipping).entries({
            order_ID: orderID,
            shipmentStatus: "Pending",
            shippedAt: new Date(),
            address_ID: addressID
        })
    );

    console.log("Shipment Created for Order:", orderID);

}

module.exports = { placeOrder,createShipmentRequest}