const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

const User = require('../models/User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.uid;
    const documentType = req.body.documentType;
    const folderName = `uploads/documents/${userId}/${documentType}`;
    
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }

    cb(null, folderName);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.put('/:uid/premium', async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await User.findById(userId);

    if (
      user.documents.some(
        (document) =>
          document.name === 'Identificación' ||
          document.name === 'Comprobante de domicilio' ||
          document.name === 'Comprobante de estado de cuenta'
      )
    ) {
      user.isPremium = true;
      await user.save();
      res.json({ status: 'success', message: 'Usuario actualizado a premium.' });
    } else {
      res.status(400).json({ status: 'error', message: 'El usuario no ha terminado de cargar su documentación.' });
    }
  } catch (error) {
    console.error('Error al actualizar a premium:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar a premium.' });
  }
});

router.post('/:uid/documents', upload.array('documents', 5), async (req, res) => {
  try {
    const userId = req.params.uid;
    const uploadedFiles = req.files;

    res.json({ status: 'success', message: 'Documentos subidos exitosamente.' });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).json({ status: 'error', message: 'Error al subir documentos.' });
  }
});

module.exports = router;


