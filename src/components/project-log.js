import { useEffect, useRef } from "react";
import { FiClipboard, FiAlertTriangle } from "react-icons/fi";

export default function ProjectLog({ isVisible, onClose }) {
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isVisible) {
      document.title = "Project Log";
      
      // Animate content elements
      const title = document.querySelector('.project-log-title');
      const content = document.querySelector('.project-log-content');
      const comingSoon = document.querySelector('.coming-soon');
      
      if (title && content && comingSoon) {
        setTimeout(() => title.classList.add('animate-slide-up', 'opacity-100'), 100);
        setTimeout(() => content.classList.add('animate-slide-up', 'opacity-100'), 200);
        setTimeout(() => comingSoon.classList.add('animate-pulse'), 500);
      }
    } else {
      document.title = "Dashboard";
    }
    
    // Handle escape key to close
    function handleEscKey(event) {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    }
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isVisible, onClose]);
  
  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-gradient-to-b from-dark-secondary to-dark-tertiary rounded-lg shadow-dark-lg p-8 m-4 w-full max-w-4xl transform transition-all duration-300 animate-slide-up"
      >
        <div className="flex justify-between items-center mb-6 border-b border-dark-border pb-4">
          <h2 className="text-2xl font-bold text-dark-accent flex items-center project-log-title opacity-0 transition-all duration-300">
            <FiClipboard className="mr-3" />
            <span>Project Log</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-dark-hover transition-all duration-200 transform hover:rotate-90 hover:text-dark-accent"
            aria-label="Close project log"
          >
            <svg
              className="w-5 h-5 text-dark-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        
        <div className="project-log-content opacity-0 transition-all duration-300 space-y-6">
          <div className="bg-dark-tertiary bg-opacity-50 rounded-lg p-6 shadow-inner">
            <p className="text-lg text-dark-text mb-4">
              This is where you can keep track of all your project activities, logs,
              and updates.
            </p>
            
            <div className="coming-soon flex flex-col items-center justify-center py-12">
              <div className="text-5xl mb-6 text-dark-accent">
                <FiAlertTriangle className="inline-block" />
              </div>
              <p className="text-2xl font-bold text-dark-accent mb-2">Coming Soon</p>
              <p className="text-dark-muted text-center max-w-md">
                We're working on building a comprehensive project logging system to help you track your progress and achievements.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-dark-muted text-sm">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                </svg>
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="btn-outline px-6"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
