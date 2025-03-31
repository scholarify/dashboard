import { motion } from "framer-motion";

const Divider = () => {
  return (
    <motion.div
      className="w-full h-[2px] bg-gray-300"
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "100%" }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: 1 }}
    />
  );
};

export default Divider;