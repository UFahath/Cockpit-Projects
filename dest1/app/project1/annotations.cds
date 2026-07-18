using MyService as service from '../../srv/service';
annotate service.SalesOrderHeader with @(
    UI.HeaderInfo:{
       TypeName:'SalerOrder',
       TypeNamePlural:'SalesOrders',
       Title:{Value:'SalesOrderObjectPage'},
       Description:{Value:'This is Dummy Page'},
       TypeImageUrl:'sap-icon://alert'
    },
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrder',
                Value : SalesOrder,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SoldToParty',
                Value : SoldToParty,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrderDate',
                Value : SalesOrderDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TotalNetAmount',
                Value : TotalNetAmount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TransactionCurrency',
                Value : TransactionCurrency,
            },
        ],
    },
    UI.DataPoint:{
         Title:'Total Sales',
         Value:TotalSales,
         Criticality:MyCriticality
    },
    UI.HeaderFacets:[
          {
           $Type:'UI.ReferenceFacet',
           Label:'Total Sales',
           Target:'@UI.DataPoint'
         }
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'SalesOrder',
            Value : SalesOrder,
        },
        {
            $Type : 'UI.DataField',
            Label : 'SoldToParty',
            Value : SoldToParty,
        },
        {
            $Type : 'UI.DataField',
            Label : 'SalesOrderDate',
            Value : SalesOrderDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'TotalNetAmount',
            Value : TotalNetAmount,
            Criticality:MyCriticality
        },
        {
            $Type : 'UI.DataField',
            Label : 'TransactionCurrency',
            Value : TransactionCurrency,
        },
        {
            $Type:'UI.DataFieldForAction',
            Label:'Create Sales Order',
            Action:'MyService.EntityContainer/createSalesOrder',
            // @UI.Hidden:true
        },
        {
            $Type:'UI.DataFieldForAction',
            Label:'CriticalityChecker',
            Action:'MyService.EntityContainer/applyCriticality'
        }
    ],
    UI.SelectionFields:[SalesOrder]
);


annotate service.SalesOrderHeader with {
    SalesOrder @(
        Common.ValueList:{
        $Type:'Common.ValueListType',
        CollectionPath:'SalesOrderView',
        Parameters:[
            {
                $Type:'Common.ValueListParameterInOut',
                LocalDataProperty:SalesOrder,
                ValueListProperty:'SalesOrder'
            },
        ],
    },
    Common.ValueListWithFixedValues : true,
    );
}


annotate service.SalesOrderHeader with @(
    UI.PresentationVariant:{
        Visualizations:['@UI.LineItem'],
        MaxItems:2
    })


