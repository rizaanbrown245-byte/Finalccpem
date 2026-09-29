/**
 * Utilities for client-side image compression and folder/file processing
 * Converts user-selected device photos and folders into optimized Base64 data URLs
 * so that no external image hosting URLs or manual URL typing are needed.
 */

export function isImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'heic', 'heif'].includes(ext || '');
}

/**
 * Compresses an image file client-side to ensure fast loading and safe browser storage
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1280,
  quality = 0.82
): Promise<string> {
  // If SVG, read as text/dataURL directly
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw dataURL if image decode fails
        resolve(reader.result as string);
      };
      img.onload = () => {
        try {
          let { width, height } = img;

          // Downscale if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          // Fill white background for transparent PNG conversion to JPG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          // If canvas fails (e.g. taint), fallback to raw reader result
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Process an entire list of files or folder of files into compressed Base64 images
 */
export async function processImageFiles(
  files: FileList | File[],
  onProgress?: (processed: number, total: number) => void
): Promise<string[]> {
  const fileArray = Array.from(files).filter(isImageFile);
  if (fileArray.length === 0) return [];

  const results: string[] = [];
  let processedCount = 0;

  for (const file of fileArray) {
    try {
      const dataUrl = await compressImageFile(file);
      results.push(dataUrl);
    } catch (err) {
      console.warn('Failed to process image file:', file.name, err);
    }
    processedCount++;
    if (onProgress) {
      onProgress(processedCount, fileArray.length);
    }
  }

  return results;
}
