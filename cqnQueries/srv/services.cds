namespace services.srv;
using {my.app.db as db} from '../db/schema';

service CatalogService{
    entity Authors as projection on db.Authors;
    entity Categories as projection on db.Categories;
    entity Books as projection on db.Books actions{
        action applyDiscount(percentage:Integer) returns String;
    };
    entity Orders as projection on db.Orders;
}