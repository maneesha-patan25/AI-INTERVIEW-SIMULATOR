
# AI-INTERVIEW-SIMULATOR

🌟 AI Interview Simulator: Multimodal Feedback for Job Readiness
The AI Interview Simulator is a full-stack, AI-driven platform that provides job seekers with a realistic, customized interview rehearsal environment. It uses advanced machine learning and generative AI to deliver comprehensive, real-time feedback across verbal, vocal, and non-verbal communication channels. The goal is to increase user confidence and performance, making high-quality interview guidance widely available.

✨ Key Features

This platform surpasses conventional methods and existing tools by integrating several key features
1.Job-Specific Question Generation: The system accepts a job description and uses the Google Gemini API to generate sophisticated, role-specific technical and behavioral questions in real-time.
2.Multimodal, Real-Time Analysis: Candidate responses are recorded (audio and video) and analyzed concurrently by parallel AI modules6666.Verbal/NLP: Assesses content clarity, relevance, and structured frameworks (e.g., the STAR method).
3.Vocal Delivery: Analyzes prosodic features (pitch, volume, rate of speaking, filler words) using tools like openSMILE to measure engagement and confidence.
4.Non-Verbal Communication: A Computer Vision component (using Google MediaPipe) evaluates posture, facial expression (e.g., smiling), and eye contact.
5.Detailed, Actionable Feedback: Provides an overall performance score along with thorough feedback, indicating strengths/weaknesses and offering feasible improvement recommendations.
6.High Performance: Achieved approximately 96\%$ transcription accuracy in pilot testing.

💻 Technology Stack

The AI Interview Simulator is built on a robust full-stack technology stack.
1.For the Frontend (presentation layer), the system uses React and Next.js to create a responsive Progressive Web App (PWA).
2.The Backend and Backend as a Service (BaaS) layer relies heavily on Google Firebase for services like user authentication, application logic, and data storage. Specifically, Firestore (NoSQL) is used to store user profiles, transcripts, and session data, while Firebase Storage securely handles raw audio/video files. Cloud Functions serve as the application logic layer, triggered whenever a recording is submitted to initiate AI analyses
3.The core intelligence (AI/ML Layer) is powered by Google's cloud APIs. The Google Gemini API (a large multimodal LLM) is essential for both language tasks, including question generation and semantic answer scoring. For Speech-to-Text (ASR), the system utilizes cutting-edge models like Google Speech-to-Text or OpenAI's Whisper. Vocal analysis leverages the openSMILE toolkit for extracting prosodic features , and Google MediaPipe is employed for the computer vision component to handle real-time face landmark and pose detection.


@Installation and Setup

Prerequisites
Node.js and npm/yarn
A Google Firebase account for backend services (Firestore, Authentication, Storage)
A Google Gemini API Key for question generation and content scoring

1. Clone the repository
Bash
git clone [maneesha-patan25/AI-INTERVIEW-SIMULATOR]
cd AI-Interview-Simulator
2. Install Dependencies
Bash
npm installor pnpm run dev or
yarn install
3. Environment Variables
Create a .env.local file in the root directory and add your configuration details:
@Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
@... other Firebase config variables ...
@ Google AI Configuration
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
4. Run the application
Bash
npm run dev or pnpm run dev
or
yarn dev
The application will be accessible at http://localhost:3000.


💡 Future Scope

Future enhancements planned for the project include:
Adaptive Follow-Up: Adding more interactive functions like the ability for the AI interviewer to pose clarifying questions.
Multilingual Support: Extending the model to support multiple languages and cultural communication differences.
Advanced Analysis: Enhancing non-verbal analysis through more sophisticated models to capture nuanced body language.
Specialized Modules: Incorporating technical coding tests.
