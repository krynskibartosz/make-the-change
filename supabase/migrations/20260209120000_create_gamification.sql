-- Create Gamification Schema
CREATE SCHEMA IF NOT EXISTS "gamification";

-- Create Enums
DO $$ BEGIN
    CREATE TYPE "gamification"."challenge_type_enum" AS ENUM ('daily', 'monthly', 'season', 'special');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "gamification"."challenge_status_enum" AS ENUM ('active', 'inactive', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Challenges Table
CREATE TABLE IF NOT EXISTS "gamification"."challenges" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "description" text,
  "type" "gamification"."challenge_type_enum" NOT NULL DEFAULT 'monthly',
  "reward_points" integer NOT NULL DEFAULT 0,
  "reward_badge" text,
  "status" "gamification"."challenge_status_enum" NOT NULL DEFAULT 'active',
  "start_date" timestamp with time zone,
  "end_date" timestamp with time zone,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create User Challenges Table
CREATE TABLE IF NOT EXISTS "gamification"."user_challenges" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "challenge_id" uuid NOT NULL REFERENCES "gamification"."challenges"("id") ON DELETE CASCADE,
  "progress" integer DEFAULT 0,
  "target" integer DEFAULT 100,
  "completed_at" timestamp with time zone,
  "claimed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE "gamification"."challenges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gamification"."user_challenges" ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Challenges are readable by everyone
DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON "gamification"."challenges";
CREATE POLICY "Challenges are viewable by everyone" ON "gamification"."challenges"
  FOR SELECT USING (true);

-- User Challenges are viewable/editable only by the owner
DROP POLICY IF EXISTS "Users can view their own progress" ON "gamification"."user_challenges";
CREATE POLICY "Users can view their own progress" ON "gamification"."user_challenges"
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON "gamification"."user_challenges";
CREATE POLICY "Users can insert their own progress" ON "gamification"."user_challenges"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON "gamification"."user_challenges";
CREATE POLICY "Users can update their own progress" ON "gamification"."user_challenges"
  FOR UPDATE USING (auth.uid() = user_id);

-- Seed Initial Challenges
INSERT INTO "gamification"."challenges" ("slug", "title", "description", "type", "reward_points", "reward_badge", "status") VALUES
('streak-7', 'Streak 7 jours', 'Revenez chaque jour pour suivre vos progrès.', 'daily', 150, NULL, 'active'),
('invest-2-projets', '2 projets ce mois-ci', 'Soutenez 2 projets actifs pendant le mois.', 'monthly', 300, NULL, 'active'),
('top-100', 'Top 100', 'Montez dans le classement global.', 'season', 0, 'Badge', 'active')
ON CONFLICT ("slug") DO NOTHING;
