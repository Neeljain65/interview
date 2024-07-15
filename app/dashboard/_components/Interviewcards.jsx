import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Interviewcards({interviews}) {
  
  return (
    <div className='flex flex-col bg-white border rounded-md my-5 p-3 ' >
        <h2 className='font-bold text-blue-400'>{interviews?.jobPosition}</h2>
        <h2 className='font-medium '>{interviews?.jobDesc}</h2>
        <h2 className=''>{interviews?.createdAt}</h2>
      <div className='flex flex-row flex-wrap gap-5'>
      <Link href={"/dashboard/interview/"+interviews?.mockId +"/Feedback"}>
        <Button variant="outline" className="mt-4">View FeedBack</Button></Link>
        <Link href={"/dashboard/interview/"+interviews?.mockId +"/Start"}>
        <Button className="mt-4">Start</Button></Link>
      </div>
    </div>
  )
}

export default Interviewcards