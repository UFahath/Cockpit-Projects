const cds = require('@sap/cds');
const { newAddress,setDefaultAddress } = require('./handlers/customer-address.handler');
const { validateOrderHeader } = require('./handlers/order-header.handler');
const { preventCustomerDeleteWithOrders } = require('./handlers/customer-handler');
const {placeOrder, createShipmentRequest} = require('./handlers/order-handler')

module.exports = cds.service.impl(function () {
    const { Customer, CustomerAddress, OrderHeader } = this.entities;
    //Default AddressManaging
    //Notes:Whenever user try to create,update the the details if isDefault true means flag the other address as false
    this.before(['CREATE', 'UPDATE'], CustomerAddress,newAddress)
    //if totalAmt invalid or order not placed by existing customer,or invalid shipping address means error
    this.before(['CREATE','UPDATE'], OrderHeader, validateOrderHeader);

    //prevent deleting customer with orders
    this.before('DELETE', Customer,preventCustomerDeleteWithOrders )


    //actions
    //DefaultAddressMarking
    this.on('setDefaultAddress',setDefaultAddress);
    this.on('placeOrder',placeOrder);
    this.on('createShipment',createShipmentRequest)
})


