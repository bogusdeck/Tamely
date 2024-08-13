import React, { useState } from "react";

export default function NotionKeyForm({ onSubmit }) {
  const [notionKey, setNotionKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(notionKey);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Enter your Notion API Key
        </label>
        <input
          type="text"
          value={notionKey}
          onChange={(e) => setNotionKey(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Notion API Key
      </button>
    </form>
  );
}
