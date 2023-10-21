const authRouter = require("./auth.route");
const categoryRouter = require("./category.route");
const skillRouter = require("./skill.route");
const jobRouter = require("./job.route");
const offerController = require("./offer.route");
const adminRouter = require("./admin.route");

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/skill', skillRouter);
    app.use('/api/job', jobRouter);
    app.use('/api/offer', offerController);
    app.use('/api/admin', adminRouter);
}

module.exports = route;