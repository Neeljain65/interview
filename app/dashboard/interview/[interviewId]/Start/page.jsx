"use client";
import db from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React from 'react'
import { useState,useEffect,useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Question from './_components/Question';
import Recording from './_components/Recording';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
export default function Start({params}) {
  const path=usePathname();
    const [indata, setInData] = useState();
    const[interviewQuestions, setInterviewQuestions] = useState();
    const [ActiveQuestion, setActiveQuestion] = useState(0);
    const hasFetched = useRef(false);
    useEffect(() => {
      if (!hasFetched.current) {
    
        GetInterviewDetails();
        hasFetched.current = true;
       
      }
    }, []);

const GetInterviewDetails = async () => {
    try {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId)).execute();
        const JsonMock= JSON.parse(result[0].jsonMockResp)
        setInData(result[0]);
   
        setInterviewQuestions(JsonMock)
      
      toast.success('Interview details fetched successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch interview details.');
    }
  };
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        <Question interviewQuestions={interviewQuestions} ActiveQuestion={ActiveQuestion}/>
        <Recording interviewQuestions={interviewQuestions} ActiveQuestion={ActiveQuestion}  indata={indata}/>
        <div className='flex flex-wrap flex-row gap-3'>
          <Button disabled={ActiveQuestion<=0} onClick={()=>setActiveQuestion(ActiveQuestion-1)} variant="outline">Previous Question</Button>
          <Button disabled={ActiveQuestion==4} onClick={()=>setActiveQuestion(ActiveQuestion+1)} variant="outline">Next Question</Button>
         
         
          <Link href={'/dashboard/interview/'+ indata?.mockId+"/Feedback"} >
         <Button variant="">Submit Interview</Button>
         </Link>
        </div>

    </div>
  )
}
