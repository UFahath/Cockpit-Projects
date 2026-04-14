using {externalAPi.db as db} from '../db/external';

service MyService {
  
    entity EmailAddress as projection on db.EmailAddress;
    entity ExternalEmailAddress  as projection on db.ExternalEmailAddress;
  
}