import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "./utils/supabase-admin";

const SEED_SOURCE = "community_realistic_v1";
const TARGET_POSTS = 180;

type Profile = {
	id: string;
	email: string;
	first_name: string | null;
	last_name: string | null;
	user_level: "explorateur" | "protecteur" | "ambassadeur" | null;
};

type GuildDefinition = {
	name: string;
	slug: string;
	description: string;
	type: "open" | "invite_only" | "corporate" | "school" | "family";
};

type GuildRow = {
	id: string;
	slug: string;
	owner_id: string;
};

type ProjectRow = {
	id: string;
	slug: string;
	name_default: string;
};

type ProjectUpdateRow = {
	id: string;
	project_id: string;
	title: string;
};

type PostInsert = {
	author_id: string;
	content: string;
	image_urls: string[];
	project_update_id: string | null;
	type: "user_post" | "project_update_share" | "system_event";
	visibility: "public" | "guild_only" | "private";
	metadata: Record<string, unknown>;
	created_at: string;
	updated_at: string;
};

const GUILDS: GuildDefinition[] = [
	{
		name: "Green Builders Brussels",
		slug: "green-builders-brussels",
		description:
			"Collectif bruxellois orienté actions locales, ateliers et projets biodiversité.",
		type: "open",
	},
	{
		name: "Campus Biodiversity Lab",
		slug: "campus-biodiversity-lab",
		description:
			"Étudiants et alumni qui transforment les campus en zones de régénération.",
		type: "school",
	},
	{
		name: "Tech For Pollinators",
		slug: "tech-for-pollinators",
		description:
			"Professionnels tech engagés sur les sujets abeilles, capteurs et impact data.",
		type: "corporate",
	},
	{
		name: "Familles Zéro Impact",
		slug: "familles-zero-impact",
		description:
			"Parents et enfants qui suivent des défis concrets chaque semaine.",
		type: "family",
	},
	{
		name: "Ocean & Mangrove Circle",
		slug: "ocean-mangrove-circle",
		description:
			"Communauté orientée protection du littoral, mangroves et récifs.",
		type: "open",
	},
	{
		name: "Agroforest Pioneers",
		slug: "agroforest-pioneers",
		description:
			"Membres passionnés par l’agroforesterie, le suivi terrain et le mentorat.",
		type: "open",
	},
];

const TARGET_MEMBERS_BY_GUILD_SLUG: Record<string, number> = {
	"green-builders-brussels": 24,
	"campus-biodiversity-lab": 28,
	"tech-for-pollinators": 22,
	"familles-zero-impact": 26,
	"ocean-mangrove-circle": 20,
	"agroforest-pioneers": 24,
};

const POST_TEMPLATES = [
	"Retour terrain: on a validé une nouvelle zone de plantation près de {project}. Les bénévoles ont été incroyables.",
	"Petit update de la semaine: +{metric} actions utiles sur notre groupe. On continue le rythme.",
	"On vient de boucler une session de sensibilisation avec 2 classes. Beaucoup de questions sur les pollinisateurs.",
	"Je partage le plan d’action de mon équipe pour le mois prochain: focus suivi, entretien et pédagogie.",
	"Belle avancée sur {project}: la communauté locale commence à voir les premiers effets.",
	"Feedback rapide: le format “micro-actions quotidiennes” fonctionne super bien pour garder la motivation.",
	"Ce matin, on a fait un point budget + impact. Les priorités sont plus claires et le cap est bon.",
	"Merci à toutes les personnes qui ont commenté hier, vos idées ont directement nourri notre roadmap.",
	"On a testé un nouveau rituel de groupe (15 min) pour aligner objectifs et actions concrètes. Très efficace.",
	"Update terrain: conditions météo compliquées, mais l’équipe a maintenu le planning.",
	"Objectif atteint cette semaine, place à la suite: qualité des contributions avant quantité.",
	"On a commencé à documenter les bonnes pratiques pour que d’autres guildes puissent reproduire.",
];

const COMMENT_TEMPLATES = [
	"Super initiative, merci pour le partage.",
	"On a vu un résultat similaire de notre côté.",
	"Très utile, vous pouvez partager votre méthode plus en détail ?",
	"Bravo à l’équipe, c’est inspirant.",
	"On peut aider sur la prochaine étape si besoin.",
	"Excellent update, continuez comme ça.",
	"Clairement le bon format pour mobiliser plus de monde.",
	"Merci, ça nous donne des idées concrètes.",
	"Top, on a hâte de voir les prochaines avancées.",
	"Très bon signal pour la communauté.",
];

