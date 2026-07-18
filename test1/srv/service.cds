using {myapp.db as db} from '../db/schema';


service dummy{
    entity Test as projection on db.Dummy{
        id
    }
}



