import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "./ui/tabs";
import { Button } from './ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { RecordAnswer } from './record-answer'; // 👈 Added import

interface Question {
  question: string;
  answer: string;
}

interface QuestionFormProps {
  questions: Question[];
}

export const QuestionForm = ({ questions }: QuestionFormProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [isWebCam, setIsWebCam] = useState(false); // 👈 Added state for webcam

  useEffect(() => {
    if (questions && questions.length > 0) {
      setActiveTab(questions[0].question);
    }
  }, [questions]);

  const handleStartInterview = () => {
    setIsPlaying(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handlePlayQuestion = (questionText: string) => {
    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      const utterance = new SpeechSynthesisUtterance(questionText);
      window.speechSynthesis.speak(utterance);
      setCurrentSpeech(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  if (!questions || questions.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No questions found for this interview.</div>;
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-gray-100 border border-gray-200 w-full justify-start p-2 rounded-md mb-4">
          {questions.map((tab, i) => (
            <TabsTrigger
              key={tab.question}
              value={tab.question}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === tab.question
                  ? 'bg-white text-blue-600 shadow'
                  : 'hover:bg-gray-200'
              }`}
            >
              {`Question #${i + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>
        {questions.map((tab) => (
          <TabsContent key={tab.question} value={tab.question}>
            <div className="p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{tab.question}</h3>
                <Button 
                  onClick={() => handlePlayQuestion(tab.question)}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span>Start</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* 👇 RecordAnswer component added here */}
            <div className="my-4">
              <RecordAnswer
                question={tab}
                isWebCam={isWebCam}
                setIsWebCam={setIsWebCam}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};