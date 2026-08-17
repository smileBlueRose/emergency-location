import { useState } from 'react';
import { locationApi } from '../../services/api/location';
import { useLocale } from '../../app/providers/LocaleProvider';

interface RequestFormProps {
  onRequestCreated: (requestId: number, phone: string) => void;
}

export function RequestForm({
  onRequestCreated,
}: RequestFormProps) {
  const { t } = useLocale();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!phone.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const request =
        await locationApi.createShareRequest(
          phone.trim(),
        );

      onRequestCreated(
        request.id,
        request.phone,
      );
    } catch (requestError) {
      console.error(
        'Failed to create request:',
        requestError,
      );

      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="request-form"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="request-phone"
        className="request-form__label"
      >
        {t.request.phone}
      </label>

      <input
        id="request-phone"
        type="tel"
        value={phone}
        onChange={(event) =>
          setPhone(event.target.value)
        }
        placeholder="+7 700 777 11 11"
        className="request-form__input"
        disabled={loading}
      />

      <button
        type="submit"
        className="request-form__button"
        disabled={
          loading || !phone.trim()
        }
      >
        {loading
          ? t.request.creating
          : t.request.create}
      </button>

      {error && (
        <p className="request-form__error">
          {t.request.error}
        </p>
      )}
    </form>
  );
}