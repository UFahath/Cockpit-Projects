namespace services.srv;

using { my.app as db } from '../db/schema';

service MyBooks {
  action applyDiscountToAll(percentage:Integer) returns String;
  entity Books as projection on db.Books;

}