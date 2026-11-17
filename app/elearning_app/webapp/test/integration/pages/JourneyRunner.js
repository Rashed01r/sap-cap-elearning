sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"elearningapp/test/integration/pages/CatagoriesList.gen",
	"elearningapp/test/integration/pages/CatagoriesObjectPage.gen",
	"elearningapp/test/integration/pages/CoursesObjectPage.gen"
], function (JourneyRunner, CatagoriesListGenerated, CatagoriesObjectPageGenerated, CoursesObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('elearningapp') + '/test/flp.html#app-preview',
        pages: {
			onTheCatagoriesListGenerated: CatagoriesListGenerated,
			onTheCatagoriesObjectPageGenerated: CatagoriesObjectPageGenerated,
			onTheCoursesObjectPageGenerated: CoursesObjectPageGenerated
        },
        async: true
    });

    return runner;
});

