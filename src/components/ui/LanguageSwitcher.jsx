import { useState, useEffect } from 'react';
import { LANGUAGES } from '@/lib/constants';

export default function LanguageSwitcher({ currentLang, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <span>{LANGUAGES[currentLang]}</span>
        <span>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                onLanguageChange(code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                currentLang === code ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}