export interface CloudinaryUploadResponse {
  secure_url: string;
  resource_type: "image" | "video";
  public_id: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
}

export function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dp6ll9ckq";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio";

    const isVideo = file.type.startsWith("video/");
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            secure_url: res.secure_url,
            resource_type: res.resource_type === "video" ? "video" : "image",
            public_id: res.public_id,
            bytes: res.bytes,
            format: res.format,
            width: res.width,
            height: res.height,
            duration: res.duration,
          });
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload"));
    };

    xhr.send(formData);
  });
}
