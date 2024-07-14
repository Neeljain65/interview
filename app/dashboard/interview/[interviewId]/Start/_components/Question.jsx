import { Lightbulb, Volume } from 'lucide-react'
import React, { useState } from 'react'

function Question({interviewQuestions, ActiveQuestion}) {
   const texttoSpeak=(text)=>{
    if ('speechSynthesis' in window) {
      let msg = new SpeechSynthesisUtterance();
      msg.text = text;
      window.speechSynthesis.speak(msg);
    }
    else {
      alert("Sorry, your browser doesn't support this feature");
    }
   }
  return interviewQuestions&&(
    <div className='p-5 border rounded-lg'>
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
    {interviewQuestions && interviewQuestions.map((ques, index) => (
        <h2 className={`bg-secondary text-center p-3 rounded-full cursor-pointer ${ActiveQuestion===index && 'bg-blue-950 text-white'}`} key={index} >#question {index + 1}</h2>
      ))}
    </div>
      <h2 className='mt-5'>{interviewQuestions[ActiveQuestion]?.question}</h2>
      <Volume className='mt-3' height={40} width={40} onClick={()=>texttoSpeak(interviewQuestions[ActiveQuestion]?.question)} />
      <div className='bg-blue-200 rounded-lg p-3 mt-5'>
      <h2 className='flex '>
        <Lightbulb/><strong>Note:</strong>
      </h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque dignissimos est tempore earum numquam repellendus obcaecati illum totam nesciunt aperiam, aliquid unde delectus nihil voluptas. Impedit perferendis necessitatibus earum perspiciatis!</p>
      </div>
    </div>
  )
}

export default Question