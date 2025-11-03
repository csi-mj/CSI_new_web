import React from "react"

import { cn } from "@/lib/utils"

export interface OrbitingCirclesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  path?: boolean
  iconSize?: number
  speed?: number
  glowDuration?: number
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 10,
  speed = 1,
  glowDuration = 3,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed
  const circumference = 1 * Math.PI * radius
  const segment = Math.max(1, circumference * 0.03)
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className={cn("pointer-events-none absolute inset-0 size-full", reverse && 'orbit-reverse', className)}
        >
          {/* This is the faint, static path */}
          <circle
            className="stroke-red-400/25 stroke-2"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />

          {/* This is the animated, glowing path */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="rgb(239,68,68)"
            strokeWidth={.4} // <-- Increased from 1 to 2
            strokeLinecap="round"
            className="pointer-events-none orbit-glow"
            strokeDasharray={`${segment} ${circumference}`}
            style={{
              // --- Here is the increased glow ---
              filter: "drop-shadow(0 0 15px rgba(239,68,68,0.75))",
              animation: `${reverse ? 'orbit-dash-rev' : 'orbit-dash-fwd'} ${glowDuration}s linear infinite`,
            }}
          />
        </svg>
      )}
      <style jsx>{`
        @keyframes orbit-dash-fwd {
          to {
            stroke-dashoffset: -${circumference}px;
          }
        }
        @keyframes orbit-dash-rev {
          to {
            stroke-dashoffset: ${circumference}px;
          }
        }
      `}</style>
      {React.Children.map(children, (child, index) => {
        const angle = (360 / React.Children.count(children)) * index
        return (
          <div
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                "--icon-size": `${iconSize}px`,
              } as React.CSSProperties
            }
            className={cn(
              `animate-orbit absolute flex size-[var(--icon-size)] transform-gpu items-center justify-center rounded-full`,
              reverse && 'orbit-reverse',
              className
            )}
            {...props}
          >
            {child}
          </div>
        )
      })}
    </>
  )
}