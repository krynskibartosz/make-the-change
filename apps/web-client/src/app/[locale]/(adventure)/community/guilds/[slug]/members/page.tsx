import { ArrowLeft, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getGuildBySlug } from '@/lib/social/feed.reads'
import { AdventurePageFrame } from '../../../_features/adventure-page-frame'
import { AdventureRightRail } from '../../../_features/adventure-right-rail'

type PageProps = {
  params: Promise<{ slug: string }>
}

const getMemberInitial = (name: string) => name.trim().charAt(0).toUpperCase() || 'U'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guildDetails = await getGuildBySlug(slug)
  const name = guildDetails?.guild.name ?? slug

  return {
    title: `${name} · Membres — Make the Change`,
    description: `Découvrez les membres actifs de la tribu ${name}.`,
  }
}

export default async function CommunityGuildMembersPage({ params }: PageProps) {
  const { slug } = await params
  const guildDetails = await getGuildBySlug(slug)

  if (!guildDetails) {
    notFound()
  }

  const { guild, members } = guildDetails

  return (
    <AdventurePageFrame
      centerClassName="max-w-[600px]"
      rightRail={
        <AdventureRightRail
          variant="guild_detail"
          basePath={`/community/guilds/${guild.slug}/members`}
          guildName={guild.name}
          guildMembers={members}
        />
      }
    >
      <div className="flex min-h-screen w-full flex-col bg-background px-4 pb-28 pt-5">
        <Link
          href={`/community/guilds/${guild.slug}`}
          className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Détails de la tribu
        </Link>

        <div className="mb-6">
          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
            <Users className="h-3.5 w-3.5" />
            Membres actifs
          </p>
          <h1 className="text-2xl font-black tracking-tight text-foreground">{guild.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {members.length.toLocaleString()} membres contribuent à cette mission.
          </p>
        </div>

        <div className="space-y-1">
          {members.length > 0 ? (
            members.map((member) => {
              const fullName = member.user?.full_name || 'Utilisateur'

              return (
                <Link
                  key={member.user_id}
                  href={`/profile/${member.user_id}`}
                  prefetch={false}
                  className="flex items-center gap-3 border-b border-white/5 py-3 active:opacity-70 transition-opacity"
                >
                  {member.user?.avatar_url ? (
                    <img
                      src={member.user.avatar_url}
                      alt={`Avatar de ${fullName}`}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                      {getMemberInitial(fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{fullName}</p>
                    <p className="text-xs capitalize text-muted-foreground">{member.role}</p>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
              <p className="font-semibold text-foreground">Aucun membre visible</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Les prochains membres apparaîtront ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdventurePageFrame>
  )
}
