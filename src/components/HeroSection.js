import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <motion.div
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen flex justify-center items-center bg-gray-200"
    >
      <h1 className="text-5xl font-bold text-center">Wetop top top pp</h1>
    </motion.div>
  );
};

export default HeroSection;