const HASHTAG_POOL = [
	"biodiversite",
	"climat",
	"impact",
	"agroforesterie",
	"pollinisateurs",
	"mangroves",
	"ocean",
	"abeilles",
	"communaute",
	"actionlocale",
	"restauration",
	"naturepositive",
];

const IMAGE_POOL = [
	"https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=1200&q=80",
	"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
	"https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80",
	"https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
	"https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
	"https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
];

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample<T>(items: T[]): T {
	return items[randomInt(0, items.length - 1)] as T;
}

function shuffle<T>(items: T[]): T[] {
	return [...items].sort(() => Math.random() - 0.5);
}

function chunk<T>(items: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let index = 0; index < items.length; index += size) {
		chunks.push(items.slice(index, index + size));
	}
	return chunks;
}

function randomDateInLastDays(days: number): Date {
	const now = Date.now();
	const maxOffset = days * 24 * 60 * 60 * 1000;
	return new Date(now - Math.random() * maxOffset);
}

function clampToNow(date: Date): Date {
	const now = Date.now();
	return date.getTime() > now ? new Date(now) : date;
}

function pickHashtags(): string[] {
	const count = randomInt(2, 4);
	return shuffle(HASHTAG_POOL).slice(0, count);
}

function buildPostContent(template: string, projectName: string): string {
	const metric = randomInt(18, 320).toString();
	const hashtags = pickHashtags().map((tag) => `#${tag}`);
	return `${template.replace("{project}", projectName).replace("{metric}", metric)} ${hashtags.join(" ")}`;
}

function inferAuthorType(profile: Profile): "citizen" | "company" {
	if (profile.email.includes("admin@") || profile.email.includes("producer@")) {
		return "company";
	}
	if (profile.user_level === "ambassadeur" && Math.random() < 0.35) {
		return "company";
	}
	return "citizen";
}

async function fetchProfiles(): Promise<Profile[]> {
	const { data, error } = await supabaseAdmin
		.from("profiles")
		.select("id, email, first_name, last_name, user_level")
		.is("deleted_at", null)
		.limit(500);

	if (error || !data) {
		throw new Error(
			`Impossible de charger les profils: ${error?.message || "unknown"}`,
		);
	}

	return data.filter((profile) => !!profile.id && !!profile.email);
}

async function fetchProjects(): Promise<ProjectRow[]> {
	const { data, error } = await supabaseAdmin
		.schema("investment")
		.from("projects")
		.select("id, slug, name_default")
		.eq("status", "active")
		.limit(100);

	if (error || !data) {
		return [];
	}

	return data.filter((project) => !!project.id && !!project.name_default);
}

async function fetchProjectUpdates(): Promise<ProjectUpdateRow[]> {
	const { data, error } = await supabaseAdmin
		.schema("investment")
		.from("project_updates")
		.select("id, project_id, title")
		.limit(500);

	if (error || !data) {
		return [];
	}

	return data.filter((update) => !!update.id && !!update.project_id);
}

async function ensureGuilds(profiles: Profile[]): Promise<GuildRow[]> {
	const guildRows: GuildRow[] = [];

	for (const definition of GUILDS) {
		const { data: existing, error: findError } = await supabaseAdmin
			.schema("identity")
			.from("guilds")
			.select("id, slug, owner_id")
			.eq("slug", definition.slug)
			.maybeSingle();

		if (!findError && existing) {
			guildRows.push(existing);
			continue;
		}

		const owner = sample(profiles);
		const { data: inserted, error: insertError } = await supabaseAdmin
			.schema("identity")
			.from("guilds")
			.insert({
				name: definition.name,
				slug: definition.slug,
				description: definition.description,
				owner_id: owner.id,
				type: definition.type,
				metadata: {
					seed_source: SEED_SOURCE,
					created_by_script: true,
				},
			})
			.select("id, slug, owner_id")
			.single();

		if (insertError || !inserted) {
			console.error(
				`❌ Erreur création guilde ${definition.slug}:`,
				insertError?.message,
			);
			continue;
		}

		guildRows.push(inserted);
	}

	return guildRows;
}

