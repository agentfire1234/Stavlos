import React from 'react'
import Link from 'next/link'

type Props = {
  size?: number
  className?: string
  href?: string
}

export function Logo({ size = 28, className, href = '/' }: Props) {
  const strokeWidth = Math.max(2, Math.round(size / 14))
  const stripeGap = Math.max(4, Math.round(size / 7))

  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
    >
      <circle cx="24" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="40" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
      <mask id="m1">
        <rect x="0" y="0" width="64" height="64" fill="black" />
        <circle cx="24" cy="32" r="20" fill="white" />
      </mask>
      <mask id="m2">
        <rect x="0" y="0" width="64" height="64" fill="black" />
        <circle cx="40" cy="32" r="20" fill="white" />
      </mask>
      <g mask="url(#m1)">
        <g mask="url(#m2)">
          {Array.from({ length: 16 }).map((_, i) => {
            const x = i * stripeGap
            return (
              <line
                key={i}
                x1={x}
                y1="0"
                x2={x + 32}
                y2="64"
                stroke="currentColor"
                strokeWidth={strokeWidth - 0.5}
                opacity={0.8}
              />
            )
          })}
        </g>
      </g>
    </svg>
  )

  return (
    <Link href={href} aria-label="Home" className="inline-flex items-center">
      {svg}
    </Link>
  )
}
