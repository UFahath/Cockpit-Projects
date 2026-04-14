//


namespace myapp.db;

using {cuid} from '@sap/cds/common.cds';

entity Customer : cuid {
    name  : String;
    email : String(255);
    order : Association to many Order
                on order.customer = $self;
}

entity Order {
    key ID          : UUID;
        orderDate   : Date;
        totalAmount : Decimal(4, 2);
        status      : Boolean;
        customer:Association to Customer;
        orderItem   : Composition of many OrderItem
                          on orderItem.ID = $self.ID;
}

entity OrderItem : cuid {
    productName : String;
    quantity    : String;
    price       : Decimal(4, 2);
}
