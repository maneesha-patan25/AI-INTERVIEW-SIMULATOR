// components/record-answer.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from "@clerk/clerk-react";
import {
  CircleCheck,
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Star,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import useSpeechToText, { type ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { toast } from "sonner";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { TooltipButton } from "./tooltip-button";
import { SaveModal } from './save-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from "@/config/firebase.config";
import { chatSession } from '@/scripts';

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  useEffect(() => {
    const combineTranscripts = results
      .map((result) => (result as ResultType).transcript)
      .join(" ");
    if (combineTranscripts) {
      setUserAnswer(combineTranscripts);
    }
  }, [results]);

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer?.length < 30) {
        toast.error("Answer is too short", {
          description: "Please provide an answer longer than 30 characters.",
        });
        return;
      }
      const aiFeedback = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );
      setAiResult(aiFeedback);
    } else {
      setAiResult(null);
      setUserAnswer("");
      startSpeechToText();
    }
  };
  
  const cleanJsonResponse = (responseText: string): AIResponse => {
    const cleanText = responseText.replace(/(```json|```|`)/g, "").trim();
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Invalid JSON format after cleaning:", cleanText);
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateResult = async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) and concise feedback for improvement.
      Return the result ONLY in JSON format with "ratings" (number) and "feedback" (string) fields.
    `;
    try {
      const result = await chatSession.sendMessage(prompt);
      const parsedResult = cleanJsonResponse(result.response.text());
      return parsedResult;
    } catch (error) {
      console.error(error);
      toast.error("AI Feedback Error", {
        description: "An error occurred while generating feedback.",
      });
      return { ratings: 0, feedback: "Unable to generate feedback." };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setAiResult(null);
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
  };
  
  const saveUserAnswer = async () => {
    if (!question?.answer || question.answer.trim() === "") {
      toast.error("System Error: Missing Expected Answer", {
        description: "The expected answer for this question was not found.",
      });
      return;
    }
    
    setLoading(true);
    if (!aiResult) {
      setLoading(false);
      return;
    }
    try {
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("mockIdRef", "==", interviewId),
        where("question", "==", question.question)
      );
      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        toast.info("You have already answered this question.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "userAnswers"), {
        mockIdRef: interviewId,
        question: question.question,
        correct_ans: question.answer,
        user_ans: userAnswer,
        feedback: aiResult.feedback,
        rating: aiResult.ratings,
        userId,
        createdAt: serverTimestamp(),
      });
      toast.success("Your answer has been saved successfully.");
      setUserAnswer("");
      setAiResult(null);
    } catch (error) {
      toast.error("Error saving answer.");
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-4">
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      <div className="w-full h-96 md:w-[600px] flex items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          <WebCam mirrored={true} className="w-full h-full object-cover rounded-md" />
        ) : (
          <WebcamIcon className="w-24 h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <TooltipButton
          content={isWebCam ? "Turn Off Webcam" : "Turn On Webcam"}
          icon={isWebCam ? <VideoOff /> : <Video />}
          onClick={() => setIsWebCam(!isWebCam)}
          disabled={isRecording || isAiGenerating}
        />
        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={isRecording ? <CircleStop className="text-red-500" /> : <Mic />}
          onClick={recordUserAnswer}
          disabled={isAiGenerating}
        />
        <TooltipButton
          content="Record Again"
          icon={<RefreshCw />}
          onClick={recordNewAnswer}
          disabled={isRecording || isAiGenerating}
        />
        <TooltipButton
          content="Save Result"
          icon={loading ? <Loader className="animate-spin" /> : <Save />}
          onClick={() => setOpen(true)}
          disabled={!aiResult || isRecording || isAiGenerating}
        />
      </div>

      {(userAnswer || interimResult) && !aiResult && (
        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {userAnswer}
            {interimResult && <span className="text-primary/60"> {interimResult}</span>}
          </CardContent>
        </Card>
      )}

      {isAiGenerating && (
        <div className="w-full mt-4 flex flex-col items-center gap-2">
          <Loader className="animate-spin" />
          <p className="text-muted-foreground">Generating feedback...</p>
        </div>
      )}

      {aiResult && (
        <div className='w-full mt-4 space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-yellow-400" /> Your Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{aiResult.ratings}/10</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleCheck className="text-green-500" /> AI Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{aiResult.feedback}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};