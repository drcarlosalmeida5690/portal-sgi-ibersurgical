import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import ProcessChecklist from "./pages/ProcessChecklist";
import EnvironmentalMonitor from "./pages/EnvironmentalMonitor";
import EvidenceRepository from "./pages/EvidenceRepository";
import AuditCalendar from "./pages/AuditCalendar";
import Help from "./pages/Help";
import Alerts from "./pages/Alerts";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/proceso/:id"} component={ProcessChecklist} />
      <Route path={"/alertas"} component={Alerts} />
      <Route path={"/ambiental"} component={EnvironmentalMonitor} />
      <Route path={"/evidencias"} component={EvidenceRepository} />
      <Route path={"/calendario"} component={AuditCalendar} />
      <Route path={"/ayuda"} component={Help} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
