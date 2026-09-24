import React, { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Link2,
} from "lucide-react";
import {
  uploadImage,
  resizeImage,
  optimizeUrl,
  MAX_UPLOAD_MB,
} from "../../lib/cloudinary";
import { inputCls, btnGhost } from "./Adminstyles";

interface UploadItem {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  /** Called with true while any upload is running, so the form can disable Save. */
  onBusyChange?: (busy: boolean) => void;
  max?: number;
}

const tileBtn =
  "p-1.5 text-slate-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors";

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  onBusyChange,
  max = 6,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Refs always hold the latest list, so several uploads finishing at once don't overwrite each other
  const imagesRef = useRef(images);
  const pendingRef = useRef(0);
  imagesRef.current = images;

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [urlValue, setUrlValue] = useState("");

  const activeUploads = uploads.filter((u) => !u.error).length;

  useEffect(() => {
    onBusyChange?.(activeUploads > 0);
  }, [activeUploads, onBusyChange]);

  const commit = (next: string[]) => {
    imagesRef.current = next;
    onChange(next);
  };

  const startUpload = async (file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setUploads((u) => [
        ...u,
        { id, name: file.name, progress: 0, error: `Over ${MAX_UPLOAD_MB} MB` },
      ]);
      return;
    }

    pendingRef.current += 1;
    setUploads((u) => [...u, { id, name: file.name, progress: 0 }]);

    try {
      const blob = await resizeImage(file);
      const url = await uploadImage(blob, (progress) =>
        setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress } : x))),
      );
      commit([...imagesRef.current, url]);
      setUploads((u) => u.filter((x) => x.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploads((u) =>
        u.map((x) => (x.id === id ? { ...x, error: message } : x)),
      );
    } finally {
      pendingRef.current -= 1;
    }
  };

  const handleFiles = (list: FileList | File[]) => {
    setNotice("");
    const all = Array.from(list);
    const files = all.filter((f) => f.type.startsWith("image/"));
    if (files.length < all.length)
      setNotice("Only image files can be uploaded.");

    const remaining = max - imagesRef.current.length - pendingRef.current;
    if (files.length > remaining)
      setNotice(`You can add up to ${max} photos per product.`);

    files.slice(0, Math.max(remaining, 0)).forEach((f) => void startUpload(f));
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  const remove = (index: number) =>
    commit(images.filter((_, i) => i !== index));

  const addUrl = () => {
    try {
      const parsed = new URL(urlValue.trim());
      if (!/^https?:$/.test(parsed.protocol)) throw new Error();
      if (images.length + activeUploads >= max) {
        setNotice(`You can add up to ${max} photos per product.`);
        return;
      }
      commit([...images, parsed.toString()]);
      setUrlValue("");
      setShowUrl(false);
      setNotice("");
    } catch {
      setNotice("Enter a valid image link starting with https://");
    }
  };

  const canAddMore = images.length + activeUploads < max;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = ""; // lets the same file be picked again
        }}
      />

      {/* Photo grid */}
      {(images.length > 0 || uploads.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative aspect-[3/4] bg-navy-900 light:bg-slate-100 border border-navy-800 light:border-slate-300 overflow-hidden"
            >
              <img
                src={optimizeUrl(url, 300)}
                alt=""
                className="w-full h-full object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 bg-white text-navy-950 text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-navy-950/85 px-0.5">
                <button
                  type="button"
                  className={tileBtn}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Move photo earlier"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={`${tileBtn} hover:!text-rose-400`}
                  onClick={() => remove(i)}
                  aria-label="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={tileBtn}
                  disabled={i === images.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Move photo later"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {uploads.map((u) => (
            <div
              key={u.id}
              className="relative aspect-[3/4] flex flex-col items-center justify-center gap-2 p-2 text-center border border-navy-800 light:border-slate-300 bg-navy-900/50 light:bg-slate-50"
            >
              {u.error ? (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-mono text-rose-400 leading-tight">
                    {u.error}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setUploads((list) => list.filter((x) => x.id !== u.id))
                    }
                    className="text-[10px] font-mono uppercase text-slate-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                </>
              ) : (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span className="text-[11px] font-mono text-slate-300">
                    {u.progress}%
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-navy-800">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`mt-3 flex flex-col items-center justify-center gap-1.5 px-4 py-7 text-center border border-dashed cursor-pointer transition-colors focus:outline-none focus:border-amber-400 ${
            dragging
              ? "border-amber-400 bg-amber-400/5"
              : "border-navy-800 light:border-slate-300 hover:border-slate-500"
          }`}
        >
          <UploadCloud className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
          <span className="text-sm text-slate-200 light:text-navy-900">
            Drop photos here or{" "}
            <span className="underline underline-offset-2">browse</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            JPG, PNG or WebP · up to {MAX_UPLOAD_MB} MB each
          </span>
        </div>
      )}

      {notice && (
        <p className="mt-2 text-xs font-mono text-amber-400">{notice}</p>
      )}

      <p className="mt-3 text-[11px] font-mono leading-relaxed text-slate-500">
        The first photo is the cover shown in the store. Portrait photos (4:5)
        look best.
      </p>

      {/* Add by link (for existing images) */}
      <div className="mt-3">
        {showUrl ? (
          <div className="flex gap-2">
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="https://..."
              className={`${inputCls} font-mono !py-2 !text-xs`}
            />
            <button
              type="button"
              onClick={addUrl}
              className={`${btnGhost} !px-4 !py-2`}
            >
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUrl(true)}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-slate-400 hover:text-white transition-colors"
          >
            <Link2 className="w-3.5 h-3.5" />
            Add from link
          </button>
        )}
      </div>
    </div>
  );
};
