using {myapp.incidents as db} from '../db/imsdb';

//Support ticket handling
service SupportService {
   entity Incident as projection on db.Incidents actions{
         action resolveIncident(ID:UUID)
   }
   @readonly
   entity Customers as projection on db.Customers;
}

annotate SupportService.Incident with @odata.draft.enabled;
annotate SupportService with @(requires:'support');

//Admin
service AdminService{
   entity Incident as projection on db.Incidents;
   entity Customers as projection on db.Customers;
}


annotate AdminService with @(requires:'admin');






