"use client"
import { AuthForm } from "@/components/AuthForm";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AuthRegisterPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async(email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/auth/register", {
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
                toast.error(error.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row max-w-vw overflow-x-hidden">
            <motion.div
                className="flex-1 flex items-center justify-center bg-surface-warm p-12"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-md">
                    <h1 className="text-4xl md:text-5xl font-serif font-semibold leading-tight mb-4">
                        Begin your<br /><span className="italic font-normal">reading journey.</span>
                    </h1>
                    <p className="text-muted-foreground font-sans text-lg">
                        A personal space for every book you love.
                    </p>
                </div>
            </motion.div>
            <motion.div
                className="flex-1 flex items-center justify-center p-8 md:p-12"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <AuthForm formState="register" onSubmit={handleSubmit} isLoading={isLoading}  />
            </motion.div>
        </div>
    );
};

export default AuthRegisterPage;
