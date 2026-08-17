import { useEffect, useState } from 'react';
import { photoApi } from '../../services/api/photo';
import { useLocale } from '../../app/providers/LocaleProvider';

interface PhotoUploaderProps {
  requestId: number;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function PhotoUploader({
  requestId,
}: PhotoUploaderProps) {
  const { t } = useLocale();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] =
    useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setUploadedPhotoUrl(null);
    setStatus('idle');
  }

  async function handleUpload() {
    if (!file) {
      return;
    }

    try {
      setStatus('uploading');

      const uploadedPhoto = await photoApi.upload(
        requestId,
        file,
      );

      console.log(
        'UPLOADED PHOTO URL:',
        uploadedPhoto.url,
      );

      setUploadedPhotoUrl(uploadedPhoto.url);
      setStatus('success');
    } catch (error) {
      console.error(
        'Failed to upload photo:',
        error,
      );
      setStatus('error');
    }
  }

  return (
    <section className="photo-uploader">
    <input
      id="photo-upload"
      type="file"
      accept="image/*"
      capture="environment"
      onChange={handleFileChange}
      className="photo-uploader__input"
    />

    <label
      htmlFor="photo-upload"
      className="photo-uploader__button"
    >
      {t.photo.select}
    </label>

      {previewUrl && (
        <div className="photo-uploader__preview">
          <img
            src={previewUrl}
            alt={t.photo.preview}
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={status === 'uploading'}
          >
            {status === 'uploading'
              ? t.photo.sending
              : t.photo.send}
          </button>
        </div>
      )}

      {status === 'success' && (
        <p>{t.photo.success}</p>
      )}

      {status === 'error' && (
        <p>{t.photo.error}</p>
      )}

      {uploadedPhotoUrl && (
        <div className="photo-uploader__uploaded">
          <p>{t.photo.uploaded}</p>

          <img
            src={uploadedPhotoUrl}
            alt={t.photo.uploaded}
          />
        </div>
      )}
    </section>
  );
}