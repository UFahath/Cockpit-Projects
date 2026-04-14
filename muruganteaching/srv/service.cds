// using {myapp.db.Student as s ,myapp.db.Course as c} from '../db/schema';
using {myapp.db.Order,myapp.db.OrderItem} from '../db/schema'
service MyService{
    entity student as projection on s;
    entity course as projection on c;
}