import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Choreography from "@/pages/Choreography";
import Reviews from "@/pages/Reviews";
import Upgrades from "@/pages/Upgrades";
import Monthly from "@/pages/Monthly";
import Testimonials from "@/pages/Testimonials";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";

// Funnel pages
import Apply from "@/pages/Apply";
import ApplyConfirmed from "@/pages/ApplyConfirmed";
import Submit from "@/pages/Submit";
import SubmitConfirmed from "@/pages/SubmitConfirmed";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminApplications from "@/pages/admin/Applications";
import AdminApplicationDetail from "@/pages/admin/ApplicationDetail";
import AdminQueue from "@/pages/admin/Queue";
import AdminSubmissions from "@/pages/admin/Submissions";
import AdminSubmissionDetail from "@/pages/admin/SubmissionDetail";
import AdminServices from "@/pages/admin/ServicesManagement";

const PublicLayout = ({ children }) => (
  <div className="grain-overlay">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <div className="App bg-[#0A0A0A] min-h-screen">
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#121212', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/choreography" element={<PublicLayout><Choreography /></PublicLayout>} />
          <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
          <Route path="/upgrades" element={<PublicLayout><Upgrades /></PublicLayout>} />
          <Route path="/monthly" element={<PublicLayout><Monthly /></PublicLayout>} />
          <Route path="/testimonials" element={<PublicLayout><Testimonials /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Funnel Routes */}
          <Route path="/apply" element={<PublicLayout><Apply /></PublicLayout>} />
          <Route path="/apply/confirmed" element={<PublicLayout><ApplyConfirmed /></PublicLayout>} />
          <Route path="/submit" element={<PublicLayout><Submit /></PublicLayout>} />
          <Route path="/submit/confirmed" element={<PublicLayout><SubmitConfirmed /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="applications/:id" element={<AdminApplicationDetail />} />
            <Route path="queue" element={<AdminQueue />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="submissions/:id" element={<AdminSubmissionDetail />} />
            <Route path="services" element={<AdminServices />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
