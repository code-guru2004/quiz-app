import { IoLogoJavascript } from "react-icons/io";
import { FaCss3, FaDatabase, FaHtml5, FaJava, FaPython, FaReact } from "react-icons/fa";
import { RiNextjsFill, RiUserCommunityFill } from "react-icons/ri";
import { MdQuiz } from "react-icons/md";
import { PiBrainDuotone, PiMathOperationsFill } from "react-icons/pi";
import { SiMongodb, SiMysql, SiTypescript, SiWorldhealthorganization } from "react-icons/si";
import { TbBrandCpp, TbMathSymbols } from "react-icons/tb";
import { GiGiftOfKnowledge, GiLaurelsTrophy } from "react-icons/gi";
import { IoHardwareChipSharp } from "react-icons/io5";

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
  { name: 'Math ', icon: <TbMathSymbols  className="text-orange-500 text-2xl" /> },
  { name: 'Brain', icon: <PiBrainDuotone  className="text-blue-500 text-2xl" /> },
  { name: 'Verbal', icon: <RiUserCommunityFill className="text-blue-500 text-2xl" /> },
  { name: 'Healthcare', icon: <SiWorldhealthorganization  className="text-blue-500 text-2xl" /> },
  { name: 'Knowledge', icon: <GiGiftOfKnowledge className="text-orange-500 text-2xl" /> },
  { name: 'Hardware', icon: <IoHardwareChipSharp className="text-gray-500 text-2xl" /> },
  { name: 'Database', icon: <FaDatabase className="text-blue-500 text-2xl" /> },
  { name: 'Contest', icon: <GiLaurelsTrophy className="text-orange-500 text-2xl" /> },
];