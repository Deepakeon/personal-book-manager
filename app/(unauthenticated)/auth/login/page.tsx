"use client"
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const AuthLoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        router.push("/library");
      } else {
        const error = await response.json();
        toast.error(error.error || "Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-vw overflow-x-hidden">
      <motion.div
        className="flex-1 flex items-center justify-center bg-surface-warm p-12"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold leading-tight mb-4">
            Welcome<br />back, reader.
          </h1>
          <p className="text-muted-foreground font-sans text-lg">
            Your books are waiting for you.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 flex items-center justify-center p-8 md:p-12"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <AuthForm onSubmit={handleSubmit} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};

export default AuthLoginPage;
