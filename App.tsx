// App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "@/layouts/public-layout";
import AuthenticationLayout from "@/layouts/auth-layout";
import HomePage from "@/routes/home";
import SignInPage from "@/routes/sign-in";
import SignOutPage from "@/routes/sign-out";
import ProtectRoutes from "./layouts/protected-routes";
import MainLayout from "./layouts/main-layout.tsx";
import { Generate } from "./components/generate";
import { Dashboard } from "./routes/dashboard";
import { CreateEditPage } from "./routes/create-edit-page";
import MockLoadPage from "./routes/mock-load-page";
import { InterviewChatSession } from "./routes/interview-chat-session";
import { Feedback } from "./routes/feedback";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Authentication layout */}
        <Route element={<AuthenticationLayout />}>
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/signout/*" element={<SignOutPage />} />
        </Route>

        {/* Protected routes */}
        <Route
          element={
            <ProtectRoutes>
              <MainLayout />
            </ProtectRoutes>
          }
        >
          <Route path="/generate" element={<Generate />}>
            <Route index element={<Dashboard />} />
            {/* 👇 Add this new route for creating interviews */}
            <Route path="create" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route path="interview/edit/:interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId/start" element={<InterviewChatSession />} />
          </Route>
          <Route path="feedback/:interviewId" element={<Feedback />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;