// File: /src/types/index.ts

import { FieldValue, Timestamp } from "firebase/firestore";

/**
 * Represents a single answer submitted by a user for a question.
 */
export interface UserAnswer {
  id: string;
  mockIdRef: string;
  question: string;
  correct_ans: string;
  user_ans: string;
  feedback: string;
  rating: number;
  userId: string;
  createdAt: Timestamp;
}

// Keep your other types here as well
export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface Question {
  question: string;
  answer: string;
}

export interface Interview {
  id: string;
  position: string;
  description: string;
  experience: number;
  userId: string;
  techStack: string[];
  questions: Question[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}