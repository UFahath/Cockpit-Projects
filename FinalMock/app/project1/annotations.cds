using MyService as service from '../../srv/service';
annotate service.Employees with @(
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
                Label : 'name',
                Value : name,
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
    ],
    UI.LineItem: [
          {
                $Type : 'UI.DataField',
                Label : 'ID',
                Value : ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'name',
                Value : name,
            },
          {
            $Type:'UI.DataField',
            Value:name,
            Label:'Name'
        },
        {
            $Type:'UI.DataFieldForAction',
            Action:'MyService.EntityContainer/dummyInput',
            Label:'Dummy Button'
        },
        {  
             $Type:'UI.DataFieldForAction',
             Action:'MyService.getTotalEmployee',
             Inline:true,
             Label:'Get Total Employee'
         }
        
    ]
);

annotate service.Employees with {
    laptop @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Laptop',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : laptop_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'laptopName',
            },
        ],
    }
};

