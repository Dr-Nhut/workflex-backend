'use strict';
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../core/error.response');
const mailer = require('../utils/mailer');

class MailServices {
  static async send({ email }) {
    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

    if (!emailRegex.test(email)) {
      throw new BadRequestError('Email không hợp lệ.')
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      throw new BadRequestError('Email đã tồn tại.');
    }

    bcrypt.hash(email, 12, async function (err, hash) {
      if (err) throw new BadRequestError('Lỗi hash email');
      try {
        await mailer.sendMail(email, 'Xác thực Email đăng ký tài khoản Work Flex', `<p>Vui lòng nhấn vào đường dẫn đính kèm để xác thực email của bạn, <a href="${process.env.FE_URL}/verify-email?email=${email}&token=${hash}">Chính là tôi</a ></p >`)

        return;
      } catch (err) {
        console.error(err);
        throw new BadRequestError('Đã xảy ra lỗi khi gửi email. Vui lòng thử lại!')
      }
    });
  }
}

module.exports = MailServices;