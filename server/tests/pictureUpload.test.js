import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/config/serverConfig.js';
import path from 'path';
import fs from 'mz/fs';

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Picture Upload', () => {

  // 1. Test for validating the uploaded image:
  //    - Verify that an error is returned if no file is provided.
  //    - Verify that an error is returned if the file format is not supported (e.g., other than PNG or JPG).
  //    - Verify that the MIME type and extension match (e.g., image/png or image/jpeg).
  it('should return an error if no file is provided', async () => {
    const response = await request(app)
      .post('/api/pictures/upload')
      .expect(400);

    expect(response.body.error).toBe('No file provided');
  });

  it('should return an error if the file format is not supported', async () => {
    const response = await request(app)
      .post('/api/pictures/upload')
      .attach('image', path.join(__dirname, 'fixtures', 'wrongFormatImage.gif'))
      .expect(415);

    expect(response.body.error).toBe('Unsupported file format');
  });

  it('should return an error if the MIME type and extension do not match', async () => {
    const response = await request(app)
      .post('/api/pictures/upload')
      .attach('image', path.join(__dirname, 'fixtures', 'fakejpg.jpg'))
      .expect(415);

    expect(response.body.error).toBe('MIME type and file extension do not match');
  });

// 2. Test for file size verification:
//    - Verify that the upload rejects a file whose size exceeds the defined limit.
//    - Ensure that the system correctly handles overly large files.

  it('should return an error if the file is too large', async () => {
    // Creating fake file
    const largeFilePath = path.join(__dirname, 'fixtures', 'fake.jpg');
    fs.writeFileSync(largeFilePath, Buffer.alloc(6 * 1024 * 1024));

    const response = await request(app)
      .post('/api/pictures/upload')
      .attach('image', largeFilePath)
      .expect(413);

    expect(response.body.error).toBe('File size exceeds the allowed limit');

    // Clean up the test file
    fs.unlinkSync(largeFilePath);
  });

// 3. Test for generating a unique filename:
//    - Verify that the uploaded file's name is generated uniquely (e.g., using a UUID or timestamp).
//    - Verify that the generated filename follows the expected naming scheme.

// 4. Test for image resizing:
//    - Verify that the uploaded image is resized to the ideal dimensions for a responsive web app (for example, a maximum width of 1200px or as per your criteria).
//    - Ensure that the image’s aspect ratio is maintained during resizing.

// 5. Test for conversion to WebP format:
//    - Verify that the resized image is converted to the WebP format.
//    - Check that the conversion quality meets a defined level (e.g., an acceptable compression rate).

// 6. Test for cleaning image metadata (EXIF):
//    - Verify that any metadata (EXIF) is removed from the image during processing, if necessary.

// 7. Test for thumbnail creation:
//    - Verify that a thumbnail is created from the uploaded image.
//    - Verify that the thumbnail is resized to appropriate dimensions (e.g., 300px width or according to your criteria) while maintaining the aspect ratio.

// 8. Integration test with AWS S3 (MinIO in dev):
//    - Verify that the processed files (converted image and thumbnail) are successfully uploaded to MinIO and that correct URLs are generated.
//    - Verify that the returned URLs adhere to the expected format (e.g., HTTPS, bucket name, etc.).

// 9. Test for saving the URLs in the Picture document:
//    - Verify that on a successful upload, the Picture document is created or updated with the correct URLs for the image and the thumbnail.
//    - Verify that other fields in the Picture model (title, description) are saved correctly.

// 10. Test for error handling and rollback during processing:
//     - Simulate an error during image resizing, conversion, or metadata cleaning, and verify that the system returns a clear and appropriate error message.
//     - Simulate an error during the MinIO upload and verify that error handling (or any rollback mechanism) works correctly.

// 11. Security and authentication tests:
//     - Verify that only authorized users (if applicable) can perform the upload.
//     - Ensure the system protects against malicious file injections (e.g., by verifying the MIME type, extension, etc.).

// 12. Performance test (optional):
//     - Measure the processing time for a typical upload and ensure it remains within acceptable limits.

});

