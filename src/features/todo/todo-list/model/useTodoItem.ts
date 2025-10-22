import { useCallback, useState } from "react";

/**
 * Хук `useTodoItem` инкапсулирует логику редактирования, разворачивания длинного текста
 * и переключения состояния отдельной задачи. Компоненту `TodoItem` остается только UI.
 */
export default function useTodoItem(initialText: string, onEdit: (nextText: string) => void) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialText);
  const [expanded, setExpanded] = useState(false);

  // Переходим в режим редактирования и подставляем актуальный текст из пропсов
  const startEdit = useCallback(() => {
    setDraft(initialText);
    setEditing(true);
  }, [initialText]);

  // Возврат в режим просмотра без сохранения изменений
  const cancelEdit = useCallback(() => {
    setDraft(initialText);
    setEditing(false);
  }, [initialText]);

  // Сохраняем изменения, если текст не пустой, и выходим из режима редактирования
  const save = useCallback(() => {
    const value = draft.trim();
    if (!value) return;
    onEdit(value);
    setEditing(false);
  }, [draft, onEdit]);

  // Разворачиваем или скрываем длинное описание задачи
  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

  // Обрабатываем служебные клавиши: Enter сохраняет, Escape отменяет изменения
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") save();
      if (event.key === "Escape") cancelEdit();
    },
    [save, cancelEdit]
  );

  return {
    editing,
    draft,
    expanded,
    setDraft,
    startEdit,
    cancelEdit,
    save,
    toggleExpanded,
    handleKeyDown
  };
}

export { useTodoItem };
