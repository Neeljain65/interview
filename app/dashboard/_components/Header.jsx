import { UserButton } from '@clerk/nextjs'

import { UserProfileDetails } from "react-leetcode";
function Header() {
   
   
  return (
    <div className='flex p-4 flex-row items-center justify-between'>
        <div>Logo</div>
        <ul className='flex gap-5'>
            <li className='hover:text-primary hover:font-bold '>Hgduyagd</li>
            <li className='hover:text-primary hover:font-bold '>Hgduyagd</li>
            <li className='hover:text-primary hover:font-bold '>Hgduyagd</li>
            
        </ul>
        <UserButton/>
        
    
      
    
  
    </div>
  )
}

export default Header