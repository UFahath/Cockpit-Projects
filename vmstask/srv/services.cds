namespace services.srv;

using {myapp.db as db} from '../db/schema';
// using {externalAPI.db as external} from '../db/externalSchema';
service VMS {
    entity Admin as projection on db.Admin;
    entity Vehicles as projection on db.Vehicle {
                            * ,
                           stateName : String @cds.persistence.skip} 
                           actions{
         action approveVehicle(vehicleId:String);
          action notifyDealer(vehicleId: String, dealer_dealerId: String);
    };
    entity State as projection on db.State;
    // entity VehicleSummary  as (
    // select from db.Vehicle as v
    // where v.vehicleStatus = 'approved'
    // {
    //     v.modelName,
    //     v.price,
    //     v.vehicleStatus,
    //     v.state,
    //     v.vehicleNumber
    // }
    // );
   
    entity VehicleID as select from Vehicles{
      vehicleId
    }
    entity StateID as select from State{
        stateCode
    }
    entity Customers as projection on db.Customer;
    entity Dealers as projection on db.Dealer;
    entity Orders as projection on db.Order;
    entity OrderItems as projection on db.OrderItem;
    entity Notifications as projection on db.Notification;

    function getTotalOrderValue(vehicleId:String) returns Integer;
}


// service External{
//     entity PaymentMethod as projection on external.PaymentMethod;
// }


