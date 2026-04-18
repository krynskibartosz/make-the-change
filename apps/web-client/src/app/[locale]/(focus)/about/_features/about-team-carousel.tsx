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
        className="mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 pl-6 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {members.map((member) => (
          <article
            key={member.name}
            role="listitem"
            className="relative flex w-[78vw] max-w-[320px] shrink-0 snap-center flex-col rounded-3xl border border-white/[0.06] bg-white/[0.03] px-6 pb-6 pt-14 backdrop-blur-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photoSrc}
              alt={member.name}
              className="absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border-4 border-[#0D1117] object-cover shadow-xl ring-1 ring-amber-300/20"
            />

            {/* Centered identity block */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{member.name}</h3>
              <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400/90">
                {member.role}
              </p>
            </div>

            {/* Subtle separator */}
            <div aria-hidden="true" className="mx-auto mt-5 h-px w-10 bg-white/10" />

            {/* Left-aligned editorial quote */}
            <blockquote className="mt-5 text-sm font-light italic leading-relaxed text-gray-300">
              <span className="text-amber-400/40">«</span> {member.quote}{' '}
              <span className="text-amber-400/40">»</span>
            </blockquote>

            {/* Bottom-right LinkedIn */}
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={member.linkedinLabel}
              className="mt-6 inline-flex h-9 w-9 items-center justify-center self-end rounded-full border border-white/10 bg-white/[0.03] text-white/80 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
