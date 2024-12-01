import React from 'react';
import { FaWhatsapp, FaYoutube, FaLinkedin } from 'react-icons/fa'; 

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-5">
      <div className="flex justify-center space-x-6">
   
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-green-500">
          <FaWhatsapp />
        </a>

      
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-red-500">
          <FaYoutube />
        </a>

     
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-500">
          <FaLinkedin />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