async function ensureGuildMembers(profiles: Profile[], guilds: GuildRow[]) {
	let inserted = 0;

	for (const guild of guilds) {
		const targetMembers = TARGET_MEMBERS_BY_GUILD_SLUG[guild.slug] || 20;
		const { data: existingRows } = await supabaseAdmin
			.schema("identity")
			.from("guild_members")
			.select("user_id")
			.eq("guild_id", guild.id);

		const existingUserIds = new Set(
			(existingRows || [])
				.map((row) => row.user_id as string)
				.filter((userId) => !!userId),
		);

		const rows: Array<{
			guild_id: string;
			user_id: string;
			role: "member" | "officer" | "leader";
			joined_at: string;
		}> = [];

		if (!existingUserIds.has(guild.owner_id)) {
			rows.push({
				guild_id: guild.id,
				user_id: guild.owner_id,
				role: "leader",
				joined_at: randomDateInLastDays(180).toISOString(),
			});
			existingUserIds.add(guild.owner_id);
		}

		const missingSlots = Math.max(0, targetMembers - existingUserIds.size);
		if (missingSlots === 0 && rows.length === 0) {
			continue;
		}

		const candidates = shuffle(
			profiles.filter((profile) => !existingUserIds.has(profile.id)),
		).slice(0, missingSlots);

		candidates.forEach((profile, index) => {
			rows.push({
				guild_id: guild.id,
				user_id: profile.id,
				role: index < 2 ? "officer" : "member",
				joined_at: randomDateInLastDays(120).toISOString(),
			});
		});

		rows.push({
			guild_id: guild.id,
			user_id: guild.owner_id,
			role: "leader",
			joined_at: randomDateInLastDays(180).toISOString(),
		});

		const deduplicatedRows = [
			...new Map(
				rows.map((row) => [`${row.guild_id}:${row.user_id}`, row] as const),
			).values(),
		];

		const { data, error } = await supabaseAdmin
			.schema("identity")
			.from("guild_members")
			.upsert(deduplicatedRows, { onConflict: "guild_id,user_id" })
			.select("guild_id");

		if (error) {
			console.error(`❌ Erreur membres guilde ${guild.slug}:`, error.message);
			continue;
		}

		inserted += data?.length || 0;
	}

	return inserted;
}

async function fetchGuildMembers(): Promise<Map<string, string[]>> {
	const map = new Map<string, string[]>();

	const { data, error } = await supabaseAdmin
		.schema("identity")
		.from("guild_members")
		.select("guild_id, user_id");

	if (error || !data) {
		return map;
	}

	for (const row of data) {
		const guildId = row.guild_id as string;
		const userId = row.user_id as string;

		if (!guildId || !userId) {
			continue;
		}

		const current = map.get(guildId) || [];
		current.push(userId);
		map.set(guildId, current);
	}

	return map;
}

async function createPosts(
	profiles: Profile[],
	projects: ProjectRow[],
	updates: ProjectUpdateRow[],
	guilds: GuildRow[],
	guildMembersByGuild: Map<string, string[]>,
): Promise<string[]> {
	const { count: existingCount, error: countError } = await supabaseAdmin
		.schema("social")
		.from("posts")
		.select("id", { head: true, count: "exact" })
		.contains("metadata", { seed_source: SEED_SOURCE });

	if (countError) {
		throw new Error(
			`Impossible de compter les posts seed: ${countError.message}`,
		);
	}

	const alreadySeeded = existingCount || 0;
	const remaining = Math.max(0, TARGET_POSTS - alreadySeeded);

	if (remaining === 0) {
		console.log(
			`🟰 ${alreadySeeded} posts seed déjà présents, aucun ajout nécessaire.`,
		);
		return [];
	}

	const postsToInsert: PostInsert[] = [];

	for (let index = 0; index < remaining; index++) {
		const author = sample(profiles);
		const project = projects.length > 0 ? sample(projects) : null;
		const template = sample(POST_TEMPLATES);

		const visibilityRoll = Math.random();
		const visibility: "public" | "guild_only" | "private" =
			visibilityRoll < 0.78
				? "public"
				: visibilityRoll < 0.96
					? "guild_only"
					: "private";

		let guildContext: GuildRow | null = null;
		if (visibility === "guild_only" && guilds.length > 0) {
			const candidates = guilds.filter((guild) => {
				const members = guildMembersByGuild.get(guild.id) || [];
				return members.includes(author.id);
			});
			guildContext =
				candidates.length > 0 ? sample(candidates) : sample(guilds);
		}

		const relatedUpdate =
			updates.length > 0 && Math.random() < 0.14 ? sample(updates) : null;

		const type: "user_post" | "project_update_share" | "system_event" =
			relatedUpdate
				? "project_update_share"
				: Math.random() < 0.04
					? "system_event"
					: "user_post";

		const createdAt = randomDateInLastDays(120);
		const updatedAt = clampToNow(
			new Date(createdAt.getTime() + randomInt(0, 36) * 60 * 60 * 1000),
		);

		const content = buildPostContent(
			template,
			project?.name_default || "nos projets en cours",
		);
		const imageUrls = Math.random() < 0.18 ? [sample(IMAGE_POOL)] : [];

		postsToInsert.push({
			author_id: author.id,
			content,
			image_urls: imageUrls,
			project_update_id:
				type === "project_update_share" ? relatedUpdate?.id || null : null,
			type,
			visibility,
			metadata: {
				seed_source: SEED_SOURCE,
				seed_version: 1,
				author_type: inferAuthorType(author),
				guild_id: guildContext?.id || null,
				guild_slug: guildContext?.slug || null,
				project_slug: project?.slug || null,
				generated_from: "seed-community-realistic.ts",
			},
			created_at: createdAt.toISOString(),
			updated_at: updatedAt.toISOString(),
		});
	}

	const insertedPostIds: string[] = [];

	for (const batch of chunk(postsToInsert, 100)) {
		const { data, error } = await supabaseAdmin
			.schema("social")
			.from("posts")
			.insert(batch)
			.select("id");

		if (error) {
			console.error("❌ Erreur insertion posts:", error.message);
			continue;
		}

		insertedPostIds.push(...(data || []).map((row) => row.id as string));
	}

	console.log(`✅ Posts ajoutés: ${insertedPostIds.length}`);
	return insertedPostIds;
}

