"use client";
import { Button } from '@/components/ui/button';
import db from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { WebcamIcon } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Interview({ params }) {
  const [indata, setInData] = useState();
  const [webcam, setWebcam] = useState(false);
  const hasFetched = useRef(false); // To prevent double execution in StrictMode
  const pat = usePathname();

  useEffect(() => {
    if (!hasFetched.current) {
      console.log(params);
      GetInterviewDetails();
      hasFetched.current = true;
      console.log(pat)
    }
  }, [pat]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId)).execute();
      console.log(result);
      setInData(result[0]);
      toast.success('Interview details fetched successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch interview details.');
    }
  };

  return (
    <div className='flex p-4 flex-col gap-4 justify-center items-center'>
      <Toaster />
      <h1 className='text-center text-2xl font-bold'>Let's Get Started</h1>
      <div className='flex  flex-col lg:flex-row gap-5' >
        <div className='flex border-solid border-2 border-blue-500 lg:h-96 lg:w-96 w-64 h-64  rounded-lg items-center flex-col justify-center drop-shadow-lg'>
<div className='h-1/2 flex flex-col text-sm text-wrap items-center  justify-center'>
{indata && <>
          <p>Job Title:<strong>{indata.jobPosition}</strong></p>
         <p>Job Description:<strong>{indata.jobDesc}</strong></p>
         <p>Years of experience:<strong>{indata.jobExperience}</strong></p></>}
</div>
        <div className='bg-yellow-600 p-5 m-2 rounded-lg h-1/2'>
          <p>We dont save your video its just fot your practice you can also disable and give interview</p>
        </div>

        </div>
        <div className='flex flex-col'>
        {webcam ? (
          <Webcam
            mirrored={true}
            onUserMedia={() => {
              setWebcam(true);
              toast.success('Webcam started successfully!');
            }}
            onUserMediaError={()=>{
              setWebcam(false);
             
            }}
            className='h-64 w-64 lg:w-96 lg:h-96 bg-gray-300 '
          />
        ) : (
          <>
            <WebcamIcon className='h-48 w-48 lg:h-80 lg:w-80 bg-gray-300 rounded-lg mx-auto p-4' />
            <Button onClick={() => setWebcam(true)} className='mt-4 w-full mx-auto'>
              Enable Webcam
            </Button>
          </>
        )}
        </div>
      </div>
      {!webcam && <p>Check permission if getting errors</p>}
     <Link href={`${pat}/Start`} >
     <Button  >Start</Button>
     </Link>
    
    </div>
  );
}
