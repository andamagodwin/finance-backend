import multer from 'multer';
import path from 'path';

// Configure multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'), // Change this to your uploads folder
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save with original name or generate a unique name
    },
});

export const upload = multer({ storage });
