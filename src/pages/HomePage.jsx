import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion

// Animation for the page wrapper (Fade In/Out)
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
};

// Animation variants for staggering children (unchanged from previous version)
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function HomePage() {
  const backgroundImageUrl = '/images/360_F_735103060_EBCgaSSK11w98Ga6yzIT0x82KTOL32jQ.jpg'; // Path to your background image

  return (
    // --- Added motion.div wrapper for page transition ---
    <motion.div
      key="homepage" // Unique key for AnimatePresence
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Content Container with existing animations */}
      <motion.div
        className="relative z-10 flex flex-col items-center max-w-3xl"
        variants={containerVariants}
        initial="hidden" // Initial state for inner animations
        animate="visible" // Start inner animations
      >

        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl leading-tight"
          variants={itemVariants}
        >
          Visualize Your Perfect Space
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-100 mb-10 drop-shadow-xl px-4"
          variants={itemVariants}
        >
          Bring your interior design ideas to life. Upload a photo and see changes instantly.
        </motion.p>

        {/* Feature Highlights container */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full px-4"
          variants={containerVariants} // Stagger feature cards too
        >
          <motion.div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/20" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md">Virtual Painting</h3>
            <p className="text-sm text-gray-100 drop-shadow-sm">Try out different wall colors instantly.</p>
          </motion.div>
          <motion.div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/20" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md">Furniture Placement</h3>
            <p className="text-sm text-gray-100 drop-shadow-sm">Drag & drop furniture to find the best layout.</p>
          </motion.div>
          <motion.div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/20" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md">Instant Preview</h3>
            <p className="text-sm text-gray-100 drop-shadow-sm">See your design choices update in real-time.</p>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}> {/* Wrap Link for animation */}
          <Link
            to="/designer"
            className="inline-block bg-blue-600 text-white font-bold py-4 px-12 rounded-lg text-xl hover:bg-blue-700 transition-colors shadow-xl transform hover:scale-105"
          >
            Start Designing
          </Link>
        </motion.div>

        <motion.p
          className="text-sm text-gray-200 mt-16 drop-shadow-xl"
          variants={itemVariants}
        >
          Easy, Fast, and Free. No Sign-Up Needed.
        </motion.p>
      </motion.div>
    </motion.div> // --- End motion.div wrapper ---
  );
}