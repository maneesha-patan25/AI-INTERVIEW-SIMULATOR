import { Headings } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "@/config/firebase.config";
import { useEffect, useState } from "react";
import type { Interview } from "@/types";
import { onSnapshot, query, where, collection, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewPin } from "@/components/pin";

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const { userId } = useAuth();
  // 👇 1. Add state to store the IDs of completed interviews
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  // This useEffect fetches the list of interviews in real-time
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Interview)
        );
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching interviews: ", error);
        toast.error("Failed to load interviews.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  // 👇 2. Add a new useEffect to fetch the user's past answers once
  useEffect(() => {
    if (!userId) return;

    const fetchUserAnswers = async () => {
      try {
        const answersQuery = query(
          collection(db, "userAnswers"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(answersQuery);
        const ids = new Set<string>();
        querySnapshot.forEach((doc) => {
          ids.add(doc.data().mockIdRef);
        });
        setAnsweredIds(ids);
      } catch (error) {
        console.error("Failed to fetch user answers:", error);
      }
    };
    fetchUserAnswers();
  }, [userId]);

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <Headings
          title="Dashboard"
          description="Create and start your AI Mock Interview"
        />
        <Link to={"/generate/create"}>
          <Button size={"sm"}>
            <Plus className="h-4 w-4 mr-2" /> Add New
          </Button>
        </Link>
      </div>
      <Separator className="my-8" />
      <div className="md:grid md:grid-cols-3 gap-3 py-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-md" />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            // 👇 3. Pass the 'isAnswered' prop to the pin
            <InterviewPin
              key={interview.id}
              interview={interview}
              isAnswered={answeredIds.has(interview.id)}
            />
          ))
        ) : (
          <p className="col-span-3 text-center text-muted-foreground">
            No interviews found. Click "Add New" to create one!
          </p>
        )}
      </div>
    </div>
  );
};