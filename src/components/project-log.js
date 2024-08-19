import { useEffect } from "react";

export default function ProjectLog({ isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      document.title = "Project Log"; // Set the title of the page when Project Log is visible
    } else {
      document.title = "Dashboard"; // Reset the title when Project Log is hidden
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-start z-50">
      <div className="blackbg shadow-lg p-6 m-4 w-full max-w-4xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4 yellowtxt">Project Log</h2>
          <button
            onClick={onClose}
            className="yellowtxt text-lg hover:scale-105"
          >
            ✕
          </button>
        </div>
        <p className="text-lg yellowtxt">
          This is where you can keep track of all your project activities, logs,
          and updates.


          coming soon....
        </p>
        {/* Add your project log content here */}
      </div>
    </div>
  );
}
