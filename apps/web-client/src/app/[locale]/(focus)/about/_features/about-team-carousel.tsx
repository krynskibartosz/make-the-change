'use client'

import { Linkedin } from 'lucide-react'
import type { AboutTeamProps } from './about.types'

export function AboutTeamCarousel({ title, subtitle, members }: AboutTeamProps) {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="px-6 mb-20">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-md text-sm font-light text-gray-400">{subtitle}</p>
      </div>

      <div className="space-y-20">
        {members.map((member, index) => {
          const isLeft = index === 0
          return (
            <article
              key={member.name}
              className={`flex flex-col ${isLeft ? 'items-start pl-6 pr-12' : 'items-end pr-6 pl-12'} ${index > 0 ? 'mt-20' : ''}`}
            >
              {/* Avatar with glow */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.photoSrc}
                alt={member.name}
                className={`w-28 h-28 rounded-full object-cover ${isLeft ? 'shadow-[0_0_40px_rgba(245,158,11,0.15)]' : 'shadow-[0_0_40px_rgba(16,185,129,0.15)]'}`}
              />

              {/* Identity */}
              <div className="mt-6">
                <h3 className={`text-3xl font-bold text-white tracking-tight ${isLeft ? '' : 'text-right'}`}>
                  {member.name}
                </h3>
                <p className={`mt-1 text-xs font-bold uppercase tracking-[0.2em] mb-4 ${isLeft ? 'text-amber-500' : 'text-emerald-500'} ${isLeft ? '' : 'text-right'}`}>
                  {member.role}
                </p>
              </div>

              {/* Pull-quote magazine style with border */}
              <blockquote className={`text-lg italic leading-relaxed text-gray-300 ${isLeft ? 'text-left border-l-2 border-amber-500/30 pl-4' : 'text-right border-r-2 border-emerald-500/30 pr-4'}`}>
                « {member.quote} »
              </blockquote>

              {/* Subtle LinkedIn icon */}
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={member.linkedinLabel}
                className={`mt-4 rounded-full bg-white/5 p-2 text-white transition-colors hover:bg-white/10 ${isLeft ? '' : ''}`}
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
