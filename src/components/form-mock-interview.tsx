import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { Interview } from "@/types";
import { CustomBreadCrumb } from "./custom-bread-crum";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Button } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { chatSession } from "@/scripts"; // Gemini AI client
import { db } from "@/config/firebase.config";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

// Zod schema for form validation
const formSchema = z.object({
  position: z.string().min(1).max(100),
  description: z.string().min(10),
  experience: z.coerce.number().min(0),
  techStack: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // Set defaultValues to the initialData if available, otherwise use empty strings/0
    defaultValues: {
      position: initialData?.position ?? "",
      description: initialData?.description ?? "",
      experience: initialData?.experience ?? 0,
      techStack: initialData?.techStack ?? "",
    },
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  // This useEffect hook is crucial for pre-filling the form.
  // It resets the form data whenever the initialData prop changes,
  // which happens after the data is fetched in CreateEditPage.
  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  // Handles the deletion of an interview record
  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, "interviews", initialData.id));
      toast("Deleted!", { description: "Interview deleted successfully." });
      navigate("/generate", { replace: true });
    } catch (err) {
      toast.error("Failed to delete", { description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const title = initialData ? initialData.position : "Create a new mock interview";
  const breadCrumbPage = initialData ? initialData.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  /**
   * Cleans and extracts a JSON array from the AI response.
   * This version is more robust by simply extracting questions.
   * On complete failure, it logs the error and returns an empty array.
   * @param responseText The raw text response from the AI.
   * @returns A parsed JSON array or an empty array on failure.
   */
  const cleanAiResponse = (responseText: string): any[] => {
    let cleanedText = responseText.toString().trim();

    // Attempt 1: Try to parse the raw response directly
    try {
      const parsed = JSON.parse(cleanedText);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // Continue to the next cleaning step if direct parsing fails
    }

    // Attempt 2: Look for content inside a markdown code block
    const codeBlockMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)```/s);
    if (codeBlockMatch && codeBlockMatch[1]) {
      cleanedText = codeBlockMatch[1].trim();
      try {
        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // Continue to the next cleaning step
      }
    }

    // Attempt 3: Look for content between the first [ and last ]
    const firstBracketIndex = cleanedText.indexOf('[');
    const lastBracketIndex = cleanedText.lastIndexOf(']');

    if (firstBracketIndex !== -1 && lastBracketIndex !== -1 && lastBracketIndex > firstBracketIndex) {
      const jsonArrayString = cleanedText.substring(firstBracketIndex, lastBracketIndex + 1);
      try {
        const parsed = JSON.parse(jsonArrayString);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        // Log the error and return an empty array on failure
        console.error("Invalid JSON format after extraction:", (error as Error)?.message);
        return [];
      }
    }

    // If all attempts fail, log the error and return an empty array
    console.error("No JSON array found in AI response after multiple cleaning attempts. Raw response:", responseText);
    return [];
  };

  /**
   * Generates AI questions ONLY and handles potential API errors.
   * Now returns an empty array on failure instead of throwing an error.
   * @param data The form data used to create the AI prompt.
   * @returns A promise that resolves to a JSON array of questions, or an empty array on error.
   */
  const generateAiResponse = async (data: FormData): Promise<any[]> => {
    const prompt = `
Please ONLY respond with a JSON array containing 2 technical interview questions based on the following job information. Each object in the array should have the field "question" and an empty string for the "answer". The response MUST start with '[' and end with ']'.

Job Information:
- Job Position: ${data.position}
- Job Description: ${data.description}
- Years of Experience Required: ${data.experience}
- Tech Stacks: ${data.techStack}
`;

    try {
      const aiResult = await chatSession.sendMessage(prompt, {
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const rawText = aiResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        console.error("Gemini response was empty.");
        return [];
      }

      return cleanAiResponse(rawText);
    } catch (error) {
      console.error("Error during Gemini API call or response cleaning:", error);
      return [];
    }
  };

  /**
   * Submits the form data, generates AI questions, and saves to Firestore.
   * Now handles an empty AI response gracefully.
   * @param data The form data.
   */
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const aiResult = await generateAiResponse(data);

      // Check for an empty result from the AI to prevent crashes
      if (aiResult.length === 0) {
        toast.warning("Could not generate questions.", {
          description: "The AI did not provide a valid response. Please try again.",
        });
        return; // Exit the function gracefully
      }

      if (initialData) {
        await updateDoc(doc(db, "interviews", initialData.id), {
          questions: aiResult,
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "interviews"), {
          ...data,
          userId,
          questions: aiResult,
          createdAt: serverTimestamp(),
        });
      }

      toast(toastMessage.title, { description: toastMessage.description });
      navigate("/generate", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Error..", {
        description: `Something went wrong: ${(error as Error).message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Resets the form with initial data when the component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumbPage}
        breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />
        {initialData && (
          <Button size={"icon"} variant={"ghost"} onClick={handleDelete}>
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md"
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="Describe the job role..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- 5"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- React, Node.js..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="button"
              onClick={() => form.reset()}
              size="sm"
              variant="outline"
              disabled={isSubmitting || loading}
            >
              Reset
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={!isValid || isSubmitting || loading}
            >
              {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {actions}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
