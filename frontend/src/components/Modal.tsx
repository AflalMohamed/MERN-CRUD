import React from 'react';

// Modal component எதிர்பார்க்கும் props
interface ModalProps {
  isOpen: boolean;      // Modal திறந்திருக்கிறதா, இல்லையா?
  onClose: () => void;  // Modal-ஐ மூடும் function
  title: string;        // Modal-இன் தலைப்பு
  children: React.ReactNode; // Modal-இன் உள்ளே காட்ட வேண்டிய உள்ளடக்கம் (e.g., a form)
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // isOpen false ஆக இருந்தால், எதையும் காட்ட வேண்டாம்
  if (!isOpen) return null;

  return (
    // 1. Overlay (சாம்பல் நிறப் பின்னணி)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // பின்னணியில் கிளிக் செய்தால் மூடிவிடும்
    >
      {/* 2. Modal Content (வெள்ளைப் பெட்டி) */}
      <div 
        className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} // Modal-ல் கிளிக் செய்தால் மூடாது
      >
        {/* 3. Modal Header (தலைப்பு மற்றும் மூடும் பட்டன்) */}
        <div className="flex items-start justify-between pb-4 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
            onClick={onClose}
          >
            {/* 'X' icon */}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        
        {/* 4. Modal Body (இங்கே நம்முடைய Form வரும்) */}
        <div className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;