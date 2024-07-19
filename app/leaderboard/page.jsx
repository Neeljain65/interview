// pages/leaderboard.jsx
"use client";
import { useEffect, useState } from 'react';

import { avg, eq, sql, sum } from 'drizzle-orm';
import db from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
  
    useEffect(() => {
      async function fetchLeaderboard() {
        try {
          const result = await db
            .select({
              createdBy: MockInterview.createdBy,
              avgRating:sql`AVG(CAST(${UserAnswer.rating} AS INT))`
            })
            .from(UserAnswer)
            .innerJoin(MockInterview, eq(UserAnswer.userEmail, MockInterview.createdBy))
          .groupBy(MockInterview.createdBy)
            .execute();
  
          setLeaderboard(result);
        } catch (error) {
          console.error('Failed to fetch leaderboard data:', error);
        }
      }
  
      fetchLeaderboard();
    }, []);
  
    return (
      <div>
        <h1>Leaderboard</h1>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{entry.createdBy}</td>
                <td>{entry.avgRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Leaderboard;