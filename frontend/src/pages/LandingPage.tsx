import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Landing/Hero";
import { Features } from "../components/Landing/Features";
import { Footer } from "../components/Landing/Footer";
import { Box } from "@mui/material";
import { NavigationTabs } from "../components/NavigationTabs";
import { useAuthStore } from "../store/useAuthStore";

const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      {isAuthenticated && <NavigationTabs />}
      <Box sx={{ flex: 1 }}>
        <Hero />
        <Features />
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;
