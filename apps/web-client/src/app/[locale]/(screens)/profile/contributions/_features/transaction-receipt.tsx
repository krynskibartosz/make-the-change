'use client'

import { X, Download, ExternalLink, Package, MapPin, Leaf } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
  adaptNormalizedSupportToProducerSupport,
  adaptNormalizedDonationToViewModel,
  type ProducerSupportViewModel,
} from '@/lib/mappers/producer-support-adapters'

// [R7] Types legacy pour les props - conservés pour compatibilité
type TransactionReceiptProps = {
  transactionId: string
  transactionType: 'support' | 'donation' | 'order'
}

export function TransactionReceipt({ transactionId, transactionType }: TransactionReceiptProps) {
  // [R7] Mock data pour démonstration - à remplacer par données réelles
  const isSupport = transactionType === 'support'
  const isDonation = transactionType === 'donation'
  const isProducerSupport = isSupport

  // [R7] Données legacy mock avec discriminant type
  const legacySupportData = {
    id: transactionId,
    amount_eur: 390,
    amount_points: 3900,
    status: 'active',
    created_at: '2026-04-14T14:32:00.000Z',
    type: 'support' as const,
    project: {
      name_default: 'Ruchers d\'apiculteurs indépendants',
      slug: 'miellerie-manakara',
      status: 'active',
      cover_image_url: '/images/projects/miellerie-manakara.jpg',
    }
  }

  const legacyDonationData = {
    id: transactionId,
    amount_eur: 50,
    amount_points: 500, // Graines pour les dons
    status: 'completed',
    created_at: '2026-04-10T10:15:00.000Z',
    type: 'donation' as const,
    project: {
      name_default: 'Protection des lémuriens',
      slug: 'protection-lemuriens',
      status: 'active',
      cover_image_url: '/images/projects/antsirabe-ruchers-1.jpg',
    }
  }

  const orderData = {
    name: 'Miel d\'Eucalyptus',
    date: '16 Avril 2026 à 08h10',
    amount: 1150,
    amountUnit: 'Credits Impact',
    orderNumber: '#CMD-89302',
    status: 'processing',
    statusLabel: 'En cours de préparation',
    imageUrl: '/images/products/miel-eucalyptus-ilanga.png',
    timeline: [
      { label: 'Commande validée', date: '16 Avril 2026', status: 'completed' },
      { label: 'En cours de préparation', date: 'En cours', status: 'in-progress' },
      { label: 'Expédié', date: 'En attente', status: 'future' },
      { label: 'Livré', date: 'En attente', status: 'future' },
    ],
    shippingAddress: {
      name: 'Jean Dupont',
      street: '123 Rue de la République',
      city: '75001 Paris',
      country: 'France',
    },
  }

  // [R7] Adapter vers view-models selon le type
  const supportVM: ProducerSupportViewModel | null = isSupport
    ? adaptNormalizedSupportToProducerSupport(legacySupportData)
    : null
  
  const donationVM = isDonation
    ? adaptNormalizedDonationToViewModel(legacyDonationData)
    : null

  const supportTimeline = [
    { label: 'Contribution versée', date: formatFullDate(supportVM?.createdAt || ''), status: 'completed' as const },
    { label: 'Projet en cours', date: 'Suivi en cours', status: 'in-progress' as const },
    { label: 'Suivi terrain à venir', date: 'À déterminer', status: 'future' as const },
  ]

  const donationTimeline = [
    { label: 'Don reçu', date: formatFullDate(donationVM?.createdAt || ''), status: 'completed' as const },
    { label: 'Projet soutenu', date: 'Confirmation partenaire', status: 'completed' as const },
    { label: 'Suivi disponible', date: 'Dans votre historique', status: 'completed' as const },
  ]

  const data = isSupport || isDonation
    ? {
        name: supportVM?.project.name || donationVM?.project.name || 'Projet',
        date: formatFullDate(supportVM?.createdAt || donationVM?.createdAt || ''),
        amount: supportVM?.amountEuros || donationVM?.amountEuros || 0,
        creditsOrSeeds: isDonation 
          ? (donationVM?.seedsReward || 0)
          : (supportVM?.amountImpactCredits || 0),
        creditsOrSeedsLabel: isDonation ? 'Graines' : 'Credits Impact',
        status: supportVM?.status || donationVM?.status || 'pending',
        statusLabel: supportVM?.statusLabel || donationVM?.statusLabel || 'En attente',
        imageUrl: supportVM?.project.coverImageUrl || donationVM?.project.coverImageUrl || '/images/projects/miellerie-manakara.jpg',
        contributionTypeLabel: supportVM?.contributionTypeLabel || donationVM?.contributionTypeLabel || 'Contribution',
        isDonation,
        isProducerSupport: !isDonation && (isSupport || false),
        timeline: isDonation ? donationTimeline : supportTimeline,
      }
    : orderData

  return (
    <div className="flex flex-col min-h-full bg-[#0B0F15]">
      {/* HERO - Reçu */}
      <div className="px-6 pt-8 pb-10 flex flex-col items-center text-center">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-white/5 mb-4 shadow-xl"
        />
        <h2 className="text-lg font-bold text-white mb-1">{data.name}</h2>
        <span className="text-sm text-gray-400 mb-4">{data.date}</span>
        {!isSupport && <span className="text-xs text-gray-500 mb-2">{orderData.orderNumber}</span>}
        <div className="flex flex-col items-center mb-4">
          <div className="text-5xl font-black text-white tracking-tighter leading-none">
            {formatEuros(data.amount)}
            {isSupport && <span className="text-2xl text-lime-400"> €</span>}
          </div>
          {!isSupport && !isDonation && (
            <span className="mt-1.5 text-sm font-medium text-white/45">crédits échangés</span>
          )}
        </div>
        {(isSupport || isDonation) && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            {supportVM?.contributionTypeLabel || donationVM?.contributionTypeLabel}
          </span>
        )}
        <span
          className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
            (supportVM?.status === 'active' || supportVM?.status === 'completed' || donationVM?.status === 'completed')
              ? 'bg-lime-400/10 text-lime-400 border-lime-400/20'
              : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
          }`}
        >
          {supportVM?.statusLabel || donationVM?.statusLabel || orderData.statusLabel}
        </span>
      </div>

      {/* TIMELINE CARD */}
      <div className="mx-6 p-5 rounded-3xl bg-[#1A1F26] border border-white/5 mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          {isProducerSupport ? 'Suivi du projet' : isDonation ? 'Confirmation' : 'Suivi de livraison'}
        </h3>
        <div className="flex flex-col gap-4 relative">
          {/* Vertical line */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10"></div>

          {data.timeline.map((step, index) => (
            <div key={index} className="flex items-start gap-4 relative z-10">
              <div
                className={`w-4 h-4 rounded-full border-4 border-[#1A1F26] mt-0.5 shrink-0 ${
                  step.status === 'completed'
                    ? 'bg-lime-400'
                    : step.status === 'in-progress'
                      ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                      : 'bg-[#0B0F15] border-2 border-white/20'
                }`}
              />
              <div>
                <h4
                  className={`text-sm font-bold ${
                    step.status === 'in-progress' ? 'text-amber-400' : step.status === 'future' ? 'text-gray-500' : 'text-white'
                  }`}
                >
                  {step.label}
                </h4>
                <span
                  className={`text-xs ${
                    step.status === 'in-progress' ? 'text-amber-400/70' : step.status === 'future' ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {step.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INFO CARD */}
      <div className="mx-6 p-5 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] mb-8">
        <div className="flex items-start gap-3">
          {isProducerSupport ? (
            <Leaf className="h-5 w-5 text-lime-400 mt-0.5 shrink-0" />
          ) : isDonation ? (
            <Leaf className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <MapPin className="h-5 w-5 text-lime-400 mt-0.5 shrink-0" />
          )}
          {isProducerSupport ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-300 leading-relaxed">
                Votre soutien de <strong className="text-white">{formatEuros(supportVM?.amountEuros || 0)}€</strong> contribue à un projet apicole.
              </p>
              <p className="text-xs text-gray-500">
                Credits Impact reçus : <strong className="text-amber-300">{supportVM?.amountImpactCredits || 0}</strong>
              </p>
              <p className="text-xs text-gray-500 italic">
                L&apos;impact réel dépend de la mise en œuvre du projet sur le terrain.
              </p>
            </div>
          ) : isDonation ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-300 leading-relaxed">
                Votre don de <strong className="text-white">{formatEuros(donationVM?.amountEuros || 0)}€</strong> soutient la protection des lémuriens.
              </p>
              <p className="text-xs text-gray-500">
                Graines reçues : <strong className="text-emerald-300">{donationVM?.seedsReward || 0}</strong>
              </p>
              <p className="text-xs text-gray-500 italic">
                Le don pur n&apos;est pas convertible en Credits Impact.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-white">{orderData.shippingAddress.name}</p>
              <p className="text-sm text-gray-400">
                {orderData.shippingAddress.street}
                <br />
                {orderData.shippingAddress.city}, {orderData.shippingAddress.country}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="px-6 pb-8 mt-auto flex flex-col gap-3">
        <button className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm h-14 rounded-2xl transition-all flex items-center justify-center gap-2">
          {isProducerSupport ? (
            <>
              <Download className="w-[18px] h-[18px]" />
              Télécharger le reçu de contribution
            </>
          ) : isDonation ? (
            <>
              <Download className="w-[18px] h-[18px]" />
              Télécharger le reçu de don
            </>
          ) : (
            <>
              <Package className="w-[18px] h-[18px]" />
              Suivre le colis
            </>
          )}
        </button>
        <button className="w-full bg-transparent text-lime-400 font-bold text-sm h-12 rounded-2xl transition-all flex items-center justify-center gap-2">
          {isSupport ? (
            <>
              <ExternalLink className="w-[18px] h-[18px]" />
              Voir la page du projet
            </>
          ) : (
            <>
              Un problème ? Contacter le support
            </>
          )}
        </button>
      </div>
    </div>
  )
}

const formatEuros = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

const formatFullDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
