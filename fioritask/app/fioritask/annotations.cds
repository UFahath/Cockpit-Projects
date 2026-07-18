using LeaveRequestService as service from '../../srv/leaveReqService';

annotate service.Employees with @(
    UI.LineItem:[
        {
            $Type:'UI.DataField',
            Label:'name',
            Value:name
        }
    ]
 ) ;
