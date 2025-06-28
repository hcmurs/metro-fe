import imageCompression from 'browser-image-compression';

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const compressImage = async (imageFile: File): Promise<File | null> => {
  try {
    const defaultOptions = {
      maxSizeMB: 0.8,         
      useWebWorker: true,
      initialQuality: 0.1, 
      fileType: 'image/jpeg',
      alwaysKeepResolution: true
    };

    const compressedFile = await imageCompression(imageFile, defaultOptions);

    return compressedFile;
  } catch (error) {
    return null;
  }
};