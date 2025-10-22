import { useCallback, useState } from "react";

export default function useTodoItem(initialText: string, onEdit: (nextText: string) => void) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialText);
  const [expanded, setExpanded] = useState(false);

  const startEdit = useCallback(() => {
    setDraft(initialText);
    setEditing(true);
  }, [initialText]);

  const cancelEdit = useCallback(() => {
    setDraft(initialText);
    setEditing(false);
  }, [initialText]);

  const save = useCallback(() => {
    const value = draft.trim();
    if (!value) return;
    onEdit(value);
    setEditing(false);
  }, [draft, onEdit]);

  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

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
