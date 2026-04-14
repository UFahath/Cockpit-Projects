using { 
    myapp.db.Customer, myapp.db.Dealer, myapp.db.State, myapp.db.Vehicle, myapp.db.SalesOrder, myapp.db.Configuration,myapp.db.Log 
} from '../db/schema';

service VehicleManagementService {
    entity Customers as projection on Customer;
    entity Dealers as projection on Dealer ;
  
  
    // @odata.draft.enabled
     entity Vehicles as projection on Vehicle actions{
           //Reserve Vehicle
         action reserveVehicle();
     };
    entity States as projection on State;
    entity Orders as projection on SalesOrder ;
    entity Configurations as projection on Configuration ;
    entity Logs as projection on Log ;

    entity StateIds as select from States{
        ID as stateID
    }
    entity vehicleIds as select from Vehicles{
        vehicleId
    };

   function getCoordinates(state: String) returns Array of {
        district: String;
        latitude: Decimal;
        longitude: Decimal;
    };


 

}


annotate VehicleManagementService.Vehicles with actions {
    reserveVehicle @Common.SideEffects: {
        TargetProperties: ['vehicleStatus'],
        TargetEntities: ['']
    };
};


// annotate myapp.Vehicles with @(UI:{
//     HeaderInfo :{
        
//     }

