import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Editor from "./components/editor";
import { getDocuments } from "./api";

function App() {
  const [userId, setUserId] = useState(null);      // Logged in user
  const [documents, setDocuments] = useState([]);  // User's documents
  const [activeDocId, setActiveDocId] = useState(null); // Current document

  // Fetch documents after login
  useEffect(() => {
    if (userId) {
      async function fetchDocs() {
        const docs = await getDocuments(userId);
        setDocuments(docs);
        if (docs.length > 0) setActiveDocId(docs[0].id); // open first doc
      }
      fetchDocs();
    }
  }, [userId]);

  if (!userId) {
    // Show login screen
    return <Login onLogin={(id) => setUserId(id)} />;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Collaborative Document Editor</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Sidebar: List of documents */}
        <div style={{ width: "200px", borderRight: "1px solid #ccc", paddingRight: "10px" }}>
          <h3>Your Documents</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {documents.map((doc) => (
              <li
                key={doc.id}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  backgroundColor: activeDocId === doc.id ? "#e0e0e0" : "transparent"
                }}
                onClick={() => setActiveDocId(doc.id)}
              >
                {doc.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Editor */}
        <div style={{ flex: 1 }}>
          {activeDocId ? (
            <Editor docId={activeDocId} />
          ) : (
            <p>Select a document to start editing</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;