sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ns/incidents/test/integration/pages/IncidentList",
	"ns/incidents/test/integration/pages/IncidentObjectPage"
], function (JourneyRunner, IncidentList, IncidentObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ns/incidents') + '/test/flp.html#app-preview',
        pages: {
			onTheIncidentList: IncidentList,
			onTheIncidentObjectPage: IncidentObjectPage
        },
        async: true
    });

    return runner;
});

