import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'

function DashBoard() {
  return (
    <div className='p-10'>
      <h1 className='font-bold text-2xl'>Dashboard</h1>
      <h2>Create and start Your ai mock interview</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
<AddNewInterview/>
</div>
    </div>
  )
}

export default DashBoard