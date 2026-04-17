// using {myapp.db.Student as s ,myapp.db.Course as c} from '../db/schema';
using {myapp.db as db} from '../db/schema';
@impl:'./service.js'
service MyService{
   // entity Users as projection on User;
   // entity Profiles as projection on db.Profile;
   entity Products as projection on db.Product;
   entity Orders as projection on db.Order;
}


