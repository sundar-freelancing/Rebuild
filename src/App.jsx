import { ThemeProvider } from "@/context/ThemeContext";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import RefundPolicy from "@/pages/RefundPolicy";
import Courses from "@/pages/Courses";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Services from "@/pages/Services";
import Students from "@/pages/Students";
import TermsOfService from "@/pages/TermsOfService";
import Dashboard from "@/pages/admin/Dashboard";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import AOS from "aos";
import { useEffect } from "react";
import SiteConfig from "@/pages/admin/SiteConfig";
import AdminCourses from "./pages/admin/Courses";
import AdminDomainDetail from "./pages/admin/DomainDetail";
import AdminCourseManage from "./pages/admin/CourseManage";
import AdminCourseView from "./pages/admin/CourseView";
import AdminSuccessStories from "./pages/admin/SuccessStories";
import AdminHiringPartners from "./pages/admin/HiringPartners";
import AdminRoles from "./pages/admin/Roles";
import AdminUserView from "./pages/admin/UserView";
import AdminAccount from "./pages/admin/Account";
import AdminSuperController from "./pages/admin/SuperController";
import DomainCourses from "./pages/DomainCourses";

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.refresh();
  }, [location.pathname]);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
      delay: 0,
    });
  }, []);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:domainId" element={<DomainCourses />} />
        <Route path="/services" element={<Services />} />
        <Route path="/students" element={<Students />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Route>
      {/* Private Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/site-config" element={<SiteConfig />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/courses/:domainId" element={<AdminDomainDetail />} />
        <Route path="/admin/courses/view/:courseId" element={<AdminCourseView />} />
        <Route path="/admin/courses/manage" element={<AdminCourseManage />} />
        <Route path="/admin/courses/manage/:courseId" element={<AdminCourseManage />} />
        <Route path="/admin/success-stories" element={<AdminSuccessStories />} />
        <Route path="/admin/hiring-partners" element={<AdminHiringPartners />} />
        <Route path="/admin/roles" element={<AdminRoles />} />
        <Route path="/admin/users/:userId" element={<AdminUserView />} />
        <Route path="/admin/super-controller" element={<AdminSuperController />} />
        <Route path="/admin/account" element={<AdminAccount />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};
