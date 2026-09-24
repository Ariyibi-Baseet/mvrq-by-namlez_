const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/** Files bigger than this are rejected before any upload starts. */
export const MAX_UPLOAD_MB = 15;

/**
 * Shrinks big phone photos before upload (max 2000px on the longest side).
 * Faster uploads, and it stays under Cloudinary's free-plan file size limit.
 * Falls back to the original file if anything goes wrong.
 */
export const resizeImage = async (
  file: File,
  maxSize = 2000,
): Promise<Blob> => {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));

    // Already small enough: upload untouched
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")!
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    // Keep PNGs as PNG so transparent cut-outs don't turn black
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Resize failed"))),
        type,
        0.88,
      ),
    );
  } catch {
    return file;
  }
};

/** Uploads one image to Cloudinary (unsigned preset) and resolves with its https URL. */
export const uploadImage = (
  file: Blob,
  onProgress?: (percent: number) => void,
): Promise<string> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return Promise.reject(
      new Error(
        "Cloudinary is not configured. Check your .env file and restart the dev server.",
      ),
    );
  }

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      let body: { secure_url?: string; error?: { message?: string } } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) {
        resolve(body.secure_url);
      } else {
        reject(new Error(body.error?.message || "Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(form);
  });
};

/**
 * Adds Cloudinary delivery optimisation to an image URL:
 *  f_auto  -> serves WebP/AVIF where the browser supports it
 *  q_auto  -> picks a smart compression level
 *  w_X     -> never sends more pixels than needed
 * Non-Cloudinary URLs (e.g. Unsplash) are returned unchanged.
 */
export const optimizeUrl = (url: string, width = 800): string => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/"))
    return url;
  if (/\/upload\/[^/]*(f_auto|q_auto)/.test(url)) return url; // already optimised
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};
