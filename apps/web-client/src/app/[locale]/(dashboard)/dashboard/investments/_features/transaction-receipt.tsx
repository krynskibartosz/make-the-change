'use client'

import { X, Download, ExternalLink, Package, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type TransactionReceiptProps = {
  transactionId: string
  transactionType: 'investment' | 'order'
}

export function TransactionReceipt({ transactionId, transactionType }: TransactionReceiptProps) {
  // Mock data for demonstration
  const isInvestment = transactionType === 'investment'

  const investmentData = {
    name: 'Ruchers d\'apiculteurs indépendants',
    date: '14 Avril 2026 à 14h32',
    amount: 390,
    status: 'active',
    statusLabel: 'Projet Actif',
    imageUrl: '/images/projects/miellerie-manakara.jpg',
    timeline: [
      { label: 'Fonds transférés', date: '14 Avril 2026', status: 'completed' },
      { label: 'Construction des ruches', date: 'En cours sur le terrain', status: 'in-progress' },
      { label: 'Première récolte', date: 'Prévu en Septembre', status: 'future' },
    ],
    impact: 'Vos 390€ représentent 5% du financement total. Vous parrainez l\'équivalent de 15 000 abeilles sauvages.',
  }

  const orderData = {
    name: 'Miel d\'Eucalyptus',
    date: '16 Avril 2026 à 08h10',
    amount: 1150,
    amountUnit: 'pts',
    orderNumber: '#CMD-89302',
    status: 'processing',
    statusLabel: 'En cours de préparation',
    imageUrl: '/images/products/miel-eucalyptus.jpg',
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

  const data = isInvestment ? investmentData : orderData

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
        {!isInvestment && <span className="text-xs text-gray-500 mb-2">{orderData.orderNumber}</span>}
        <div className="text-5xl font-black text-white tracking-tighter mb-4">
          {formatEuros(data.amount)}
          <span className="text-2xl text-lime-400">
            {isInvestment ? '€' : ` ${orderData.amountUnit}`}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
            data.status === 'active' || data.status === 'processing'
              ? 'bg-lime-400/10 text-lime-400 border-lime-400/20'
              : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
          }`}
        >
          {data.statusLabel}
        </span>
      </div>

      {/* TIMELINE CARD */}
      <div className="mx-6 p-5 rounded-3xl bg-[#1A1F26] border border-white/5 mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          {isInvestment ? 'Suivi du projet' : 'Suivi de livraison'}
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
          {isInvestment ? (
            <span className="text-2xl">🐝</span>
          ) : (
            <MapPin className="h-5 w-5 text-lime-400 mt-0.5 shrink-0" />
          )}
          {isInvestment ? (
            <p className="text-sm text-gray-300 leading-relaxed">
              Vos <strong className="text-white">{formatEuros(data.amount)}€</strong> représentent <strong className="text-white">5% du financement total</strong>. Vous parrainez l'équivalent de 15 000 abeilles sauvages.
            </p>
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
          {isInvestment ? (
            <>
              <Download className="w-[18px] h-[18px]" />
              Télécharger le reçu fiscal (PDF)
            </>
          ) : (
            <>
              <Package className="w-[18px] h-[18px]" />
              Suivre le colis
            </>
          )}
        </button>
        <button className="w-full bg-transparent text-lime-400 font-bold text-sm h-12 rounded-2xl transition-all flex items-center justify-center gap-2">
          {isInvestment ? (
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
