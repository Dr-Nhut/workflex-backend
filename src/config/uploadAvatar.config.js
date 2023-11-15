const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, res) {
        res(null, "public/uploads/avatar");
    },
    filename: function (req, file, res) {
        res(null, file.originalname);
    },
});
const uploadAvatar = multer({ storage: storage });

module.exports = uploadAvatar;