using Travel as service from '../../srv/empPasSrv';
annotate service.Employee with @(
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
            {
                $Type : 'UI.DataField',
                Label : 'email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'passport_ID',
                Value : passport_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'department_ID',
                Value : department_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'laptop_ID',
                Value : laptop_ID,
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
    UI.LineItem : [
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
            $Type : 'UI.DataField',
            Label : 'email',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Label : 'passport_ID',
            Value : passport_ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'department_ID',
            Value : department_ID,
        },
    ],
    UI.SelectionFields : [
        status,
        department_ID,
    ],
);

annotate service.Employee with {
    passport @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Passport',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : passport_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'number',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'country_code',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'employee_ID',
            },
        ],
    }
};

annotate service.Employee with {
    department @(
        Common.Label : 'Department',
        Common.Text : ID,
        Common.ExternalID : department.name,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Department',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : department_ID,
                    ValueListProperty : 'ID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
        )
};

annotate service.Employee with {
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
                ValueListProperty : 'brand',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'price',
            },
        ],
    }
};

annotate service.Employee with {
    status @(
        Common.Label : '{i18n>WorkingStatus}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Employee',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status,
                    ValueListProperty : 'status',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
        )
};

annotate service.Employee with {
    ID @Common.Text : status
};

annotate service.Department with {
    ID @Common.Text : name
};

annotate service.Department with {
    code @Common.Text : descr
};

annotate service.Department with {
    descr @Common.Text : ID
};

