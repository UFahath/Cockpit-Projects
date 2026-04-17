using {ordersapp.db as db} from '../db/schema1';


service OrdersService{
    entity Orders as projection on db.Order;
}