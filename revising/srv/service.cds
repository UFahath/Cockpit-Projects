using {myapp.db as db} from '../db/schema';


service MyService @(path:'Murugan'){
    entity TypeTest as projection on db.TypeTest;
}