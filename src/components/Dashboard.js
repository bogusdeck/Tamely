import React from "react";

export default function Dashboard({ onLogout }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Welcome to your Dashboard</h1>
      <button
        onclick={onLogout}
        className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600  hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
}
