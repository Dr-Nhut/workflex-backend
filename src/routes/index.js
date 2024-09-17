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
const feedbackRouter = require("./feedback.route");
const notificationRouter = require("./notification.route");
const userRouter = require("./user.route");
const recommendationRouter = require("./recommendation.router");
const permissionRouter = require("./permission.router");
const roleRouter = require("./role.router");
const apiKey = require("../middlewares/apiKey");
const checkPemission = require("../middlewares/checkPermission");
const { catchAsyncError } = require('../utils/catchAsyncError');

function route(app) {
    // app.use(catchAsyncError(apiKey));
    // app.use(catchAsyncError(checkPemission('0000'))); // permission for api key
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
    app.use('/api/feedback', feedbackRouter);
    app.use('/api/notification', notificationRouter);
    app.use('/api/recommendation', recommendationRouter);
    app.use('/api/permission', permissionRouter);
    app.use('/api/role', roleRouter);
}

module.exports = route;