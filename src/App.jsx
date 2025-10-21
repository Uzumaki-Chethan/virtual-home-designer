import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import HomePage from './pages/HomePage';
import DesignerApp from './DesignerApp'; // Ensure this points to your renamed component

function App() {
  const location = useLocation(); // Get the current location

  return (
    // AnimatePresence manages exit/enter animations
    // 'wait' mode ensures one page animates out completely before the next animates in
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}> {/* Pass location and key */}
        <Route path="/" element={<HomePage />} />
        <Route path="/designer" element={<DesignerApp />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;