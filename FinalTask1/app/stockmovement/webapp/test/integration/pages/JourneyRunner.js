sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"stockmovement/test/integration/pages/StockMovementsList",
	"stockmovement/test/integration/pages/StockMovementsObjectPage"
], function (JourneyRunner, StockMovementsList, StockMovementsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('stockmovement') + '/test/flp.html#app-preview',
        pages: {
			onTheStockMovementsList: StockMovementsList,
			onTheStockMovementsObjectPage: StockMovementsObjectPage
        },
        async: true
    });

    return runner;
});

