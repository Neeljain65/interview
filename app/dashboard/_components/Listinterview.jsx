"use client"
import db from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import Interviewcards from './Interviewcards';
import { Skeleton } from '@/components/ui/skeleton';

function Listinterview() {
  const { user } = useUser();
  const [userInterviews, setUserInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const listinterview = async (userEmail) => {
    if (!userEmail) return;
    const interviews = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.createdAt));

    setLoading(false);
    setUserInterviews(interviews);
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      listinterview(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  return (
    <div className=''>
      <h1 className='font-bold text-xl'>Your Interviews</h1>
      <div>
        {loading ? (
          <div className='grid lg:grid-cols-3 gap-y-3'>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-md bg-slate-400" />
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-md bg-slate-400" />
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-md bg-slate-400" />
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-5'>
            {userInterviews && userInterviews.map((interview, index) => (
              <Interviewcards key={index} interviews={interview} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Listinterview;
