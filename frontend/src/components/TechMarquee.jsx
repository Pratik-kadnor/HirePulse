import React from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaApple, FaMicrosoft, FaPaypal, FaAmazon, FaFacebook, FaUber } from "react-icons/fa";
import { SiNetflix, SiTesla, SiAdobe } from "react-icons/si";

const companies = [
    { name: "Google", icon: FaGoogle, color: "text-red-500" },
    { name: "Apple", icon: FaApple, color: "text-gray-200" },
    { name: "Microsoft", icon: FaMicrosoft, color: "text-blue-500" },
    { name: "PayPal", icon: FaPaypal, color: "text-blue-700" },
    { name: "Amazon", icon: FaAmazon, color: "text-yellow-600" },
    { name: "Meta", icon: FaFacebook, color: "text-blue-600" },
    { name: "Netflix", icon: SiNetflix, color: "text-red-600" },
    { name: "Tesla", icon: SiTesla, color: "text-red-700" },
    { name: "Adobe", icon: SiAdobe, color: "text-red-500" },
    { name: "Uber", icon: FaUber, color: "text-black dark:text-white" },
];

const TechMarquee = () => {
    return (
        <div className="w-full overflow-hidden py-10 bg-background/50 backdrop-blur-sm border-y border-white/5">
            <div className="container mx-auto px-6 mb-6 text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    You could be the next one in..
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

                <motion.div
                    className="flex gap-16 items-center whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {[...companies, ...companies].map((company, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 text-2xl font-bold text-muted-foreground/50 hover:text-foreground transition-colors duration-300 cursor-default"
                        >
                            <company.icon className={`text-3xl ${company.color} opacity-70 hover:opacity-100 transition-opacity`} />
                            <span className="hidden md:inline text-lg font-heading">{company.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default TechMarquee;
