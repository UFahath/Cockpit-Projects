using {externalAPI.db as external} from '../db/externalSchema';


service External{
    entity PaymentMethod as projection on external.Customer;
}
