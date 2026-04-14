module.exports = cds.service.impl(function () {
    const { Student, Course } = this.entities;

    this.before('CREATE', Student, async (req) => {
        const { courses } = req.data;

        // Validate at least one course
        if (!courses || courses.length === 0) {
            return req.error(400, "At least one course required");
        }

        for (let item of courses) {

            // Check course exists
            if (!item.course || !item.course.ID) {
                return req.error(400, "Course ID is required");
            }

            const courseExists = await SELECT.one.from(Course).where({ ID: item.course.ID });

            if (!courseExists) {
                return req.error(404, "Invalid Course ID");
            }

            // Default values
            item.enrollmentDate = new Date();
            item.status = item.status || 'PENDING';
        }
    });

});