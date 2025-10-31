import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { CustomBreadCrumb } from '@/components/custom-bread-crum';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles, WebcamIcon } from 'lucide-react';
import { InterviewPin } from '@/components/pin';
import LoaderPage from './loader-page';
import type { Interview } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Webcam from "react-webcam";

const MockLoadPage = () => {
    const { interviewId } = useParams();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterview = async () => {
            if (interviewId) {
                try {
                    const interviewDoc = await getDoc(doc(db, 'interviews', interviewId));
                    if (interviewDoc.exists()) {
                        setInterview({
                            id: interviewDoc.id,
                            ...interviewDoc.data(),
                        } as Interview);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchInterview();
    }, [interviewId]);

    // Handle navigation logic at the top
    if (isLoading) {
        return <LoaderPage className="w-full h-[70vh]" />;
    }

    if (!interviewId || !interview) {
        navigate('/generate', { replace: true });
        return null; // Return null to prevent rendering before redirection
    }

    // Function to handle the start button click
    const handleStartInterview = () => {
        if (isWebCamEnabled) {
            navigate(`/generate/interview/${interviewId}/start`);
        } else {
            // You can add a toast or a different alert here to notify the user
            alert("Please enable your webcam to start the interview.");
        }
    };

    return (
        <div className="flex flex-col w-full gap-8 py-5">
            <div className="flex flex-col items-center justify-between w-full gap-2">
                <CustomBreadCrumb
                    breadCrumbPage={interview?.position || ''}
                    breadCrumpItems={[
                        {
                            label: 'Mock Interviews',
                            link: '/generate',
                        },
                    ]}
                />
                {/* Use a regular Button with an onClick handler */}
                <Button onClick={handleStartInterview} size="sm">
                    Start <Sparkles />
                </Button>
            </div>
            {interview && <InterviewPin interview={interview} onMockPage />}
            <Alert className="bg-yellow-100/50 border-yellow-200 p-4 rounded-lg">
                <div className="flex">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                </div>
                <AlertTitle className="text-yellow-800 font-semibold">
                    Important Information
                </AlertTitle>
                <AlertDescription className="text-sm text-yellow-700 mt-1">
                    Please enable your webcam and microphone to start the AI-generated mock interview. The interview consists of two questions. You'll receive a personalized report based on your responses at the end.
                    <br />
                    <br />
                    <span className="font-medium">Note:</span> Your video is{' '}
                    <strong>never recorded</strong>. You can disable your webcam at any time.
                </AlertDescription>
            </Alert>
            <>
                <div className="flex items-center justify-center w-full h-full">
                    <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
                        {isWebCamEnabled ? (
                            <Webcam
                                onUserMedia={() => setIsWebCamEnabled(true)}
                                onUserMediaError={() => setIsWebCamEnabled(false)}
                                className="w-full h-full object-cover rounded-md"
                            />
                        ) : (
                            <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <Button onClick={() => setIsWebCamEnabled(!isWebCamEnabled)}>
                        {isWebCamEnabled ? "Disable Webcam" : "Enable Webcam"}
                    </Button>
                </div>
            </>
        </div>
    );
};

export default MockLoadPage;