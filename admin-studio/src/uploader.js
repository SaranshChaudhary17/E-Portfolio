import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, CLOUD, PRESET, fn } from './fb';

// Cloudinary Free tier limits
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const CHUNK_SIZE = 10 * 1024 * 1024;             // 10 MB chunks

const EXT = {
  image: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  video: ['mp4', 'mov', 'webm', 'm4v'],
};

export const getResourceType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (EXT.image.includes(ext)) return 'image';
  if (EXT.video.includes(ext)) return 'video';
  return null;
};

export const formatBytes = (bytes) => {
  if (!bytes) return '0 MB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

export function uploadFile(file, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const rt = getResourceType(file.name);
      if (!rt) {
        return reject(
          new Error('Unsupported file format. Please upload JPG, PNG, WEBP, MP4, MOV, or WEBM.')
        );
      }

      if (rt === 'image' && file.size > MAX_IMAGE_SIZE) {
        return reject(
          new Error(
            `Image exceeds the 10 MB limit (${formatBytes(file.size)}). Please compress the image.`
          )
        );
      }

      if (rt === 'video' && file.size > MAX_VIDEO_SIZE) {
        return reject(
          new Error(
            `Video is ${formatBytes(file.size)}. Cloudinary Free plan limit is 100 MB. Please compress this video below 100 MB.`
          )
        );
      }

      const url = `https://api.cloudinary.com/v1_1/${CLOUD}/${rt}/upload`;
      const uniqueId = crypto.randomUUID();

      // If file is smaller than chunk size, upload directly in one request
      if (file.size <= CHUNK_SIZE) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', PRESET);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);

        if (onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              onProgress(Math.round((e.loaded / e.total) * 100));
            }
          };
        }

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              const mediaDoc = await saveMediaToFirestore(res, file, ext, rt);
              resolve(mediaDoc);
            } catch (err) {
              reject(err);
            }
          } else {
            let msg = 'Upload failed';
            try {
              msg = JSON.parse(xhr.responseText).error?.message || msg;
            } catch {}
            reject(new Error(msg));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload.'));
        xhr.onabort = () => reject(new Error('Upload cancelled.'));
        xhr.send(fd);
        return;
      }

      // Chunked upload for files > 10 MB
      let finalResponse = null;
      for (let start = 0; start < file.size; start += CHUNK_SIZE) {
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const fd = new FormData();
        fd.append('file', chunk, file.name);
        fd.append('upload_preset', PRESET);

        const chunkResult = await new Promise((okChunk, failChunk) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.setRequestHeader('X-Unique-Upload-Id', uniqueId);
          xhr.setRequestHeader('Content-Range', `bytes ${start}-${end - 1}/${file.size}`);

          if (onProgress) {
            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const totalUploaded = start + e.loaded;
                const pct = Math.min(99, Math.round((totalUploaded / file.size) * 100));
                onProgress(pct);
              }
            };
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                okChunk(JSON.parse(xhr.responseText));
              } catch {
                okChunk({});
              }
            } else {
              let msg = 'Chunk upload failed';
              try {
                msg = JSON.parse(xhr.responseText).error?.message || msg;
              } catch {}
              failChunk(new Error(msg));
            }
          };

          xhr.onerror = () => failChunk(new Error('Network error during chunk upload.'));
          xhr.onabort = () => failChunk(new Error('Upload cancelled.'));
          xhr.send(fd);
        });

        if (chunkResult.secure_url) {
          finalResponse = chunkResult;
        }
      }

      if (onProgress) onProgress(100);

      if (finalResponse && finalResponse.secure_url) {
        const mediaDoc = await saveMediaToFirestore(finalResponse, file, ext, rt);
        resolve(mediaDoc);
      } else {
        reject(new Error('Upload completed but Cloudinary did not return asset metadata.'));
      }
    } catch (e) {
      reject(e);
    }
  });
}

async function saveMediaToFirestore(res, file, ext, rt) {
  const secureUrl = res.secure_url;
  let thumbnailUrl = secureUrl;

  if (rt === 'video') {
    thumbnailUrl = secureUrl.replace(/\.[^.]+$/, '.jpg');
    if (thumbnailUrl.includes('/upload/')) {
      thumbnailUrl = thumbnailUrl.replace('/upload/', '/upload/c_thumb,w_500/');
    }
  } else if (thumbnailUrl.includes('/upload/')) {
    thumbnailUrl = thumbnailUrl.replace('/upload/', '/upload/c_thumb,w_500/');
  }

  const mediaData = {
    publicId: res.public_id,
    fileName: file.name,
    fileSize: file.size,
    format: res.format || ext,
    resourceType: rt,
    secureUrl: secureUrl,
    thumbnailUrl: thumbnailUrl,
    aspectRatio: res.width && res.height ? res.width / res.height : 1,
    width: res.width || 0,
    height: res.height || 0,
    duration: res.duration || 0,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'media'), mediaData);

  try {
    await fn('registerMedia')({ publicId: res.public_id, resourceType: rt });
  } catch {}

  return { id: docRef.id, ...mediaData };
}
