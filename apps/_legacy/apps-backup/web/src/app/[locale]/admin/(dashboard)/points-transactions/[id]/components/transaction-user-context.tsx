'use client';

import {
  User,
  Mail,
  Calendar,
  Coins,
  TrendingUp,
  Award,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

type TransactionUserContextProps = {
  transaction: any;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const TransactionUserContext = ({ transaction }: TransactionUserContextProps) => {
  const t = useTranslations();
  const user = transaction.users;
  const profile = user?.user_profiles;

  if (!user) {
    return (
      <DetailView variant="sections">
        <DetailView.Section title="Contexte utilisateur" icon={User} span={2}>
          <div className="rounded-lg border border-border bg-muted/20 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Aucune information utilisateur disponible
            </p>
          </div>
        </DetailView.Section>
      </DetailView>
    );
  }

  return (
    <DetailView variant="sections" className="space-y-6">
      {/* User Profile */}
      <DetailView.Section title="Profil utilisateur" icon={User} span={2}>
        <div className="flex items-start gap-6">
          {/* Avatar */}
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.first_name || user.email}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted ring-2 ring-border">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name || ''}`
                  : user.email}
              </h3>
              {profile?.first_name && (
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              )}
            </div>

            <DetailView.FieldGroup layout="grid-3">
              {user.created_at && (
                <DetailView.Field label="Membre depuis">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(user.created_at)}
                  </div>
                </DetailView.Field>
              )}

              {user.points_balance !== undefined && (
                <DetailView.Field label="Solde actuel">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Coins className="h-4 w-4 text-primary" />
                    {user.points_balance.toLocaleString()} pts
                  </div>
                </DetailView.Field>
              )}

              {user.total_points_earned !== undefined && (
                <DetailView.Field label="Points gagnés (total)">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                    {user.total_points_earned.toLocaleString()} pts
                  </div>
                </DetailView.Field>
              )}
            </DetailView.FieldGroup>

            {/* User Level/Role */}
            {profile?.user_level && (
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-foreground">
                  Niveau : {profile.user_level}
                </span>
              </div>
            )}

            {/* Link to User Detail */}
            <div className="pt-2">
              <Link
                href={`/admin/users/${user.id}`}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2',
                  'bg-muted hover:bg-muted/80',
                  'text-sm font-medium text-foreground',
                  'transition-colors'
                )}
              >
                <User className="h-4 w-4" />
                Voir le profil complet
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </DetailView.Section>

      {/* Additional Context */}
      {(profile?.bio || profile?.location) && (
        <DetailView.Section title="Informations complémentaires" icon={User} span={2}>
          <DetailView.FieldGroup layout="grid-2">
            {profile?.bio && (
              <DetailView.Field label="Bio">
                <p className="text-sm text-foreground/80">{profile.bio}</p>
              </DetailView.Field>
            )}

            {profile?.location && (
              <DetailView.Field label="Localisation">
                <p className="text-sm text-foreground">{profile.location}</p>
              </DetailView.Field>
            )}
          </DetailView.FieldGroup>
        </DetailView.Section>
      )}
    </DetailView>
  );
};
