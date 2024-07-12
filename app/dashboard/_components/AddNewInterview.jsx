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

function AddNewInterview() {
  const [isOpen, setIsOpen] = useState(false)
  const [jobPosition, setJobPosition]=useState();
  const [jobDesc, setJobDesc]=useState();
  const [jobExperience, setJobExperience]=useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience)
  }
  return (
    
    <div>
    <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover: shadow-md cursor-pointer transition-all' onClick={()=>setIsOpen(true)}>
    <h2 className='font-bold text-lg text-center'>+ Add New</h2>
    </div>
    <Dialog open={isOpen}>
  
  <DialogContent >
    <DialogHeader>
      <DialogTitle>Start Your Mock Interview </DialogTitle>
      
      <DialogDescription >
       <div>
       <form onSubmit={handleSubmit} className="flex gap-y-1 flex-col">
       <div className='mt-7 my-3'>
<label>Job Role/Job Position</label>
<Input  placeholder="Ex. Full Stack Developer" required onChange={(e)=>setJobPosition(e.target.value)}  />
</div>
        <div className=' my-3'>
        <label>Job Description/ Tech Stack (In Short)</label>
        <Textarea placeholder="Ex. React, Angular, NodeJs, MySql" required onChange={(e)=>setJobDesc(e.target.value)}/>
        </div>
        <div className=' my-3'>
        <label>Years of experience</label>
        <Input placeholder="Ex.5" type="number"  onChange={(e)=>setJobExperience(e.target.value)}/>
        </div>
        <div className='flex gap-10 mx-auto'>
          <button  onClick={()=>setIsOpen(false)}>cancel</button>
          <Button type="submit" className="bg-blue-500">Start</Button>
        </div>
       </form>
       </div>
        
      </DialogDescription>

    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview;