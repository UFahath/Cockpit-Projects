namespace employee.db;

using {API_MANAGE_WORKFORCE_TIMESHEET as wf} from '../srv/external/API_MANAGE_WORKFORCE_TIMESHEET';


@cds.persistence.table
entity externalTimeSheet as projection on wf.TimeSheetEntryCollection{
       key TimeSheetRecord,
        key TimeSheetDate,
         CompanyCode,
         TimeSheetStatus,
       key  PersonWorkAgreementExternalID ,
         employee:Association to Employee on employee.ID = PersonWorkAgreementExternalID
}

entity Employee {
    key ID   : String;      
        Name : String;
        Dept : String;
        timesheet:Association to many externalTimeSheet on timesheet.PersonWorkAgreementExternalID=ID;
};
