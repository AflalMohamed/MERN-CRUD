import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// 1. கோப்புகளை எங்கே, எப்படிச் சேமிப்பது என்பதற்கான விதிகள்
const storage = multer.diskStorage({
  // சேமிக்கப்படும் இடம் (Destination)
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    // நாம் ரூட் டைரக்டரியில் உருவாக்கிய 'uploads/' ஃபோல்டர்
    cb(null, 'uploads/');
  },
  
  // கோப்பின் பெயர் (Filename) - தனித்துவமான பெயர் (Unique Name)
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    // 1. அசல் பெயரின் extension-ஐ (e.g., .png, .jpg) பிரிக்கிறோம்
    const fileExt = path.extname(file.originalname);
    // 2. அசல் பெயரின் base-ஐ (e.g., 'profile') பிரிக்கிறோம்
    const fileName = file.originalname
      .replace(fileExt, '')
      .toLowerCase()
      .split(' ')
      .join('-'); // இடைவெளிகளை (spaces) '-' ஆக மாற்றுகிறோம்

    // 3. தனித்துவமான பெயரை உருவாக்குகிறோம்: 'filename-timestamp.ext'
    const uniqueName = `${fileName}-${Date.now()}${fileExt}`;
    
    cb(null, uniqueName);
  },
});

// 2. கோப்பு வடிகட்டி (File Filter) - படங்களை மட்டும் அனுமதித்தல்
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  // அனுமதிக்கப்பட்ட extensions
  const allowedTypes = /jpeg|jpg|png|gif/;
  
  // extension சரியாக உள்ளதா எனச் சோதிக்கிறது
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // mimetype (e.g., 'image/png') சரியாக உள்ளதா எனச் சோதிக்கிறது
  const mimeMatch = allowedTypes.test(file.mimetype);

  if (extMatch && mimeMatch) {
    // படம் என்றால், அனுமதி (accept)
    cb(null, true);
  } else {
    // படம் இல்லையென்றால், பிழையுடன் நிராகரி (reject)
    cb(new Error('Error: Only image files (.jpeg, .jpg, .png) are allowed!'), false);
  }
};

// 3. Multer middleware-ஐ உருவாக்குகிறோம்
const upload = multer({
  storage: storage,     // சேமிப்பு விதிகள்
  fileFilter: fileFilter, // வடிகட்டி விதிகள்
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB Limit
  }
});

export default upload;