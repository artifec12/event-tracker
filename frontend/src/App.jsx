import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const EventForm = lazy(() => import("./pages/EventForm"));
const SharedEvent = lazy(() => import("./pages/SharedEvent"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/share/:shareToken" element={<SharedEvent />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addEvent"
            element={
              <ProtectedRoute>
                <EventForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;
