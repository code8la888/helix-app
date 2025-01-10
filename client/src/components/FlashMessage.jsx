import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";

export default function FlashMessage() {
  const [messages, setMessages] = useState({ success: "", error: "" });

  useEffect(() => {
    axios.get("/api/flash-messages").then((response) => {
      if (response.data.success) {
        setMessages({ success: response.data.success });
      } else if (response.data.error) {
        setMessages({ error: response.data.error });
      }
    });
  }, []);

  return (
    <div>
      {messages.success && messages.success.length > 0 && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {messages.success}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
      {messages.error && messages.error.length > 0 && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {messages.error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
    </div>
  );
}
