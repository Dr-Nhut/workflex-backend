const authRouter = require("./auth.route");
const categoryRouter = require("./category.route");
const skillRouter = require("./skill.route");
const jobRouter = require("./job.route");
const offerRoute = require("./offer.route");
const contractRoute = require("./contract.route");
const adminRouter = require("./admin.route");
const taskRouter = require("./task.route");

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/skill', skillRouter);
    app.use('/api/job', jobRouter);
    app.use('/api/offer', offerRoute);
    app.use('/api/contract', contractRoute);
    app.use('/api/task', taskRouter);
    app.use('/api/admin', adminRouter);
}

module.exports = route;