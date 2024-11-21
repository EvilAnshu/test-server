import { fileTypeFromBuffer } from 'file-type';

export async function decodeBase64File(base64String) {
  try {
    const buffer = Buffer.from(base64String, 'base64');
    const mimeType = await fileTypeFromBuffer(buffer);

    return {
      valid: true,
      size: buffer.length / 1024, // in kb
      mimeType: mimeType ? mimeType.mime : 'unknown',
    };
  } catch (error) {
    console.error('Error decoding file:', error);
    return {
      valid: false,
      size: 0,
      mimeType: null,
    };
  }
}
