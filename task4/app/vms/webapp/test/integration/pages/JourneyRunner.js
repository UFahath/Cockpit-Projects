sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"vms/test/integration/pages/VehiclesList",
	"vms/test/integration/pages/VehiclesObjectPage"
], function (JourneyRunner, VehiclesList, VehiclesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('vms') + '/test/flp.html#app-preview',
        pages: {
			onTheVehiclesList: VehiclesList,
			onTheVehiclesObjectPage: VehiclesObjectPage
        },
        async: true
    });

    return runner;
});

