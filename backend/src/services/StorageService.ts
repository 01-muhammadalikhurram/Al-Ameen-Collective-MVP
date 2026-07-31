import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';
import { logger } from '../config/logger';

// Configure cloudinary globally using the CLOUDINARY_URL environment variable
// The SDK automatically picks up CLOUDINARY_URL if it's in process.env, but it's 
// safer to pass it explicitly from our validated config just in case.
cloudinary.config({
  cloudinary_url: config.CLOUDINARY_URL,
});

export class StorageService {
  /**
   * Uploads an image buffer directly to Cloudinary via a stream.
   * This avoids having to save the file to disk first.
   * 
   * @param fileBuffer The raw binary buffer from multer
   * @param originalName The original file name
   * @param folder The folder in Cloudinary to upload to
   * @returns The public URL of the uploaded image
   */
  async uploadImage(fileBuffer: Buffer, originalName: string, folder = 'al-ameen-products'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: `${Date.now()}-${originalName.replace(/\.[^/.]+$/, '')}`, // Strip extension for public_id
          resource_type: 'image',
          format: 'webp', // Automatically convert to WebP for optimization
          quality: 'auto', // Cloudinary automatic quality compression
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) {
            logger.error(error, 'Cloudinary upload failed');
            return reject(new Error('Failed to upload image'));
          }
          if (!result) {
            return reject(new Error('No result from Cloudinary'));
          }
          
          logger.info(`Uploaded image to Cloudinary: ${result.secure_url}`);
          resolve(result.secure_url);
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Deletes an image from Cloudinary using its URL
   */
  async deleteImage(url: string): Promise<void> {
    try {
      // Extract the public ID from the Cloudinary URL
      // E.g. https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/image_name.webp
      const parts = url.split('/');
      const lastPart = parts.pop();
      if (!lastPart) return;
      
      const fileName = lastPart.split('.')[0];
      const folder = parts.pop();
      
      if (!folder || !fileName) return;

      const publicId = `${folder}/${fileName}`;
      await cloudinary.uploader.destroy(publicId);
      logger.info(`Deleted image from Cloudinary: ${publicId}`);
    } catch (error) {
      logger.error(error, `Failed to delete image from Cloudinary: ${url}`);
    }
  }
}