async function createComments(profiles: Profile[], postIds: string[]) {
	if (postIds.length === 0) {
		return [] as string[];
	}

	const { data: posts } = await supabaseAdmin
		.schema("social")
		.from("posts")
		.select("id, author_id, created_at, visibility, metadata")
		.in("id", postIds);

	if (!posts || posts.length === 0) {
		return [] as string[];
	}

	const commentsToInsert: Array<{
		author_id: string;
		post_id: string;
		content: string;
		metadata: Record<string, unknown>;
		created_at: string;
		updated_at: string;
	}> = [];

	for (const post of posts) {
		const commentsCount = randomInt(0, 5);
		const postCreatedAt = new Date(post.created_at as string);

		for (let index = 0; index < commentsCount; index++) {
			const commenter = sample(profiles);
			if (commenter.id === (post.author_id as string) && Math.random() < 0.65) {
				continue;
			}

			const createdAt = new Date(
				postCreatedAt.getTime() + randomInt(10, 14 * 24 * 60) * 60 * 1000,
			);
			const boundedCreatedAt = clampToNow(createdAt);
			const updatedAt = clampToNow(
				new Date(createdAt.getTime() + randomInt(0, 12 * 60) * 60 * 1000),
			);

			commentsToInsert.push({
				author_id: commenter.id,
				post_id: post.id as string,
				content: sample(COMMENT_TEMPLATES),
				metadata: {
					seed_source: SEED_SOURCE,
					via: "community_comment",
				},
				created_at: boundedCreatedAt.toISOString(),
				updated_at: updatedAt.toISOString(),
			});
		}
	}

	const insertedCommentIds: string[] = [];
	for (const batch of chunk(commentsToInsert, 300)) {
		const { data, error } = await supabaseAdmin
			.schema("social")
			.from("comments")
			.insert(batch)
			.select("id");

		if (error) {
			console.error("❌ Erreur insertion commentaires:", error.message);
			continue;
		}

		insertedCommentIds.push(...(data || []).map((row) => row.id as string));
	}

	console.log(`✅ Commentaires ajoutés: ${insertedCommentIds.length}`);
	return insertedCommentIds;
}

