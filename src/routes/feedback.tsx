import { db } from "@/config/firebase.config";
import { type Interview, type UserAnswer } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoaderPage from "./loader-page";
import { CustomBreadCrumb } from "@/components/custom-bread-crum";
import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Handle invalid ID as a side effect
    if (!interviewId) {
      navigate("/generate", { replace: true });
      return;
    }

    // 2. Use AbortController for cleanup
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch interview and feedback in parallel
        const [interviewDoc, feedbackQuerySnap] = await Promise.all([
          getDoc(doc(db, "interviews", interviewId)),
          getDocs(
            query(
              collection(db, "userAnswers"),
              where("userId", "==", userId),
              where("mockIdRef", "==", interviewId)
            )
          ),
        ]);

        // Abort if component has unmounted
        if (signal.aborted) return;

        // Set interview data
        if (interviewDoc.exists()) {
          setInterview({ id: interviewDoc.id, ...interviewDoc.data() } as Interview);
        }

        // Set feedback data
        const feedbackData = feedbackQuerySnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as UserAnswer)
        );
        setFeedbacks(feedbackData);

      } catch (error) {
        if (!signal.aborted) {
          console.error(error);
          toast.error("Failed to load feedback", {
            description: "An error occurred while fetching your data.",
          });
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // 3. Cleanup function to abort fetch on unmount
    return () => {
      controller.abort();
    };
  }, [interviewId, navigate, userId]);

  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";
    const totalRatings = feedbacks.reduce((acc, feed) => acc + feed.rating, 0);
    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage={"Feedback"}
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: `${interview?.position}`,
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />

      <Headings
        title="Congratulations!"
        description="Your personalized feedback is now available. Dive in to see your strengths, areas for improvement, and tips to help you ace your next interview."
      />

      <p className="text-base text-muted-foreground">
        Your overall interview rating:{" "}
        <span className="text-emerald-500 font-semibold text-xl">
          {overAllRating} / 10
        </span>
      </p>

      {interview && <InterviewPin interview={interview} onMockPage />}

      <Headings title="Interview Feedback" isSubHeading />

      {/* 4. Handle the 'No Feedback' case */}
      {feedbacks.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-6">
          {feedbacks.map((feed) => (
            <AccordionItem key={feed.id} value={feed.id} className="border rounded-lg shadow-md">
              <AccordionTrigger
                onClick={() => setActiveFeed(feed.id)}
                className={cn(
                  "px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline",
                  activeFeed === feed.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50"
                    : "hover:bg-gray-50"
                )}
              >
                <span>{feed.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner">
                <div className="text-lg font-semibold to-gray-700">
                  <Star className="inline mr-2 text-yellow-400" />
                  Rating: {feed.rating}
                </div>
                <Card className="border-none space-y-3 p-4 bg-green-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-green-600" />
                    Expected Answer
                  </CardTitle>
                  <CardDescription className="font-medium text-gray-700">
                    {feed.correct_ans}
                  </CardDescription>
                </Card>
                <Card className="border-none space-y-3 p-4 bg-yellow-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-yellow-600" />
                    Your Answer
                  </CardTitle>
                  <CardDescription className="font-medium text-gray-700">
                    {feed.user_ans}
                  </CardDescription>
                </Card>
                <Card className="border-none space-y-3 p-4 bg-red-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-red-600" />
                    Feedback
                  </CardTitle>
                  <CardDescription className="font-medium text-gray-700">
                    {feed.feedback}
                  </CardDescription>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center">
          <h3 className="text-xl font-semibold">No Feedback Found</h3>
          <p className="text-muted-foreground mt-2">
            It looks like you haven't completed this mock interview yet.
          </p>
        </div>
      )}
    </div>
  );
};