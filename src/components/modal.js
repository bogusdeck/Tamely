import React, { useState } from "react";

export default function Modal({ isOpen, onClose, handleSubmit }) {
  const [notionKey, setNotionKey] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(notionKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-lg shadow-lg z-10">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">Update Notion Key</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter Notion API Key"
            value={notionKey}
            onChange={(e) => setNotionKey(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
