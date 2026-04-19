'use client'

import { Linkedin } from 'lucide-react'
import type { AboutTeamProps } from './about.types'

function TeamMemberCard({ member, isGregory }: { member: AboutTeamProps['members'][number]; isGregory: boolean }) {
  return (
    <article className="relative flex flex-col">
      {/* Header: Avatar + Identity */}
      <div className="relative z-10 mb-6 flex flex-row items-center gap-5">
        {/* Avatar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.photoSrc}
          alt={member.name}
          className={`h-20 w-20 rounded-full border border-white/10 object-cover ${isGregory ? 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'}`}
        />

        {/* Identity */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-white tracking-tight leading-none">{member.name}</h3>
          <p className={`mt-2 text-[10px] font-bold uppercase tracking-[0.25em] ${isGregory ? 'text-amber-500' : 'text-emerald-500'}`}>
            {member.role}
          </p>
        </div>
      </div>

      {/* Body: Quote with watermark */}
      <div className="relative">
        {/* Watermark quote mark */}
        <div className="absolute -top-8 -left-3 select-none font-serif text-[100px] leading-none text-white/[0.03] pointer-events-none z-0">
          "
        </div>

        {/* Quote container */}
        <blockquote className={`relative z-10 border-l-2 pl-4 ${isGregory ? 'border-amber-500/20' : 'border-emerald-500/20'}`}>
          <p className="relative z-10 text-[15px] italic leading-[1.85] font-light text-gray-300 text-pretty drop-shadow-sm sm:text-base">{member.quote}</p>
        </blockquote>
      </div>

      {/* LinkedIn button */}
      <a
        href={member.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={member.linkedinLabel}
        className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.05] text-white transition-colors hover:bg-white/10"
      >
        <Linkedin className="h-4 w-4" />
      </a>
    </article>
  )
}

export function AboutTeamCarousel({ title, subtitle, members }: AboutTeamProps) {
  return (
    <section className="relative mt-20 py-20 sm:py-24">
      <div className="px-6 mb-12">
        <h2 className="mb-3 text-3xl font-bold text-white tracking-tight text-balance">{title}</h2>
        <p className="text-base font-light text-gray-400 mb-12">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-20 px-6">
        {members.map((member, index) => (
          <TeamMemberCard key={member.name} member={member} isGregory={index === 0} />
        ))}
      </div>
    </section>
  )
}
