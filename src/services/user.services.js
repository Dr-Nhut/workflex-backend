const { User } = require('../../models');

const findUserByEmail = async ({ email, withPassword = false }) => {
    if (withPassword) {
        return await User.scope('withPassword').findOne({
            where: {
                email
            },
        });
    }
    return await User.findOne({
        where: {
            email
        },
    });
}

module.exports = { findUserByEmail }