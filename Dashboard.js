import React, { useEffect, useState } from "react";
import { getDocuments } from "../api";

export default function Dashboard({ userId, openDocument }) {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const data = await getDocuments(userId);
    setDocs(data);
  };

  const createDoc = () => {
    const newDoc = { id: Date.now(), title: `Untitled`, content: "" };
    openDocument(newDoc.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Documents</h2>
      <button onClick={createDoc}>+ New Document</button>
      <ul>
        {docs.map((d) => (
          <li key={d.id}>
            <button onClick={() => openDocument(d.id)}>{d.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}