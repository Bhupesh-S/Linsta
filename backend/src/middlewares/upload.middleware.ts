// Multer middleware for file uploads
import multer from 'multer';

// Configure multer to store files in memory as buffers
const storage = multer.memoryStorage();

// File filter to accept only images and videos
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});
