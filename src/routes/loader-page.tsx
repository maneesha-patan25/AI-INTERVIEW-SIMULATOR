import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

// Define the props interface
interface LoaderPageProps {
  className?: string;
}

// Use the props interface in the function component
const LoaderPage = ({ className }: LoaderPageProps) => {
  return (
    <div
      className={cn(
        "w-screen h-screen flex items-center justify-center bg-transparent z-50",
        className
      )}
    >
      <Loader className="w-6 h-6 min-w-6 min-h-6 animate-spin" />
    </div>
  );
};

export default LoaderPage;
