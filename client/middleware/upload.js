import multer from 'multer'
import GridFsStorage from 'multer-gridfs-storage'

const storage = new GridFsStorage({
  url: process.env.DB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg']

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-img-${file.originalname}`
      return filename
    }
    return {
      bucketName: 'photo',
      filename: `${Date.now()}-img-${file.originalname}`,
    }
  },
})

export default multer({ storage })
