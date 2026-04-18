'use client'

import { Linkedin } from 'lucide-react'
import type { AboutTeamProps } from './about.types'

export function AboutTeamCarousel({ title, subtitle, members }: AboutTeamProps) {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="px-6">
        <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-md text-base text-gray-400">{subtitle}</p>
      </div>

      <div
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {members.map((member) => (
          <article
            key={member.name}
            role="listitem"
            className="relative flex w-[80vw] max-w-sm shrink-0 snap-center flex-col items-center rounded-3xl border border-white/10 bg-white/5 px-6 pb-6 pt-16 backdrop-blur-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photoSrc}
              alt={member.name}
              className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full border-4 border-[#0D1117] object-cover shadow-xl"
            />

            <h3 className="text-center text-xl font-bold text-white">{member.name}</h3>
            <p className="mt-1 text-center text-sm uppercase tracking-widest text-amber-300/90">
              {member.role}
            </p>

            <blockquote className="mt-6 text-center text-base italic leading-relaxed text-gray-300">
              « {member.quote} »
            </blockquote>

            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={member.linkedinLabel}
              className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
