import { Button } from '@/components/ui/button'
import { CloudLightning, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import toast, { Toaster } from 'react-hot-toast';
import { chatSession } from '@/utils/AiGeminiModel';
import db from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { usePathname } from 'next/navigation';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';

function Recording({ interviewQuestions, ActiveQuestion, indata }) {
  const { user } = useUser();
  const [Userresults, setUserResults] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    if (!isRecording && Userresults.length > 5) {
      updateUserResults();
    }
  }, [Userresults]);

  useEffect(() => {
    results.map((result) => (
      setUserResults(prevans => prevans + result?.transcript)));
  }, [results]);

  const startStop = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  }

  const updateUserResults = async () => {

const userID=indata?.mockId;

    console.log(Userresults);
    setLoading(true);
    try {
  //     const exist=await db.select().from(UserAnswer).where(and(eq(UserAnswer.mockIdRef,indata?.mockId),eq(UserAnswer.question,interviewQuestions[ActiveQuestion]?.question))).orderBy(UserAnswer.id);
  //  console.log(exist);
  //  if(exist){
  //   toast.error('You have already answered this question');
  //   return;
  //  }
      const FeedbackPromt = `Question: ${ActiveQuestion}, user Answer: ${Userresults}, Review and just give Feedback give user rating out of 5 and scope of improvement in 3-5 lines in JSON format with rating and scope of improvement. Don’t give **Explanations**.`;
      const result = await chatSession.sendMessage(FeedbackPromt);

      const MockResp = (await result.response.text()).replace('```json', '').replace('```', '');
      console.log(MockResp);

      const jsonMockResp = JSON.parse(MockResp);
      
      const response = await db.insert(UserAnswer).values({
        mockIdRef: indata?.mockId,
         uidd:indata?.mockId,
        question: interviewQuestions[ActiveQuestion]?.question,
        correctAns: interviewQuestions[ActiveQuestion]?.correctAns,
        userAns: Userresults,
        feedback: jsonMockResp.scopeOfImprovement,
        rating: jsonMockResp.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('MMMM-Do-YYYY')
      }).execute();

      if (response) {
        toast.success('Answer Recorded Successfully');
        setResults([]);
      }
    } catch (error) {
      console.error('Error updating user results:', error);
      toast.error('An error occurred while recording your answer.');
    } finally {
      setResults([]);
      setUserResults('');
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <Toaster />
      <div className='flex flex-col mt-5 justify-center items-center'>
        <Webcam className='w-64 h-64 lg:h-96 lg:w-96 bg-black rounded-lg' />
      </div>
      <Button disabled={loading} onClick={startStop} className="mt-5">
        {isRecording ? <h2 className='text-red-700'>Recording...</h2> : <h2>Record Answer</h2>}
      </Button>
      <Button variant="ghost" className="mt-5" onClick={() => console.log(Userresults)}>Show User Answer</Button>
    </div>
  )
}

export default Recording;