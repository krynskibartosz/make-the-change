'use server'

import { z } from 'zod'

export type ConstructionData = {
  summary: string
  workType: string
  zone: string
  workers: string[]
  time: string
  materials: string[]
  alerts: string[]
}

// Fonction utilitaire pour simuler un délai réseau
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function transcribeAudio(formData: FormData): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

  // Si aucune clé n'est fournie, on utilise le mode MOCK
  if (!apiKey) {
    console.log('Mode MOCK: Simulation de la transcription audio (aucune clé API fournie)')
    await delay(1500) // Simule l'upload et la transcription
    return "J'ai bossé de 8h à 12h sur la dalle en béton avec Chris, on a utilisé 4 sacs de ciment. Il manque une bâche pour protéger."
  }

  formData.append('model', 'whisper-1')
  formData.append('language', 'fr')
  formData.append(
    'prompt',
    'Contexte : note vocale de chantier en français. Noms possibles : Hubert, Christophe, Chris, Bartosz, Grégory. Zones possibles : garage, sol béton, extérieur, sous-sol, terrasse, escalier, structure haut RDC. Termes techniques possibles : P1.7, IPE360, UPN350, HEA140, conteneur, gravats.',
  )

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Erreur Whisper:', error)
    throw new Error('Erreur lors de la transcription audio.')
  }

  const data = await response.json()
  const parsedData = z.object({ text: z.string() }).parse(data)
  return parsedData.text
}

export async function extractConstructionData(transcript: string): Promise<ConstructionData> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

  // Si aucune clé n'est fournie, on utilise le mode MOCK
  if (!apiKey) {
    console.log("Mode MOCK: Simulation de l'extraction IA (aucune clé API fournie)")
    await delay(1500) // Simule l'analyse LLM
    return {
      summary: 'Coulage de la dalle et manque de bâche',
      workType: 'Maçonnerie / Dalle',
      zone: 'Sol béton',
      workers: ['Hubert', 'Chris'],
      time: '8h - 12h',
      materials: ['4 sacs de ciment'],
      alerts: ['Il manque une bâche pour protéger'],
    }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant spécialisé en BTP. Tu dois extraire les informations d'une transcription audio dictée par un ouvrier sur un chantier.
Tu dois répondre STRICTEMENT en JSON avec la structure suivante :
{
  "summary": "Résumé ultra court d'une ligne",
  "workType": "Le type de travail (ex: démolition, protection, peinture)",
  "zone": "La zone mentionnée (ou 'Non précisé')",
  "workers": ["Prénoms des personnes mentionnées"],
  "time": "Horaires ou durée détectée",
  "materials": ["Matériaux utilisés"],
  "alerts": ["Points bloquants ou questions"]
}
Si une information manque, laisse un tableau vide [] ou la chaîne "Non précisé".`,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
      temperature: 0,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Erreur GPT:', error)
    throw new Error("Erreur lors de l'analyse du texte.")
  }

  const data = await response.json()
  const parsedData = z
    .object({ choices: z.array(z.object({ message: z.object({ content: z.string() }) })) })
    .parse(data)
  const content = parsedData.choices[0]?.message.content

  if (!content) {
    throw new Error("L'IA n'a pas renvoyé de contenu.")
  }

  try {
    const parsed = JSON.parse(content) as ConstructionData
    return parsed
  } catch (e) {
    console.error('Erreur de parsing JSON:', e)
    throw new Error("L'IA a renvoyé un format invalide.")
  }
}
