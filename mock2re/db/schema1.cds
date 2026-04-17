namespace ordersapp.db;


type Status:String enum{
    APPROVED = 'approved';
    REJECTED = 'rejected'
}
entity Order{
    key ID:String;
    orderDate:Date;
    orderStatus:Status @assert.range:['approved','rejected'];
}