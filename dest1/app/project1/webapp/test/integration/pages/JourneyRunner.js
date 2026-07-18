sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"project1/test/integration/pages/SalesOrderHeaderList",
	"project1/test/integration/pages/SalesOrderHeaderObjectPage"
], function (JourneyRunner, SalesOrderHeaderList, SalesOrderHeaderObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('project1') + '/test/flp.html#app-preview',
        pages: {
			onTheSalesOrderHeaderList: SalesOrderHeaderList,
			onTheSalesOrderHeaderObjectPage: SalesOrderHeaderObjectPage
        },
        async: true
    });

    return runner;
});

