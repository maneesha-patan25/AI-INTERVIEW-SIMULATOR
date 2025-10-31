import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config"; // Your Firestore config
import { FormMockInterview } from "@/components/form-mock-interview"; // Your form component
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Interview } from "@/types";

export const CreateEditPage = () => {
  // Use useParams to get the interviewId from the URL
  const { interviewId } = useParams<{ interviewId: string }>();
  
  // State to hold the fetched data and the loading status
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    // This effect runs whenever the interviewId changes
    const fetchInterviewData = async () => {
      // Check if an interviewId exists, which means we are in 'edit' mode
      if (interviewId) {
        setLoading(true);
        try {
          const docRef = doc(db, "interviews", interviewId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Found the document, set it as initial data
            const data = {
              ...docSnap.data(),
              id: docSnap.id,
              // Convert Firestore Timestamp to Date object if needed
              createdAt: docSnap.data().createdAt?.toDate(),
              updatedAt: docSnap.data().updatedAt?.toDate(),
            } as unknown as Interview;
            setInterview(data);
          } else {
            // Document not found, maybe show a not-found page or toast
            toast.error("Error", {
              description: "Interview not found.",
            });
            setInterview(null); // Ensure a blank form is not shown
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          toast.error("Error", {
            description: "Failed to load interview data.",
          });
          setInterview(null);
        } finally {
          setLoading(false);
        }
      } else {
        // No interviewId in URL, this is for a new interview
        setInterview(null);
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [interviewId]);

  // Render a loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
      </div>
    );
  }

  // Render the form, passing the fetched data if available
  return (
    <div className="p-4 md:p-8">
      {/* The prop name should be 'initialData', not 'InitialData' */}
      <FormMockInterview initialData={interview} />
    </div>
  );
};
