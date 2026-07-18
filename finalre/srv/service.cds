using {myapp.db as db} from '../db/schema';


service MyService {
       
    entity Customer as projection on db.Customer;
   
  //  @odata.draft.enabled
  //   entity Address as projection on db.Address;
}

annotate MyService.Customer with @(
    UI.SelectionFields:[birthDate],
    
);


annotate MyService.Address with @(
    UI.Identification: [
  {
    $Type: 'UI.DataField',
    Value: id
  }
],


// UI.FieldGroup #Test: [
//   {
//     $Type: 'UI.DataField',
//     Value: id
//   }
// ],

//   UI.FieldGroup #GeneralInformation:[
//      {
//         $Type:'UI.DataField',
//         Label:'customerID',
//         Value:id
//     },
//     {
//         $Type:'UI.DataField',
//         Label:'Address',
//         Value:address
//     },
//     {
//         $Type:'UI.DataField',
//         Label:'Customer_ID',
//         Value:customer_id
//     }
//   ],

//   UI.Facets:[
//     {
//         $Type:'UI.ReferenceFacet',
//         Label:'General Information',
//         Target:'@com.sap.vocabularies.UI.v1.FieldGroup#Test'
//     }
//   ],
  UI.LineItem:[
    {
        $Type:'UI.DataField',
        Label:'customerID',
        Value:id
    },
    {
        $Type:'UI.DataField',
        Value:address
    },
    {
        $Type:'UI.DataField',
        Label:'Customer_ID',
        Value:customer_id
    }
  ]
);