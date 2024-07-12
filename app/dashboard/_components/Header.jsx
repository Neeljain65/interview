"use client"
import { UserButton } from '@clerk/nextjs'

import { usePathname } from 'next/navigation';

import { UserProfileDetails } from "react-leetcode";

import React from 'react';
function Header() {
   
const path=usePathname();   
  return (
    <div className='flex p-4 flex-row items-center justify-between'>
        <div>Logo</div>
        <ul className='flex gap-5'>
            <li className={`hover:text-primary hover:font-bold ${path=='/dashboard' && 'font-bold' } `}>Dashboard</li>
            <li className={`hover:text-primary hover:font-bold ${path=='/Question' && 'font-bold' } `}>Questions</li>
            <li className={`hover:text-primary hover:font-bold ${path=='/About' && 'font-bold' } `}>About</li>
            
        </ul>
        <UserButton/>
        
    
      
    
  
    </div>
  )
}

export default Header