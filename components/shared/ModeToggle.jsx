'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { TiWeatherSunny } from "react-icons/ti";
export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className='dark:bg-gray-800 dark:text-white bg-slate-100 text-black dark:hover:bg-slate-700 hover:bg-slate-200'
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  )
}
