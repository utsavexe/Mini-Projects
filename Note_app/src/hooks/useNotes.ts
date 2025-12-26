import { useEffect, useState } from "react";
import { Note } from "../types";

const STORAGE_KEY = "notes_ts";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function addNote(text: string, tags: string[]) {
    setNotes(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        tags,
        pinned: false,
        createdAt: Date.now()
      }
    ]);
  }

  function updateNote(id: number, text: string) {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, text } : n))
    );
  }

  function deleteNote(id: number) {
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  function togglePin(id: number) {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, pinned: !n.pinned } : n
      )
    );
  }

  function reorder(from: number, to: number) {
    setNotes(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  }

  return { notes, addNote, updateNote, deleteNote, togglePin, reorder };
}
