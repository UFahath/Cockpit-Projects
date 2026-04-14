namespace myapp.db;

using {managed} from '@sap/cds/common';

// using { PaymentMethod } from '../externalSchema.cds';
entity Admin {
    key adminId         : String;
        username        : String;
        email           : String;
        password        : String;
        status          : String;
        createdAt       : Timestamp;
        lastLogin       : Timestamp;
        approvedVehicle : Association to many Vehicle
                              on approvedVehicle.approvedBy_adminId = adminId;
}

entity Vehicle : managed {
    key     vehicleId          : String;
            modelName          : String;
            currentPrice       : Decimal(10, 2);
            oldPrice           : Decimal(10, 2);
            vehicleStatus      : String default 'Pending';
            state              : Association to State; 
            stateName          : String;
            vehicleNumber      : String default 'Not Yet Approved';
            dealer             : Association to Dealer;
            orders             : Composition of many Order
                                     on orders.vehicleRef = $self;
            approvedBy_adminId : String;
            approvedBy         : Association to one Admin
                                     on approvedBy.adminId = approvedBy_adminId;
}

entity State {
    key stateCode     : String;
        stateName     : String;
        taxPercentage : Decimal(5, 2);
}

entity Dealer {
    key dealerId             : String;
        dealerName           : String;
        location             : String;
        dealerApprovalStatus : String default 'Pending';
        vehicle              : Association to many Vehicle
                                   on vehicle.dealer = $self;
}

entity Customer : managed {
    key customerId  : String;
        firstName   : String;
        lastName    : String;
        email       : String;
        phoneNumber : String;
        status      : String default 'Active';
        createdAt   : Timestamp;
        lastLogin   : Timestamp;
        orders      : Association to many Order
                          on orders.customer = $self;
}

entity Order {
    key orderId     : String;
        quantity    : Integer;
        orderStatus : String default 'PENDING';
        vehicleRef  : Association to Vehicle;
        customer    : Association to Customer;
        items       : Composition of many OrderItem
                          on items.orderRef = $self;
}

entity OrderItem : managed {
    key orderItemId : String;
        orderRef    : Association to Order;
        vehicleRef  : Association to Vehicle;
        quantity    : Integer;
        price       : Decimal(10, 2);
}

entity Notification {
    key id        : UUID;
        vehicle   : Association to Vehicle;
        dealer    : Association to Dealer;
        message   : String;
        createdAt : DateTime;
}
