'use client';

import { useEffect, useMemo } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import { cn } from '@/lib/utils';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = useMemo(() => words.split(' '), [words]);
  
  useEffect(() => {
    const animation = async () => {
      if (scope.current) {
        await animate(
          'span',
          {
            opacity: 1,
            filter: filter ? 'blur(0px)' : 'none',
          },
          {
            duration: duration || 1,
            delay: stagger(0.2),
          },
        );
      }
    };

    animation();
  }, [animate, duration, filter, scope]);

  const renderWords = (): JSX.Element => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={`${word}-${idx}`}
              className="text-black opacity-0 dark:text-white"
              style={{
                filter: filter ? 'blur(10px)' : 'none',
              }}
            >
              {`${word} `}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn('font-bold', className)}>
      <div className="mt-4">
        <div className="text-2xl leading-snug tracking-wide text-black dark:text-white">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
