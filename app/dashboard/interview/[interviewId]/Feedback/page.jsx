"use client";
import db from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React from 'react'
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from '@/components/ui/skeleton';
function page({params}) {
  let rating=0;
 
const [Userfeedback, setUserFeedback] = useState([]);
const [loading, setLoading] = useState(true);
  useEffect(() => {
     {
         updateUserResults();
        }
      }, []);
     
      
      const updateUserResults = async () => {
        const feedback=await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef,params.interviewId)).orderBy(UserAnswer.id);
        console.log(feedback);
        setUserFeedback(feedback);
        setLoading(false);
      }

  return (
    <div>
     <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
     <h2 className='font-semibold text-blue-500'>Here's Your Detailfeedback with Ai go through Question and Scope of Environment </h2>
     {loading?<>
     
      <div className="flex flex-col space-y-3 mt-10">
            <Skeleton className="h-[70px] w-full bg-gray-400 rounded" />
            <Skeleton className="h-[70px] w-full bg-gray-400 rounded-md" />
            <Skeleton className="h-[70px] w-full bg-gray-400 rounded-md" />
          
            
          </div>
     </>:<>
      {Userfeedback && Userfeedback.map((ques, index) => (
          <Accordion key={index} type="single" collapsible className="w-full flex flex-wrap">
         <AccordionItem value="item-1">
           <AccordionTrigger className="text-left text-sm lg:text-xl">{ques?.question}</AccordionTrigger>
           <AccordionContent>
            <h1>Rating <strong>{ques?.rating}</strong></h1>
             {ques?.feedback}
           </AccordionContent>
         </AccordionItem>
       </Accordion>
      ))}</>}
    </div>
  )
}

export default page