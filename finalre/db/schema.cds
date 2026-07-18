namespace myapp.db;

entity Customer{
    key id:String;
    customerName:String(30);
    // @readonly
    emailAddress:String @assert.format:'^[^\s@]+@[^\s@]+\.[^\s@]+$';
    birthDate : Date @assert.range:['1999-10-01','2026-10-01'];
    order : Association to Order;
    addresses:Composition of many Address on addresses.customer = $self;
   
}

 @cds.autoexpose
entity Address{
    key id:String;
    @title:'Address'
    address:String @mandatory;
    customer:Association to Customer not null @assert.target;
}

entity Order{
    key id:String;
    productName:String;
}