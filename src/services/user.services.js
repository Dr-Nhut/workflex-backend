const { User } = require('../../models');
const cloudinary = require('../config/cloudinary.config')
const { BadRequestError } = require("../core/error.response")


class UserServices {
    static async findUserByEmail({ email, withPassword = false }) {
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

    static async updateAvatar({ userId, path }) {
        const uploadResult = await cloudinary.uploader
            .upload(path, {
                public_id: 'avatar',
                folder: `avatar/${userId}`,
                format: 'jpg',
            })
            .catch((error) => {
                throw new BadRequestError(error.message);
            });

        await User.update({ avatar: uploadResult.secure_url }, {
            where: { id: userId },
        })

        return {
            'avatarUrl': uploadResult.secure_url
        }
    }
}



module.exports = UserServices