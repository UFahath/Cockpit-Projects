using {myapp.db as db} from '../db/schema';

service MyService{
    entity SalesOrderHeader as projection on db.SalesOrderHeader ;
        function netWorth() returns Integer
}