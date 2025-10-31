import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Interview } from "@/types";
import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
// 👇 Import a new icon for the feedback button
import { Trash2, Pencil, Play, FileText } from "lucide-react";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { TooltipButton } from "./tooltip-button";

// 👇 1. Add 'isAnswered' to the component's props
interface InterviewPinProps {
  interview: Interview;
  isAnswered: boolean;
  onMockPage?: boolean;
}

export const InterviewPin = ({
  interview,
  isAnswered,
  onMockPage = false,
}: InterviewPinProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ... (handleDelete and handleCardClick functions remain the same) ...
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interview?.id) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "interviews", interview.id));
      toast("Deleted!", { description: "Interview deleted successfully." });
    } catch (err) {
      toast.error("Failed to delete", { description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/generate/interview/edit/${interview.id}`);
  };

  const creationDate = new Date(interview.createdAt.toDate());

  return (
    <Card /* ... (Card props remain the same) ... */ onClick={handleCardClick}>
      {/* ... (CardTitle, CardDescription, and Badge mapping remain the same) ... */}
      <CardFooter
        className={cn(
          "w-full flex items-center p-0 pt-4", // Added pt-4 for spacing
          onMockPage ? "justify-end" : "justify-between"
        )}
      >
        <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
          {creationDate.toLocaleDateString("en-US", { dateStyle: "long" })}
        </p>
        {!onMockPage && (
          <div className="flex items-center gap-2">
            {/* 👇 2. Conditionally render the correct primary action button */}
            {isAnswered ? (
              <TooltipButton
                content="View Feedback"
                icon={<FileText className="h-4 w-4" />}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  navigate(`/feedback/${interview.id}`);
                }}
                buttonVariant="ghost"
                buttonClassName="h-7 w-7 text-blue-600 hover:bg-blue-50"
              />
            ) : (
              <TooltipButton
                content="Start"
                icon={<Play className="h-4 w-4" />}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  navigate(`/generate/interview/${interview.id}`);
                }}
                buttonVariant="ghost"
                buttonClassName="h-7 w-7 text-emerald-600 hover:bg-emerald-50"
              />
            )}
            <TooltipButton
              content="Edit"
              icon={<Pencil className="h-4 w-4" />}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                navigate(`/generate/interview/edit/${interview.id}`);
              }}
              buttonVariant="ghost"
              buttonClassName="h-7 w-7 text-orange-500 hover:bg-orange-50"
            />
            <TooltipButton
              content="Delete"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={handleDelete}
              disabled={loading}
              buttonVariant="ghost"
              buttonClassName="h-7 w-7 text-red-500 hover:bg-red-50"
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};