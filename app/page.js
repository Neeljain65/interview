import BoxReveal from "@/components/magicui/box-reveal";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "./dashboard/_components/Header";
import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon, Instagram } from "lucide-react";
import NumberTicker from "@/components/magicui/number-ticker";
import Features from "./dashboard/_components/Features";
import Component from "./dashboard/_components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col flex-grow w-screen p-5 justify-center items-center">
        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <p className="text-[3.5rem] text-center font-semibold">
            Mocky-Interview<span className="text-[#5046e6]">.</span>
          </p>
        </BoxReveal>
        
        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <h2 className="mt-[.5rem] text-[1rem]">
            Place to practice your interviews{" "}
          </h2>
        </BoxReveal>
        
        <div className="flex gap-5 mt-10">
          <div>
            <p className="whitespace-pre-wrap lg:text-8xl text-5xl font-medium tracking-tighter text-black dark:text-white">
              <NumberTicker value={100} />+
            </p>
            <div className="text-center font-bold">Users</div>
          </div>
          
          <div>
            <p className="whitespace-pre-wrap lg:text-8xl text-5xl font-medium tracking-tighter text-black dark:text-white">
              <NumberTicker value={150} />+
            </p>
            <div className="text-center font-bold">Interviews</div>
          </div>
        </div>
        
        <div className="z-10 flex min-h-[16rem] items-center justify-center">
          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <Link href={"/dashboard"}>
                <span>✨ Explore Now</span>
              </Link>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Features title={"Personalized Interview Simulation"} desc={"Experience tailored mock interviews designed specifically for your desired job role and industry"} />
          <Features title={"Real-Time Feedback and Scoring"} desc={"Receive immediate, detailed feedback after each interview session."} />
          <Features title={"Competitive Leaderboard"} desc={"Challenge yourself and stay motivated by competing on our global leaderboard."} />
        </div>
      </div>
     <div className="flex flex-col items-center justify-center w-screen p-5">
     <Link href="https://www.instagram.com/neel_jain__/" className="text-xl font-bold">Neel Jain</Link>
     <Component />
     </div>
    </div>
  );
}
