import Image from 'next/image'
import React from 'react'

function Placeholder() {
  return (
    <div className='w-full h-screen flex flex-col gap-3 p-4 items-center justify-center'>
        <Image 
            src={"/placeholder.png"}
            alt='img'
            width={230}
            height={230}
        />
        <h2 className='text-2xl font-bold text-center text-green-900'>Opps! Quizs Not Founds</h2>
        
    </div>
  )
}

export default Placeholder