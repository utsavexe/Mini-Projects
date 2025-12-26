import { useEffect, useState } from "react";
import { useNotes } from "./hooks/useNotes";

export default function App() {
  const { notes, addNote, updateNote, deleteNote, togglePin, reorder } =
    useNotes();

  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);
   
  const filteredNotes = notes
    .filter(
      n =>
        n.text.toLowerCase().includes(search) ||
        n.tags.some(t => t.toLowerCase().includes(search))
    )
    .sort((a, b) => {
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return b.createdAt - a.createdAt;
});


  return (
    <div className={dark ? "app dark" : "app"}>
      <div className="header">
        <h1>📝 Note App</h1>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            className="search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value.toLowerCase())}
          />

          <button onClick={() => setDark(d => !d)}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <textarea
        placeholder="Write note..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
        <input
          className="tags-input"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />

        <button
          onClick={() => {
            if (!text.trim()) return;

            addNote(
              text,
              tags
                .split(",")
                .map(t => t.trim())
                .filter(t => t.length > 0)
            );

            setText("");
            setTags("");
          }}
        >
          Add Note
        </button>
      </div>

      {filteredNotes.length === 0 && <p className="empty">No notes yet. Add one 👆</p>}

      {showHistory && (
        <ul className="notes-list">
          {filteredNotes.map((note, index) => (
            <li
              key={note.id}
              draggable
              onDragStart={e => e.dataTransfer.setData("index", String(index))}
              onDragOver={e => e.preventDefault()}
              onDrop={e => reorder(Number(e.dataTransfer.getData("index")), index)}
              className={note.pinned ? "pinned" : ""}
            >
              <input
                value={note.text}
                onChange={e => updateNote(note.id, e.target.value)}
              />

              <div className="tags">#{note.tags.join(" #")}</div>

              <button className="pin-btn" onClick={() => togglePin(note.id)}>📌</button>
              <button onClick={() => deleteNote(note.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}

      <div className="history-toggle">
        <button onClick={() => setShowHistory(s => !s)}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>
    </div>
  );
}
