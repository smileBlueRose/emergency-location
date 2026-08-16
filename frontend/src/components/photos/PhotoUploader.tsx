import { useEffect, useState } from 'react';
import { photoApi } from '../../services/api/photo';

interface PhotoUploaderProps {
  requestId: number;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function PhotoUploader({
  requestId,
}: PhotoUploaderProps) {
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
        console.error('Failed to upload photo:', error);
        setStatus('error');
    }
    }

  return (
    <section className="photo-uploader">
      <label htmlFor="photo-upload">
        Выбрать фотографию
      </label>

      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      {previewUrl && (
        <div className="photo-uploader__preview">
          <img
            src={previewUrl}
            alt="Предпросмотр фотографии"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={status === 'uploading'}
          >
            {status === 'uploading'
              ? 'Отправляем...'
              : 'Отправить фото'}
          </button>
        </div>
      )}

      {status === 'success' && (
        <p>Фотография успешно отправлена.</p>
      )}

      {status === 'error' && (
        <p>Не удалось отправить фотографию.</p>
      )}

      {uploadedPhotoUrl && (
        <div className="photo-uploader__uploaded">
          <p>Загруженная фотография</p>

          <img
            src={uploadedPhotoUrl}
            alt="Загруженная фотография"
          />
        </div>
      )}
    </section>

    
  );
}