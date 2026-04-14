namespace myapp.db;
using {managed} from '@sap/cds/common';

type status : String enum {
    ACTIVE   = 'active';
    INACTIVE = 'inactive';
}

type vehicleStatus : String enum {
    AVAILABLE = 'Available';
    RESERVED  = 'Reserved';
    SOLD      = 'Sold';
    DELIVERED = 'Delivered';
}

type orderType : String enum {
    MTS = 'MTS';
    MTO = 'MTO';
}

type orderStatus : String enum {
    CREATED    = 'Created';
    INPROCESS  = 'Inprocess';
    COMPLETED  = 'Completed';
}

entity Customer: managed {
    key customerId  : String;
        firstName   : String;
        lastName    : String;
        email       : String;
        phoneNumber : String;
        orders : Association to many SalesOrder
                    on orders.customer = $self;
}

entity Dealer:managed {
    key dealerId   : String;
        dealerName : String;
        location   : String;
        status     : status default 'ACTIVE';
        district:String;
        lat:Decimal;
        lon:Decimal;
        vehicles : Association to many Vehicle
                        on vehicles.dealer = $self;
}

entity State :managed{
    key ID        : String;
        name      : String;
        stateCode : String;
        tax       : Integer;
}

entity Vehicle:managed {
    key vehicleId     : String;
        modelName     : String;
        vehicleStatus : vehicleStatus default 'Available';
        isReservable  : Boolean default true;
        oldPrice      : Decimal(10, 2) default 0;
        newPrice      : Decimal(10, 2);
        dealer_ID    : String;
        dealer       : Association to Dealer
                           on dealer.dealerId = dealer_ID;  
        state  : Association to one State;   

        orders  : Composition of many SalesOrder
                    on orders.vehicleRef = $self; 

}

entity SalesOrder:managed {
    key orderId     : String;
        orderType   : orderType;
        orderStatus : orderStatus default 'Created';
        customer : Association to Customer; 
        vehicleRef  : Association to one Vehicle; 
        configuration : Composition of one Configuration
                            on configuration.order = $self; 
}

entity Configuration :managed {
    key configId   : String;
        modelName  : String;
        color      : String;
        engineType : String;

        order : Association to one SalesOrder;
}

entity Log:managed {
    key logId      : UUID;
        userId     : String;
        action     : String;
        entityName : String;
} 