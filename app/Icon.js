import { IoLogoJavascript } from "react-icons/io";
import { FaCss3, FaHtml5, FaJava, FaPython, FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { MdQuiz } from "react-icons/md";
import { PiMathOperationsFill } from "react-icons/pi";
import { SiMongodb, SiMysql, SiTypescript } from "react-icons/si";
import { TbBrandCpp } from "react-icons/tb";
export const ICONS = [
  { name: 'Quiz', icon: <MdQuiz  className="text-cyan-700 text-2xl" /> },
  { name: 'Java', icon: <FaJava className="text-orange-700 text-2xl" /> },
  { name: 'Python', icon: <FaPython className="text-blue-600 text-2xl" /> },
  { name: 'HTML', icon: <FaHtml5 className="text-orange-500 text-2xl" /> },
  { name: 'JavaScript', icon: <IoLogoJavascript className="text-yellow-500 text-2xl" /> },
  { name: 'C++', icon: <TbBrandCpp className="text-indigo-600 text-2xl" /> },
  { name: 'React', icon: <FaReact className="text-cyan-500 text-2xl" /> },
  { name: 'CSS', icon: <FaCss3  className="text-purple-500 text-2xl" /> },
  { name: 'Nextjs', icon: <RiNextjsFill  className="text-gray-900 text-2xl" /> },
  { name: 'Typescript ', icon: <SiTypescript  className="text-blue-500 text-2xl" /> },
  { name: 'SQL ', icon: <SiMysql className="text-blue-500 text-2xl" /> },
  { name: 'Mongodb  ', icon: <SiMongodb  className="text-green-600 text-2xl" /> },
  { name: 'Aptitude ', icon: <PiMathOperationsFill  className="text-gray-700 text-2xl" /> },
];