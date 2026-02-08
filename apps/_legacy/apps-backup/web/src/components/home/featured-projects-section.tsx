'use client';

import { motion } from 'framer-motion';
import { MapPin, Target, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { Button } from '@/components/ui/button';

import type { FC } from 'react';

type FeaturedProject = {
  id: string;
  name: string;
  location: string;
  type: 'beehive' | 'olive' | 'reforestation';
  fundingGoal: number;
  currentFunding: number;
  roi: number;
  duration: string;
  description: string;
  image?: string;
};

type FeaturedProjectsSectionProps = {
  projects?: FeaturedProject[];
};

export const FeaturedProjectsSection: FC<FeaturedProjectsSectionProps> = ({
  projects,
}) => {
  const defaultProjects: FeaturedProject[] = [
    {
      id: '1',
      name: 'Ruches HABEEBEE Gand',
      location: 'Gand, Belgique',
      type: 'beehive',
      fundingGoal: 50_000,
      currentFunding: 35_000,
      roi: 8.5,
      duration: '18 mois',
      description:
        'Développement apicole durable avec retour garanti et impact environnemental mesurable.',
    },
    {
      id: '2',
      name: 'Oliviers ILANGA Madagascar',
      location: 'Madagascar',
      type: 'olive',
      fundingGoal: 75_000,
      currentFunding: 45_000,
      roi: 12,
      duration: '24 mois',
      description:
        'Plantation d&apos;oliviers créant des emplois locaux et produisant une huile premium.',
    },
    {
      id: '3',
      name: 'Parcelles Familiales PROMIEL',
      location: 'Luxembourg',
      type: 'reforestation',
      fundingGoal: 30_000,
      currentFunding: 28_000,
      roi: 6,
      duration: '12 mois',
      description:
        'Reforestation avec parcelles familiales et production de miel artisanal.',
    },
  ];

  const data = projects || defaultProjects;

  const getProjectIcon = (type: FeaturedProject['type']) => {
    switch (type) {
      case 'beehive': {
        return '🐝';
      }
      case 'olive': {
        return '🫒';
      }
      case 'reforestation': {
        return '🌳';
      }
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-3xl font-bold md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Projets en Vedette
        </motion.h2>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground mx-auto max-w-2xl text-lg"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Découvrez nos projets phares et rejoignez une communauté engagée pour
          un avenir durable
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((project, index) => {
          const fundingPercentage =
            (project.currentFunding / project.fundingGoal) * 100;

          return (
            <motion.div
              key={project.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Card className="group border-border/50 bg-background/60 h-full backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:bg-background/80 hover:shadow-2xl hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                        {getProjectIcon(project.type)}
                      </span>
                      <div>
                        <h3 className="text-lg leading-tight font-bold transition-colors group-hover:text-primary">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Target className="text-primary h-4 w-4" />
                    <span className="font-medium">
                      {fundingPercentage.toFixed(0)}% financé
                    </span>
                    <span className="text-muted-foreground">
                      ({project.currentFunding.toLocaleString()}€ /{' '}
                      {project.fundingGoal.toLocaleString()}€)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-green-600">
                      ROI: {project.roi}% sur {project.duration}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="from-primary to-accent h-full bg-gradient-to-r transition-all duration-500"
                        style={{ width: `${fundingPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    asChild
                    className="group/btn flex-1 transition-all hover:scale-[1.03] hover:shadow-md"
                    size="sm"
                    variant="outline"
                  >
                    <Link
                      className="relative flex items-center justify-center gap-1"
                      href={`/projects/${project.id}`}
                    >
                      <span>En savoir plus</span>
                      <svg
                        className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="group/btn flex-1 transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/20"
                    size="sm"
                  >
                    <Link
                      className="relative flex items-center justify-center gap-1"
                      href={`/projects/${project.id}/invest`}
                    >
                      <span>Investir</span>
                      <svg
                        className="h-3 w-3 transition-transform group-hover/btn:scale-110"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          asChild
          className="group/cta relative overflow-hidden transition-all hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/15"
          size="lg"
          variant="outline"
        >
          <Link
            className="relative flex items-center gap-2"
            href="/projects"
          >
            <span className="relative z-10">Voir tous les projets</span>
            <svg
              className="relative z-10 h-5 w-5 transition-transform group-hover/cta:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M17 8l4 4m0 0l-4 4m4-4H3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] transition-transform duration-700 group-hover/cta:translate-x-[100%]" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
};
