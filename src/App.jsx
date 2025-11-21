import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import ProjectDetail from './pages/ProjectDetail';
import AboutUs from './pages/AboutUs';
import Recruitment from './pages/Recruitment';

// Public Pages
import Index from "./pages/Index";
import Projects from './pages/Projects';
import Technology from "./pages/Technology";
import AboutCompany from "./pages/AboutCompany";
import Careers from "./pages/careers";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./components/admin/Dashboard";
import AdminProjects from "./components/admin/ProjectList";
import NewProject from "./components/admin/ProjectForm";
import EditProject from "./components/admin/ProjectForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        {/* Toaster notifications */}
        <Toaster />
        <Sonner />

        <BrowserRouter basename="HITEK_CLONE">
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/aboutcompany" element={<AboutCompany />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/projects/new" element={<NewProject />} />
            <Route path="/admin/projects/edit/:id" element={<EditProject />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;