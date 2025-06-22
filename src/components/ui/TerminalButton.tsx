import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Terminal from './Terminal';

export const TerminalButton: React.FC = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        onClick={() => setIsTerminalOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-400 text-black rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg
          className="w-6 h-6 transition-transform group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V8h16v10H4z" />
          <path d="M6 10h2v2H6zm0 4h8v2H6z" />
        </svg>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-green-400 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-mono">
          Ouvrir Terminal
        </div>
      </motion.button>

      {/* Terminal */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </>
  );
};

export default TerminalButton;