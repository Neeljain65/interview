import db from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";

const leaderBoardPage=(props)=>{
    console.log(props.data)
    return (
        <div>
        <h1>Leaderboard</h1>
        
        </div>
    );
}
export const getServerSideProps = async (context) => {
 try{ const data= await db.select({
  createdBy: MockInterview.createdBy,
  avgRating:sql`AVG(CAST(${UserAnswer.rating} AS INT))`
})
.from(UserAnswer)
.innerJoin(MockInterview, eq(UserAnswer.userEmail, MockInterview.createdBy))
.groupBy(MockInterview.createdBy)
.execute();

console.log(data)
return {
  props: { data },
};
} catch (error) {
console.error('Failed to fetch leaderboard data:', error);
}

} 

export default leaderBoardPage; 