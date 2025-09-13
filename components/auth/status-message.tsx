"use client";

import { motion } from "framer-motion";

interface StatusMessageProps {
  error?: string;
  success?: string;
}

export function StatusMessage({ error, success }: StatusMessageProps) {
  if (!error && !success) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-4 py-3 rounded-lg text-sm ${
        error
          ? "bg-red-50 border border-red-200 text-red-700"
          : "bg-green-50 border border-green-200 text-green-700"
      }`}
    >
      {error || success}
    </motion.div>
  );
}