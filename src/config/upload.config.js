const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, res) {
        res(null, "public/uploads/tasks");
    },
    filename: function (req, file, res) {
        res(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

module.exports = upload;