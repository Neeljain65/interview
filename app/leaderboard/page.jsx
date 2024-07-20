import db from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq, sql } from "drizzle-orm";

const fetchleaderboard =async()=>{
  const result=  await db.select({
    createdBy: MockInterview.createdBy,
    avgRating:sql`AVG(CAST(${UserAnswer.rating} AS INT))`
  })
  .from(UserAnswer)
  .innerJoin(MockInterview, eq(UserAnswer.userEmail, MockInterview.createdBy))
  .groupBy(MockInterview.createdBy)
  .execute(); 
  
  return await result;
} 

const Leaderboard = async() => {
  const leaderboard = await fetchleaderboard();
    
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