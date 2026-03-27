import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5001");

function Editor() {
  const [content, setContent] = useState("");
  const docId = 1;

  useEffect(() => {
    // ✅ join document room
    socket.emit("join_document", { doc_id: docId });

    // ✅ receive updates
    socket.on("update", (data) => {
      console.log("Received:", data);
      setContent(data.content); // ✅ FIXED
    });

    return () => socket.off("update");
  }, []);

  const handleChange = (value) => {
    setContent(value);

    // ✅ send correct format
    socket.emit("update", {
      doc_id: docId,
      content: value
    });
  };

  return (
    <div style={{ width: "80%", margin: "50px auto" }}>
      <h2>Collaborative Editor</h2>
      <ReactQuill value={content} onChange={handleChange} />
    </div>
  );
}

export default Editor;