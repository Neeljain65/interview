import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex flex-col w-screen h-screen p-5 justify-center items-center"
      
    >
      <NeonGradientCard className="flex flex-col lg:h-2/5 h-4/5 lg:w-2/3 w-4/5 items-center justify-center text-center">
      <span className="flex justify-center items-center flex-col pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center  font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
      
      <h1 className="lg:text-7xl text-3xl  text-black text-wrap"> Welcome to MockAi</h1>
        <h1 class="text-2xl p-4 text-center font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent">Best Place to practice your interview Skills</h1>

</span>

    </NeonGradientCard>
    <Link href="/dashboard">
<Button className="mt-5">Get Started</Button></Link>
    </div>
  );
}
