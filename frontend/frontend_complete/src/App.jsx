import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import { api } from "./lib/api.js";
import { getVisitorId } from "./lib/visitor.js";

import PublicLayout from "./components/PublicLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Amenities from "./pages/Amenities.jsx";
import Calculator from "./pages/Calculator.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import BrokerRegistration from "./pages/BrokerRegistration.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import NotFound from "./pages/NotFound.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminLeads from "./pages/admin/AdminLeads.jsx";
import AdminBrokers from "./pages/admin/AdminBrokers.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminContent from "./pages/admin/AdminContent.jsx";
import AdminChatbot from "./pages/admin/AdminChatbot.jsx";
import AdminVisitors from "./pages/admin/AdminVisitors.jsx";


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Lightweight, anonymous page-view tracking. Skips /admin routes so that
// staff usage of the admin panel doesn't pollute visitor analytics.
// Fails silently (see api.trackPageView) so it can never break navigation.
function PageViewTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    api.trackPageView({
      path: pathname,
      referrer: document.referrer || "",
      visitorId: getVisitorId(),
    });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <ScrollToTop />
        <PageViewTracker />
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/broker-registration" element={<BrokerRegistration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="brokers" element={<AdminBrokers />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="chatbot" element={<AdminChatbot />} />
            <Route path="visitors" element={<AdminVisitors />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
