namespace services.srv;
using {my.oms as db} from '../db/schema';


service OrderManagement {
     entity Customer as projection on db.Customer;
     entity CustomerAddress as projection on db.CustomerAddress;
     entity OrderHeader as projection on db.OrderHeader;
     entity OrderDetail as projection on db.OrderDetail;
     entity Product as projection on db.Product;
     entity ProductCategory as projection on db.ProductCategory;
     entity SupplierProduct as projection on db.SupplierProduct;
     entity Inventory as projection on db.Inventory;
     entity Shipping as projection on db.Shipping;
     
     action setDefaultAddress(addressID:UUID,customerID:UUID) returns Boolean;
     action placeOrder(customerID:UUID,productID:UUID,quantity:Integer,addressID:UUID);
     action createShipment(orderId:UUID,shipmentStatus:String,addressID:UUID);
}