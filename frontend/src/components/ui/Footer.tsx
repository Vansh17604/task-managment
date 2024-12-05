
import { FaWhatsapp, FaYoutube, FaLinkedin } from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="flex justify-center space-x-8">
        <a 
          href="https://wa.me/9099983381" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-3xl hover:text-green-500 transition-colors"
        >
          <FaWhatsapp />
        </a>

        <a 
          href="https://youtube.com/@vanshpatel6372?feature=shared" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-3xl hover:text-red-500 transition-colors"
        >
          <FaYoutube />
        </a>

        <a 
          href="www.linkedin.com/in/vansh-patel-bb776321a" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-3xl hover:text-blue-500 transition-colors"
        >
          <FaLinkedin />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
