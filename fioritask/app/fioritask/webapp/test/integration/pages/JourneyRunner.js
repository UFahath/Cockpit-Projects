sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"fioritask/test/integration/pages/EmployeesList",
	"fioritask/test/integration/pages/EmployeesObjectPage",
	"fioritask/test/integration/pages/LeaveRequestObjectPage"
], function (JourneyRunner, EmployeesList, EmployeesObjectPage, LeaveRequestObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('fioritask') + '/test/flpSandbox.html#fioritask-tile',
        pages: {
			onTheEmployeesList: EmployeesList,
			onTheEmployeesObjectPage: EmployeesObjectPage,
			onTheLeaveRequestObjectPage: LeaveRequestObjectPage
        },
        async: true
    });

    return runner;
});

