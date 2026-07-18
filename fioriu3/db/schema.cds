namespace myapp.db;

entity Order{
    key ID:UUID;
    orderNumber:String;
    items : Composition of one OrderItems;
}

entity OrderItems{
    key ID:UUID;
    name:String;
    // order:Association to Order;
}