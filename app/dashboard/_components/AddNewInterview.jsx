"use client";
import { useState } from 'react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/AiGeminiModel';
import { LoaderCircle } from 'lucide-react';
import db from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [isOpen, setIsOpen] = useState(false)
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      console.log(jobPosition, jobDesc, jobExperience);
      const InputPromt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Depends on this information, please give me 5 interview questions with answers in JSON format. Give questions and answers in JSON fields. Don't send the **Note** section, just the questions and answers.[
  {
    "question":,
    "answer": 
    } Send in this format only
]`;
      
      const result = await chatSession.sendMessage(InputPromt);
      let res = await result.response.text();
      res = res.replace('```json', '').replace('```', '').trim(); // Clean up the response

      const parsedResponse = JSON.parse(res);
      setJsonResponse(parsedResponse);

      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: res,
        jobPosition,
        jobDesc,
        jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('MMMM-Do-YYYY')
      }).returning({ uid: MockInterview.mockId }).execute();

      console.log("id:", resp);

      if (resp) {
        setIsOpen(false);
        router.push(`/dashboard/interview/${resp[0].uid}`);
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setIsOpen(true)}>
        <h2 className='font-bold text-lg text-center'>+ Add New</h2>
      </div>
    
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Your Mock Interview</DialogTitle>
            <DialogDescription>
              <div>
                <form onSubmit={handleSubmit} className="flex gap-y-1 flex-col">
                  <div className='mt-7 my-3'>
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required onChange={(e) => setJobPosition(e.target.value)} />
                  </div>
                  <div className='my-3'>
                    <label>Job Description/ Tech Stack (In Short)</label>
                    <Textarea placeholder="Ex. React, Angular, NodeJs, MySql" required onChange={(e) => setJobDesc(e.target.value)} />
                  </div>
                  <div className='my-3'>
                    <label>Years of experience</label>
                    <Input placeholder="Ex.5" type="number" required onChange={(e) => setJobExperience(e.target.value)} />
                  </div>
                  <div className='flex gap-10 mx-auto'>
                    <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                    <Button type="submit" disabled={loading} className="bg-blue-500">
                      {loading ? <><LoaderCircle className='animate-spin' /> 'Generating'</> : 'Start'}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
