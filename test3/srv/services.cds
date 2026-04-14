namespace services.srv;
using {my.app as db} from '../db/schema';

service  BookService {
    entity Books as projection on db.Books;
}