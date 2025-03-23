"use client";
import { useState } from "react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import db from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      console.log(jobPosition, jobDesc, jobExperience);

      // API call to FastAPI instead of Gemini
      const response = await fetch("https://interview-g0pl.onrender.com/get_questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_role: jobPosition,
          technology: jobDesc,
          experience: jobExperience,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data.questions);

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions found for the given role.");
      }

      // Format response into JSON structure for database storage
      const formattedQuestions = data.questions.map((q) => ({
        question: q.question, 
        answer: "N/A", // Placeholder for now
      }));

      setJsonResponse(formattedQuestions);

      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: JSON.stringify(formattedQuestions), // Store questions
        jobPosition,
        jobDesc,
        jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdByName: user?.fullName,
        createdAt: moment().format("MMMM-Do-YYYY"),
      }).returning({ uid: MockInterview.mockId }).execute();

      console.log("Stored Interview ID:", resp);

      if (resp) {
        setIsOpen(false);
        router.push(`/dashboard/interview/${resp[0].uid}`);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("An error occurred while fetching interview questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setIsOpen(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Your Mock Interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit} className="flex gap-y-1 flex-col">
                <div className="mt-7 my-3">
                  <label>Job Role/Job Position</label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label>Job Description/ Tech Stack (In Short)</label>
                  <Textarea
                    placeholder="Ex. React, Angular, NodeJs, MySql"
                    required
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label>Years of experience</label>
                  <Input
                    placeholder="Ex. 5"
                    type="number"
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
                <div className="flex gap-10 mx-auto">
                  <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                  <Button type="submit" disabled={loading} className="bg-blue-500">
                    {loading ? <><LoaderCircle className="animate-spin" /> Generating...</> : "Start"}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
