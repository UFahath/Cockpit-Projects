using {myapp.db as db} from '../db/OrderSchema';


service SalesOrder{
    entity Order @(restrict:
    [
        {
            grant:['READ'],
            to:['RiskViewer']
        },
        {
            grant:['*'],
            to:['RiskManager']
        }
    ]) as projection on db.Order;
}