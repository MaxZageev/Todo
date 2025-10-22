import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * useAddTodoForm хранит текст новой задачи и простую валидацию на пустую строку.
 */
export default function useAddTodoForm(onAdd: (text: string) => void) {
  const { t } = useTranslation(undefined, { keyPrefix: "features.add-todo" });
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emptyErrorMessage = t("error-empty");

  const submit = useCallback(() => {
    const value = text.trim();
    if (!value) {
      setError(emptyErrorMessage);
      return;
    }
    onAdd(value);
    setText("");
    setError(null);
  }, [text, onAdd, emptyErrorMessage]);

  const handleChange = useCallback(
    (value: string) => {
      setText(value);
      if (error) setError(null);
    },
    [error]
  );

  return {
    text,
    error,
    submit,
    handleChange
  };
}

export { useAddTodoForm };
