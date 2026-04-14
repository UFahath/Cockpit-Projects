using VehicleManagementService as service from '../../srv/service';

annotate service.Vehicles with @(
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'vehicleId',
                Value: vehicleId,
            },
            {
                $Type: 'UI.DataField',
                Label: 'modelName',
                Value: modelName,
            },
            {
                $Type: 'UI.DataField',
                Label: 'vehicleStatus',
                Value: vehicleStatus,
            },
            {
                $Type: 'UI.DataField',
                Label: 'oldPrice',
                Value: oldPrice,
            },
            {
                $Type: 'UI.DataField',
                Label: 'newPrice',
                Value: newPrice,
            },
            {
                $Type: 'UI.DataField',
                Label: 'dealer_ID',
                Value: dealer_ID,
            },
            {
                $Type: 'UI.DataField',
                Label: 'state_ID',
                Value: state_ID,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: 'vehicleId',
            Value: vehicleId,
        },
        {
            $Type: 'UI.DataField',
            Label: 'name',
            Value: modelName,
        },
        {
            $Type: 'UI.DataField',
            Label: 'vehicleStatus',
            Value: vehicleStatus,
        },
        {
            $Type: 'UI.DataField',
            Label: 'oldPrice',
            Value: oldPrice,
        },
        {
            $Type: 'UI.DataField',
            Label: 'newPrice',
            Value: newPrice,
        },
        {
            $Type                 : 'UI.DataFieldForAction',
            Action                : 'VehicleManagementService.reserveVehicle',
            Label                 : 'Reserve',
            Inline                : true,
            @UI.OperationAvailable: isReservable
        }
    ],
);

// annotate service.Vehicles with @(
//   Common.SideEffects: {
//     TargetProperties: ['vehicleStatus', 'isReservable'],
//     TriggerAction: 'VehicleManagementService.reserveVehicle'
//   }
// );

// annotate service.Vehicles with @(

// );

annotate service.Vehicles with {
    state @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'States',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: state_ID,
                ValueListProperty: 'ID',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'stateCode',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'tax',
            },
        ],
    }
};
