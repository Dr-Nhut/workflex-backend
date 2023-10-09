const authRouter = require("./auth.route");
const categoryRouter = require("./category.route");
const skillRouter = require("./skill.route");

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/skill', skillRouter);
}

module.exports = route;