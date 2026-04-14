namespace service.srv;
using myapp.db as db from '../db/schema';

service Exercise1{
    entity Customer as projection on db.Customer;
    entity Order as projection on db.Order;
    entity OrderItem as projection on db.OrderItem;
}