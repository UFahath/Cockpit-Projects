using {myapp.db as db} from '../db/schema';

service Myservice{
    entity Client as projection on db.Client;
    entity TypeProjection as projection on db.TypeProjection;
}