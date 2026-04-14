namespace service.srv;
using {my.company as db} from '../db/schema.cds';
service Employees {
    entity PurchaseOrders as projection on db.PurchaseOrders;
    // entity emp as projection on db.Employees;
}