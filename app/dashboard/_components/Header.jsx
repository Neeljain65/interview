"use client"
import { UserButton } from '@clerk/nextjs'

import { usePathname } from 'next/navigation';

import { UserProfileDetails } from "react-leetcode";

import React from 'react';
import Link from 'next/link';
function Header() {
   
const path=usePathname();   
  return (
    <div>
<div className='flex p-4 mx-3 flex-row items-center justify-between'>
        <div className='font-bold'>MockAi</div>
        <ul className='flex gap-5'>
          <Link href={"/dashboard"}>
          <li className={`hover:text-primary hover:font-bold ${path=='/dashboard' && 'font-bold' } `}>Dashboard</li>
          </Link>
            <Link href={"/about"}>
            <li className={`hover:text-primary hover:font-bold ${path=='/About' && 'font-bold' } `}>About</li></Link>
            </ul>
        <UserButton/>
        </div>
    
    </div>
  )
}

export default Header