async function createReactions(
	profiles: Profile[],
	postIds: string[],
	commentIds: string[],
) {
	const postReactions: Array<{
		id: string;
		user_id: string;
		type: "like" | "super_like" | "plant";
		post_id: string;
		comment_id: null;
		project_update_id: null;
		created_at: string;
	}> = [];
	const commentReactions: Array<{
		id: string;
		user_id: string;
		type: "like" | "super_like" | "plant";
		post_id: null;
		comment_id: string;
		project_update_id: null;
		created_at: string;
	}> = [];

	const seenPostReactionKeys = new Set<string>();
	const seenCommentReactionKeys = new Set<string>();

	for (const postId of postIds) {
		const reactionsCount = randomInt(4, 18);
		const users = shuffle(profiles).slice(
			0,
			Math.min(reactionsCount, profiles.length),
		);

		for (const user of users) {
			const type: "like" | "super_like" | "plant" =
				Math.random() < 0.78
					? "like"
					: Math.random() < 0.8
						? "super_like"
						: "plant";

			const key = `${user.id}:${postId}:${type}`;
			if (seenPostReactionKeys.has(key)) {
				continue;
			}
			seenPostReactionKeys.add(key);

			postReactions.push({
				id: randomUUID(),
				user_id: user.id,
				type,
				post_id: postId,
				comment_id: null,
				project_update_id: null,
				created_at: randomDateInLastDays(90).toISOString(),
			});
		}
	}

	for (const commentId of commentIds) {
		const reactionsCount = randomInt(0, 5);
		const users = shuffle(profiles).slice(
			0,
			Math.min(reactionsCount, profiles.length),
		);

		for (const user of users) {
			const type: "like" | "super_like" | "plant" =
				Math.random() < 0.92 ? "like" : "super_like";
			const key = `${user.id}:${commentId}:${type}`;
			if (seenCommentReactionKeys.has(key)) {
				continue;
			}
			seenCommentReactionKeys.add(key);

			commentReactions.push({
				id: randomUUID(),
				user_id: user.id,
				type,
				post_id: null,
				comment_id: commentId,
				project_update_id: null,
				created_at: randomDateInLastDays(90).toISOString(),
			});
		}
	}

	let insertedCount = 0;
	for (const batch of chunk(postReactions, 500)) {
		const { data, error } = await supabaseAdmin
			.schema("social")
			.from("reactions")
			.insert(batch)
			.select("id");
		if (error) {
			console.error("❌ Erreur insertion réactions post:", error.message);
			continue;
		}
		insertedCount += data?.length || 0;
	}

	for (const batch of chunk(commentReactions, 500)) {
		const { data, error } = await supabaseAdmin
			.schema("social")
			.from("reactions")
			.insert(batch)
			.select("id");
		if (error) {
			console.error(
				"❌ Erreur insertion réactions commentaire:",
				error.message,
			);
			continue;
		}
		insertedCount += data?.length || 0;
	}

	console.log(`✅ Réactions ajoutées: ${insertedCount}`);
	return insertedCount;
}

async function summarize() {
	const [posts, comments, reactions, guilds, members] = await Promise.all([
		supabaseAdmin
			.schema("social")
			.from("posts")
			.select("id", { count: "exact", head: true }),
		supabaseAdmin
			.schema("social")
			.from("comments")
			.select("id", { count: "exact", head: true }),
		supabaseAdmin
			.schema("social")
			.from("reactions")
			.select("id", { count: "exact", head: true }),
		supabaseAdmin
			.schema("identity")
			.from("guilds")
			.select("id", { count: "exact", head: true }),
		supabaseAdmin
			.schema("identity")
			.from("guild_members")
			.select("guild_id", { count: "exact", head: true }),
	]);

	console.log("\n📊 État actuel:");
	console.log(`- Posts: ${posts.count || 0}`);
	console.log(`- Commentaires: ${comments.count || 0}`);
	console.log(`- Réactions: ${reactions.count || 0}`);
	console.log(`- Guildes: ${guilds.count || 0}`);
	console.log(`- Membres de guildes: ${members.count || 0}`);
}

async function main() {
	console.log("🚀 Seed communauté réaliste");
	const profiles = await fetchProfiles();

	if (profiles.length < 12) {
		throw new Error(
			"Pas assez de profils pour générer un dataset communautaire crédible.",
		);
	}

	const projects = await fetchProjects();
	const updates = await fetchProjectUpdates();

	console.log(`👥 Profils disponibles: ${profiles.length}`);
	console.log(`🌱 Projets actifs: ${projects.length}`);
	console.log(`📣 Updates projets: ${updates.length}`);

	const guilds = await ensureGuilds(profiles);
	const memberUpserts = await ensureGuildMembers(profiles, guilds);
	console.log(
		`🛡️ Guildes actives: ${guilds.length} (membres upsert: ${memberUpserts})`,
	);

	const guildMembersByGuild = await fetchGuildMembers();
	const newPostIds = await createPosts(
		profiles,
		projects,
		updates,
		guilds,
		guildMembersByGuild,
	);
	const newCommentIds = await createComments(profiles, newPostIds);
	await createReactions(profiles, newPostIds, newCommentIds);

	await summarize();
}

main().catch((error) => {
	console.error("❌ Seed communauté échoué:", error);
	process.exit(1);
});
