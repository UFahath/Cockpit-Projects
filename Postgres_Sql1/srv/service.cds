using{myapp.db as db} from '../db/schema';


service Test{
    entity Dummy1 as projection on db.Dummy;
}