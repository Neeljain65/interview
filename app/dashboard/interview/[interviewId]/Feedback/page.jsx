"use client";
import db from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { chatSession } from '@/utils/AiGeminiModel';  // Import Gemini API integration
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';

function page({ params }) {
  const [Userfeedback, setUserFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    updateUserResults();
  }, []);

  useEffect(() => {
    if (Userfeedback.length > 0) {
      let totalRating = 0;
      Userfeedback.forEach(item => {
        totalRating += parseInt(item.rating || 0); // Ensure rating is a number
      });
      const avgRating = totalRating / Userfeedback.length;
      setAverageRating(avgRating);
    }
  }, [Userfeedback]);

  const updateUserResults = async () => {
    const feedbackData = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, params.interviewId)).orderBy(UserAnswer.id);
    
    const unanswered = feedbackData.filter(q => !q.feedback);
  
    if (unanswered.length > 0) {
      console.log("Generating feedback using FastAPI...");
  
      for (const ques of unanswered) {
        try {
          const response = await fetch("http://127.0.0.1:8000/generate_feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: ques.question,
              user_answer: ques.userAns
            })
          });
  
          const data = await response.json(); // { "feedback": "Your answer is good. Rating: 4/5." }
          let feedback = data.feedback;
          
          // Extract rating from feedback
          const ratingMatch = feedback.match(/Rating: (\d)\/5/);
          console.log("Rating Match:", ratingMatch);
          const rating = ratingMatch ? parseInt(ratingMatch[1]) : "N/A";
  
          // Store feedback in DB
          await db.update(UserAnswer)
            .set({
              feedback: feedback,
              rating: rating? rating :0  // Optional, frontend can extract this dynamically
            })
            .where(eq(UserAnswer.id, ques.id))
            .execute();
  
          ques.feedback = feedback;
          ques.rating = rating;
  
        } catch (error) {
          console.error("Error generating feedback:", error);
        }
      }
    }
  
    setUserFeedback(feedbackData);
    setLoading(false);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
      <h2 className="font-semibold text-blue-500">Here's Your Detailed Feedback with AI. Go through the Question and Scope of Improvement.</h2>

      {averageRating > 0 && (
        <h2 className="text-2xl mt-3 font-semibold text-orange-300">
          Your Average Rating: {averageRating.toFixed(1)}
        </h2>
      )}

      {loading ? (
        <div className="flex flex-col space-y-3 mt-10">
          <Skeleton className="h-[70px] w-full bg-gray-400 rounded" />
          <Skeleton className="h-[70px] w-full bg-gray-400 rounded-md" />
          <Skeleton className="h-[70px] w-full bg-gray-400 rounded-md" />
        </div>
      ) : (
        Userfeedback.map((ques, index) => (
          <Accordion key={index} type="single" collapsible className="w-full flex flex-wrap">
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm lg:text-xl">{ques?.question}</AccordionTrigger>
              <AccordionContent>
                <h1>Rating: <strong>{ques?.rating || "N/A"}</strong></h1>
                <h2>Your Answer: {ques?.userAns}</h2><br />
                <h2>Scope of Improvement:</h2>
                <p>{ques?.feedback || "Feedback not available"}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))
      )}
    </div>
  );
}

export default page;
