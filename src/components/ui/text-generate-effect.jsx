import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();
  // Split by spaces, but preserve newlines by not removing them
  let wordsArray = words.split(" ");
  
  useEffect(() => {
    animate(
      "span.anim-word",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.15),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          const isOrange = word.includes("premium") || word.includes("tears");
          
          if (word === "<br/>") {
            return <br key={idx} />;
          }

          return (
            <motion.span
              key={word + idx}
              className={cn(
                "anim-word opacity-0 inline-block",
                isOrange ? "text-[#FF6B00]" : "text-gray-900 dark:text-white"
              )}
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}&nbsp;
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="text-gray-900 dark:text-white text-[40px] md:text-[72px] leading-[1.05] font-[550] tracking-[-0.04em]">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
