const authRouter = require("./auth.route");
const categoryRouter = require("./category.route");
const skillRouter = require("./skill.route");
const jobRouter = require("./job.route");
const offerRoute = require("./offer.route");
const contractRoute = require("./contract.route");
const adminRouter = require("./admin.route");
const stripeRouter = require("./stripe.route");
const taskRouter = require("./task.route");
const paymentRouter = require("./payment.route");
const evaluationRouter = require("./evaluation.route");
const notificationRouter = require("./notification.route");
const userRouter = require("./user.route");
const recommendationRouter = require("./recommendation.router");

function route(app) {
    app.use('/api/user', userRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/skill', skillRouter);
    app.use('/api/job', jobRouter);
    app.use('/api/offer', offerRoute);
    app.use('/api/contract', contractRoute);
    app.use('/api/task', taskRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/stripe', stripeRouter);
    app.use('/api/payment', paymentRouter);
    app.use('/api/evaluation', evaluationRouter);
    app.use('/api/notification', notificationRouter);
    app.use('/api/recommendation', recommendationRouter);
}

module.exports = route;