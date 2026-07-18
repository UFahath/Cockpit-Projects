sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"project1/test/integration/pages/OrderList",
	"project1/test/integration/pages/OrderObjectPage"
], function (JourneyRunner, OrderList, OrderObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('project1') + '/test/flp.html#app-preview',
        pages: {
			onTheOrderList: OrderList,
			onTheOrderObjectPage: OrderObjectPage
        },
        async: true
    });

    return runner;
});

