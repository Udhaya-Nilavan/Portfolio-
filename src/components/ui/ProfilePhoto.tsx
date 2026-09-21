import { useCallback, useEffect, useRef, useState } from 'react';
import { personalData } from '../../data/personal';
import { Camera, Trash } from './Icons';

const STORAGE_KEY = 'un-portfolio-profile-photo';

/**
 * If you drop a file at `public/profile/udhaya-nilavan.jpg`, it is used as the
 * permanent profile photo and no upload is needed. Until then the component
 * shows a neutral monogram placeholder.
 *
 * A photo chosen through the UI is stored in this browser only (localStorage)
 * and is shown on top of everything else — useful for trying a photo before
 * committing it to the repo.
 *
 * Deliberately NOT a certificate image.
 */
const PERMANENT_PHOTO = '/profile/udhaya-nilavan.jpg';

const MAX_BYTES = 4 * 1024 * 1024;

export function ProfilePhoto() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [storedPhoto, setStoredPhoto] = useState<string | null>(null);
  const [permanentExists, setPermanentExists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Read any locally saved photo */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setStoredPhoto(saved);
    } catch {
      /* private mode — placeholder is fine */
    }
  }, []);

  /* Probe for a committed photo file without rendering a broken image */
  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setPermanentExists(true);
    probe.onerror = () => setPermanentExists(false);
    probe.src = PERMANENT_PHOTO;
  }, []);

  const photoSrc = storedPhoto ?? (permanentExists ? PERMANENT_PHOTO : null);

  const handleFile = useCallback((file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image. Choose a JPG, PNG or WebP.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('That image is over 4 MB. Choose a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setStoredPhoto(result);
      setError(null);
      try {
        window.localStorage.setItem(STORAGE_KEY, result);
      } catch {
        setError('The photo is showing, but this browser could not save it for next time.');
      }
    };
    reader.onerror = () => setError('That image could not be read. Try a different file.');
    reader.readAsDataURL(file);
  }, []);

  const clearPhoto = useCallback(() => {
    setStoredPhoto(null);
    setError(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clean up */
    }
  }, []);

  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      <div className="photo">
        {photoSrc ? (
          <img
            className="photo__img"
            src={photoSrc}
            alt={`${personalData.name}, ${personalData.location}`}
          />
        ) : (
          <div className="photo__placeholder">
            <span className="photo__monogram" aria-hidden="true">
              {personalData.initials}
            </span>
            <p className="photo__hint">Add a profile photo</p>
          </div>
        )}

        {/* Whole frame is the control, so clicking the photo changes it. */}
        <button
          type="button"
          className="photo__replace"
          data-always={photoSrc ? undefined : 'true'}
          onClick={openPicker}
          aria-label={photoSrc ? 'Change profile photo' : 'Add a profile photo'}
        >
          <span className="photo__replace-chip">
            <Camera size={15} />
            {photoSrc ? 'Change photo' : 'Add photo'}
          </span>
        </button>

        {storedPhoto && (
          <button
            type="button"
            className="photo__clear"
            onClick={clearPhoto}
            aria-label="Remove the photo saved in this browser"
            title="Remove saved photo"
          >
            <Trash size={16} />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="visually-hidden"
          onChange={e => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      <p className="photo__caption" role={error ? 'alert' : undefined}>
        {error ??
          (storedPhoto
            ? 'Saved in this browser. To make it permanent, save the file as public/profile/udhaya-nilavan.jpg.'
            : 'Click the frame to try a photo, or save yours as public/profile/udhaya-nilavan.jpg.')}
      </p>
    </div>
  );
}
