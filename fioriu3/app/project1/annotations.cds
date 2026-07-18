using MyService as service from '../../srv/service';
annotate service.Order with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'ID',
                Value : ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'orderNumber',
                Value : orderNumber,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type:'UI.ReferenceFacet',
            ID:'DummyFacet',
            Label:'OrderItem Information',
            Target:'items/@UI.FieldGroup#Dummy1'
        }
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'ID',
            Value : ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'orderNumber',
            Value : orderNumber,
        },
    ],
);


annotate service.OrderItem with @(
    UI.FieldGroup #Dummy1:{
        Data:[
            {
                $Type:'UI.DataField',
                Value:ID
            },
            {
                $Type:'UI.DataField',
                Value:name
            }
        ]
    }
);




