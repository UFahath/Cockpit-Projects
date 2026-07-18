using {myapp.db as db} from '../db/schema';

service MyService {
    @odata.draft.enabled:true
    entity Order as projection on db.Order;
    entity OrderItem as projection on db.OrderItems;

}