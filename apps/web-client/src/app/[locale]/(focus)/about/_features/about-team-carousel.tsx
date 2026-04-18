'use client'

import { Linkedin } from 'lucide-react'
import type { AboutTeamProps } from './about.types'

export function AboutTeamCarousel({ title, subtitle, members }: AboutTeamProps) {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="px-6">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-md text-sm font-light text-gray-400">{subtitle}</p>
      </div>

      <div
        className="mt-16 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-12 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {members.map((member) => (
          <article
            key={member.name}
            role="listitem"
            className="min-w-[85vw] shrink-0 snap-center flex flex-col items-center text-center"
          >
            {/* Avatar with amber glow */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photoSrc}
              alt={member.name}
              className="w-32 h-32 rounded-full object-cover shadow-[0_0_40px_rgba(245,158,11,0.15)]"
            />

            {/* Identity */}
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">{member.name}</h3>
              <p className="mt-2 text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">
                {member.role}
              </p>
            </div>

            {/* Pull-quote magazine style */}
            <blockquote className="mt-8 px-4 text-lg italic leading-relaxed text-gray-300">
              « {member.quote} »
            </blockquote>

            {/* Subtle circular LinkedIn */}
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={member.linkedinLabel}
              className="mt-8 rounded-full bg-white/5 p-3 text-white transition-colors hover:bg-white/10"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
