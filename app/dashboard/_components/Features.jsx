import { NeonGradientCard } from '@/components/magicui/neon-gradient-card'
import React from 'react'

function Features({title,desc}) {
  return (
    <div>
         <NeonGradientCard className="max-w-60 items-center justify-center text-center">
      <div className='flex flex-col gap-2'>
      <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
        {title}
      </span>
      <p className='text-sm text-wrap text-center font-normal text-black'>
      {desc} 
      </p>
      </div>
    </NeonGradientCard>
    </div>
  )
}

export default Features