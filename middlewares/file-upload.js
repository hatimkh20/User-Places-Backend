const multer  = require('multer')
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/images")
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype]
        const uniqueSuffix = uuidv4();
        
        cb(null, uniqueSuffix + '.' + ext )
    }
})

const fileUpload = multer({
    limits: 500000,
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isValid ? null : new Error('Invalid mime type')
        cb(error, isValid)   
    }
})

module.exports = fileUpload;
