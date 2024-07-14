import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Interviewcards({interviews}) {
  
  return (
    <div className='flex flex-col bg-white border rounded-md my-5 p-3 ' >
        <h2 className='font-bold text-blue-400'>{interviews?.jobPosition}</h2>
        <h2 className='font-medium '>{interviews?.jobDesc}</h2>
        <h2 className=''>{interviews?.createdAt}</h2>
        <Link href={"/dashboard/interview/"+interviews?.mockId +"/Feedback"}>
        <Button className="mt-4">View FeedBack</Button></Link>
    </div>
  )
}

export default Interviewcards