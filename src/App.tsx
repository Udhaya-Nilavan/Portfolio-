import { useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { PromptfolioMotionSystem } from './components/motion/PromptfolioMotionSystem';
import { FloatingNav } from './components/layout/FloatingNav';
import { Footer } from './components/layout/Footer';
import { Backdrop } from './components/ui/Primitives';
import PortfolioBlueprintDoodles from './components/blueprint/PortfolioBlueprintDoodles';
import { AIChatbotDrawer } from './components/chatbot/AIChatbotDrawer';
import { useReducedMotion } from './hooks';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Achievements } from './sections/Achievements';
import { ImpactSpotlight } from './sections/ImpactSpotlight';
import ProjectsStack from './sections/ProjectsStack';
import { projectsData } from './data/projects';
import { Certifications } from './sections/Certifications';
import { Education } from './sections/Education';
import { Training } from './sections/Training';
import { Contact } from './sections/Contact';

/**
 * Section order here must match `data/sections.ts`, which drives the floating
 * navigation, the mobile sheet, active-section detection and the footer.
 */
function Page() {
  const reducedMotion = useReducedMotion();

  // Mirrors the OS reduced-motion setting onto <html> so CSS can switch off
  // JS-driven animation as well as pure CSS animation.
  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  }, [reducedMotion]);

  return (
    <>
      <PromptfolioMotionSystem />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Backdrop />
      <PortfolioBlueprintDoodles />
      <FloatingNav />

      <div className="page">
        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Achievements />
          <ImpactSpotlight />
          <ProjectsStack projects={projectsData} />
          <Certifications />
          <Education />
          <Training />
          <Contact />
        </main>

        <Footer />
      </div>

      <AIChatbotDrawer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  );
}
