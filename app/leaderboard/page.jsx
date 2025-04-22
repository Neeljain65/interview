"use client";
  import React, { useEffect, useState } from 'react';
  import { useUser } from '@clerk/nextjs';
import { eq, sql } from 'drizzle-orm';
import { MockInterview, UserAnswer } from '@/utils/schema';
import db from '@/utils/db';
import Header from '../dashboard/_components/Header';
  const fetchLeaderboard = async (page, limit) => {
    const offset = (page - 1) * limit;
  
    const result = await db
      .select({
        createdBy: MockInterview.createdBy,
        avgRating: sql`AVG(CAST(${UserAnswer.rating} AS NUMERIC))`
      })
      .from(UserAnswer)
      .innerJoin(MockInterview, eq(UserAnswer.userEmail, MockInterview.createdBy))
      .groupBy(MockInterview.createdBy)
      .orderBy(sql`AVG(CAST(${UserAnswer.rating} AS NUMERIC)) DESC`)
      .offset(offset)
      .limit(limit)
      .execute();
      
    return result;
  };
  

  const Leaderboard = () => {
    const user1 = useUser();
    
    const [leaderboard, setLeaderboard] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // Number of items per page
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState({ name: 'Current User', avgRating: 4.5 }); // Replace with actual user data
  
    useEffect(() => {
      const getLeaderboard = async () => {
        const data = await fetchLeaderboard(page, limit);
        setLeaderboard(data);
        // Assuming you have a way to get the total number of items
        // setTotalPages(Math.ceil(totalItems / limit));
      };
  
      getLeaderboard();
    }, [page]);
  
    const handlePrevPage = () => {
      if (page > 1) {
        setPage(page - 1);
      }
    };
  
    const handleNextPage = () => {
      if (page < totalPages) {
        setPage(page + 1);
      }
    };
  
    return (
      <div className="overflow-x-hidden bg-gray-100 min-h-screen">
        <Header/>
        <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
        <div className='p-3'>
        <div className="flex mx-auto flex-col gap-2 lg:w-1/2">
          {leaderboard.map((item, index) => (
            <div
              key={item.createdBy}
              className={`p-4 rounded shadow ${
                index === 0 ? 'bg-gold' : 'bg-white'
              }`}
            >
              <p className="text-lg font-medium">{item.createdBy}</p>
              <p className="text-sm">Average Rating: {parseFloat(item.avgRating).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4 w-1/2 mx-auto">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {page === 1 ? 'First' : 'Prev'}
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        
        </div>
      </div>
    );
  };
  
  export default Leaderboard;
  