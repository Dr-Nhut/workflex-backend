const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, res) {
        res(null, "public/uploads/avatar");
    },
    filename: function (req, file, res) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        res(null, file.originalname + '-' + uniqueSuffix);
    },
});
const uploadAvatar = multer({ storage: storage });

module.exports = uploadAvatar;