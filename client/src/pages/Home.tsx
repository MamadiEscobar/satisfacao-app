import { useState, useEffect } from "react";
import { useSubmitFeedback } from "@/hooks/use-feedback";
import { KioskButton } from "@/components/KioskButton";
import { Smile, Meh, Frown, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { mutate: submitFeedback, isPending } = useSubmitFeedback();
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleVote = (satisfaction: string) => {
    if (isPending || showSuccess) return;
    submitFeedback(satisfaction, {
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center text-center space-y-8 z-10"
          >
            <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground">
                Obrigado!
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-lg">
                Sua opinião é muito importante para continuarmos melhorando.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="vote"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-7xl z-10 flex flex-col items-center"
          >
            <div className="text-center mb-12 md:mb-16 space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground">
                Como foi seu atendimento?
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Toque na opção que melhor representa sua experiência hoje
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
              <KioskButton
                variant="happy"
                label="Muito Satisfeito"
                onClick={() => handleVote("muito_satisfeito")}
                disabled={isPending}
                icon={<Smile strokeWidth={1.5} className="w-24 h-24 md:w-32 md:h-32" />}
              />
              <KioskButton
                variant="neutral"
                label="Satisfeito"
                onClick={() => handleVote("satisfeito")}
                disabled={isPending}
                icon={<Meh strokeWidth={1.5} className="w-24 h-24 md:w-32 md:h-32" />}
              />
              <KioskButton
                variant="sad"
                label="Insatisfeito"
                onClick={() => handleVote("insatisfeito")}
                disabled={isPending}
                icon={<Frown strokeWidth={1.5} className="w-24 h-24 md:w-32 md:h-32" />}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-6 text-sm text-muted-foreground/50 font-medium">
        Kiosk Mode v1.0 • Secure Vote System
      </div>
    </div>
  );
}
