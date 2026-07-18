using MovementService as service from '../../srv/movement-service';

annotate service.StockMovements with @(
    UI.HeaderInfo                   : {
        Title         : {Value: 'Stock Movements'},
        //   Description:{Value:withoutSymbol},
        TypeImageUrl  : 'sap-icon://shipping-status',
        TypeName      : 'Stock Movement',
        TypeNamePlural: 'Stock Movements'
    },
    UI.DataPoint #WarehouseName     : {
        Value      : withoutSymbol,
        Criticality: goodsCriticality,
       
    },
    UI.DataPoint #TotalMovementToday: {
        Value      : totalMovementToday,
        Title      : 'TotalMovementsToday',
        Criticality: goodsCriticality
    },
    UI.DataPoint #WeatherCondition  : {
        Title      : 'Weather condition',
        Value      : weatherCondition,
        Criticality: weatherConditionCriticality
    },

    // UI.PresentationVariant #Default: {
    //   $Type         : 'UI.PresentationVariantType',
    //   Visualizations: ['@UI.LineItem']
    // },


    UI.KPI #TotalMovementKPI        : {
        DataPoint       : ![@UI.DataPoint#TotalMovementToday],
        SelectionVariant: {
            $Type        : 'UI.SelectionVariantType',
            SelectOptions: []
        }
    },
    UI.FieldGroup #WeatherImpact    : {Data: [
        {
            $Type: 'UI.DataFieldWithUrl',
            Value: weatherIcon
        },
        // {
        //     $Type:'UI.DataField',
        //     Label:'Weather condition',
        //     Value:'Sunny'
        // },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target: '@UI.DataPoint#WeatherCondition'
        },
        {
            $Type: 'UI.DataField',
            Label: 'Impact',
            Value: impact
        }
    ]},
    UI.HeaderFacets                 : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Warehouse Name',
            Target: '@UI.DataPoint#WarehouseName'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'quantity',
            Target: '@UI.DataPoint#TotalMovementToday'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'WeatherImpact',
            Target: '@UI.FieldGroup#WeatherImpact'
        }
    ],
    UI.FieldGroup #GeneratedGroup   : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type          : 'UI.DataField',
                Label          : 'Movement Type',
                Value          : movementType_type,
                @UI.Placeholder: 'Select Movement',
                @HTML5.CssDefaults:{width:'20px'},
            },
            {
                $Type: 'UI.DataField',
                Label: 'Product Name',
                Value: product_ID
            },
            {
                $Type: 'UI.DataField',
                Label: 'Quantity',
                Value: quantity,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Movement Date',
                Value: movementDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Warehouse Name',
                Value: fromWarehouse_ID,
            // @UI.CreateHidden:true
            }
        ],
    },
    UI.FieldGroup #WarehouseInfo    : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'Source Warehouse',
                Value: fromWarehouseDisplay
            },
            {
                $Type: 'UI.DataField',
                Label: 'Warehouse Location',
                Value: whouseName
            }
        ]
    },

    UI.FieldGroup #StockImpact      : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type      : 'UI.DataField',
                Label      : 'Stock After Transaction',
                Value      : Movement,
                Criticality: impactType,

            },
            {
                $Type: 'UI.DataField',
                Label: 'Previous Stock',
                Value: currentStock
            },
        //  {
        //     $Type:'UI.DataField',
        //     Label:'Previous Stock',
        //     Value: previousStock
        //  }
        ]
    },
    // UI.DataPoint #StockImpact:{
    //             Title:'Movement',
    //             Value:Movement,
    //             Criticality:impactType,
    //             Importance:#High
    //           },
    // UI.DataPoint #CurrentStock:{
    //        Title:'Current Stock'
    // },
    UI.Facets                       : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : 'General Information',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Warehouse Info',
            Target: '@UI.FieldGroup#WarehouseInfo'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Stock Impact',
            Target: '@UI.FieldGroup#StockImpact'
        }
    ],
    UI.LineItem                     : [
        {
            $Type : 'UI.DataFieldForAction',
            Label : 'Goods Receipt',
            Action: 'MovementService.EntityContainer/goodsReceipt'
        },
        {
          $Type:'UI.DataFieldForAction',
          Label:'getNotify',
          Action:'MovementService.EntityContainer/alertCheck'
        },
        {
            $Type: 'UI.DataField',
            Label: 'Product Name',
            Value: product.productName
        },
        {
            $Type: 'UI.DataField',
            Label: 'Warehouse Location',
            Value: whouseName
        },
        {
            $Type                    : 'UI.DataField',
            Label                    : 'Movement Type',
            Value                    : movementType_type,
            Criticality              : goodsCriticality,
            CriticalityRepresentation: #WithoutIcon,
            @UI.Criticality          : goodsCriticality
        },
        {
            $Type: 'UI.DataField',
            Label: 'Quantity',
            Value: quantity,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Date',
            Value: movementDate,
        },
    ],
);

@UI.SelectionFields:[movementType_type]
annotate service.StockMovements with {
    weatherIcon @(UI.IsImageURL: true);
};

annotate service.StockMovements with {
    product @Common.Text:product.productName;
    product @Common.TextArrangement:#TextOnly;
    product      @Common.ValueList               : {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'Product',
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: product_ID,
            ValueListProperty: 'ID',
        },
        {
            $Type:'Common.ValueListParameterDisplayOnly',
            ValueListProperty:'productName'
        }],
    };
    movementType @Common.ValueListWithFixedValues: true;
    movementType @Common.ShowValuesImmediately: true;
    movementType @Common.Label:'Movement Type';
    quantity     @(
        Common.FieldControl: #Mandatory,
        UI.Placeholder     : 'Enter Quantity',
    );
    product      @Common.ValueListWithFixedValues: true;
    product      @Common.ShowValuesImmediately   : true;
    product      @UI.Placeholder:'Select a Product';
    fromWarehouse @Common.ValueList :{
        $Type:'Common.ValueListType',
        CollectionPath:'Warehouse',
        Parameters:[
            {
                $Type:'Common.ValueListParameterInOut',
                LocalDataProperty:fromWarehouse_ID,
                ValueListProperty:'ID'
            },
            {
                $Type:'Common.ValueListParameterDisplayOnly',
                ValueListProperty:'warehouseName'
            }
        ]
    };
    fromWarehouse @Common.ValueListWithFixedValues:true;
    fromWarehouse @Common.ShowValuesImmediately:true;
    fromWarehouse @Common.Text:fromWarehouse.warehouseName;
    fromWarehouse @Common.TextArrangement:#TextOnly;
    fromWarehouse @UI.Placeholder:'Select Warehouse';
    whouseName @Core.Computed;
    
}

annotate service.StockMovements with {
  movementType @Common.SideEffects: {
    TargetProperties: [whouseName]
  };
};

