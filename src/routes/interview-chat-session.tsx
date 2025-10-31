import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '@/config/firebase.config';
import LoaderPage from './loader-page';
import { CustomBreadCrumb } from '@/components/custom-bread-crum';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';
import { QuestionForm } from '@/components/question-form';

interface Interview {
  id: string;
  position: string;
  questions: any[];
}

export const InterviewChatSession: React.FC = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams<{ interviewId: string }>(); 
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- ADDED CONSOLE LOGS FOR DEBUGGING ---
  console.log('Component rendered. Current interviewId:', interviewId);

  useEffect(() => {
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          console.log('Firebase doc fetched. Exists:', interviewDoc.exists());

          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview);
          } else {
            console.error("No such interview document!");
            // This would cause a redirect and a white screen on the original page
            // navigate("/generate", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching interview:", error);
          // navigate("/generate", { replace: true });
        } finally {
          setIsLoading(false);
          console.log('isLoading set to false');
        }
      } else {
        setIsLoading(false);
        console.log('No interviewId found, redirecting.');
        // navigate("/generate", { replace: true });
      }
    };
    fetchInterview();
  }, [interviewId, navigate]);

  // --- ADDED CONSOLE LOGS FOR DEBUGGING ---
  console.log('Current isLoading state:', isLoading);
  console.log('Current interview state:', interview);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  // --- ADDED A CHECK TO RENDER A MESSAGE INSTEAD OF NULL ---
  if (!interview) {
    console.log('Interview is null, showing a message.');
    // Return a message instead of null to see what's happening
    return <div className="p-5 text-center">No interview data found. Please go back to the dashboard.</div>;
  }
  
  console.log('Rendering full component...');

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          { label: interview?.position || "", link: `/generate/interview/${interview?.id}` },
        ]}
      />
      
      <div className="w-full">
        <Alert className="bg-sky-100 border border-sky-200 p-4 rounded-lg fl">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">Important Note</AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering the question. Once you finish the interview, you'll receive feedback comparing your responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never recorded.</span>
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {interview.questions && interview.questions.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-start gap-4">
          <QuestionForm questions={interview.questions} />
        </div>
      )}
    </div>
  );
};