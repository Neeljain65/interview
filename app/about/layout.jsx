import React from 'react'
import Header from '../dashboard/_components/Header'

export default function DashBoardLayout({ children}) {
  return (
    <div>
      <Header />
      <div className='mx-5 lg:mx-36'>
      {children}

      </div>
      </div>
  )
}
