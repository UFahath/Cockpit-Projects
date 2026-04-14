using { myapp.db as db } from '../db/schema';

service MyService {
@odata.draft.enabled
  entity Orders as projection on db.Orders;
  function getWithDrafts() returns array of Orders
}

