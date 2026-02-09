import { supabaseAdmin } from './utils/supabase-admin';

// --- Data Arrays ---

const firstNames = [
  "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "Elijah", "Sophia", "Lucas",
  "Mia", "Mason", "Charlotte", "Logan", "Amelia", "Alexander", "Harper", "Ethan", "Evelyn", "Jacob",
  "Abigail", "Michael", "Emily", "Daniel", "Elizabeth", "Henry", "Mila", "Jackson", "Ella", "Sebastian",
  "Avery", "Aiden", "Sofia", "Matthew", "Camila", "Samuel", "Aria", "David", "Scarlett", "Joseph",
  "Victoria", "Carter", "Madison", "Owen", "Luna", "Wyatt", "Grace", "John", "Chloe", "Jack",
  "Penelope", "Luke", "Layla", "Jayden", "Riley", "Dylan", "Zoey", "Grayson", "Nora", "Levi"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
];

const cities = [
  { name: "Paris", country: "FR", lat: 48.8566, lng: 2.3522 },
  { name: "Lyon", country: "FR", lat: 45.7640, lng: 4.8357 },
  { name: "Marseille", country: "FR", lat: 43.2965, lng: 5.3698 },
  { name: "Bordeaux", country: "FR", lat: 44.8378, lng: -0.5792 },
  { name: "Toulouse", country: "FR", lat: 43.6047, lng: 1.4442 },
  { name: "Nice", country: "FR", lat: 43.7102, lng: 7.2620 },
  { name: "Nantes", country: "FR", lat: 47.2184, lng: -1.5536 },
  { name: "Strasbourg", country: "FR", lat: 48.5734, lng: 7.7521 },
  { name: "Montpellier", country: "FR", lat: 43.6108, lng: 3.8767 },
  { name: "Lille", country: "FR", lat: 50.6292, lng: 3.0573 },
  { name: "Bruxelles", country: "BE", lat: 50.8503, lng: 4.3517 },
  { name: "Anvers", country: "BE", lat: 51.2194, lng: 4.4025 },
  { name: "Gand", country: "BE", lat: 51.0543, lng: 3.7174 },
  { name: "Liège", country: "BE", lat: 50.6326, lng: 5.5797 },
  { name: "Namur", country: "BE", lat: 50.4674, lng: 4.8720 }
];

const bios = [
  "Passionné par l'écologie et les circuits courts.",
  "Investisseur responsable, je cherche à soutenir des projets durables.",
  "Amateur de miel et de produits naturels.",
  "Engagé pour la biodiversité et la protection des abeilles.",
  "J'aime cuisiner avec des produits de qualité.",
  "À la recherche de sens dans mes investissements.",
  "Explorateur du quotidien, fan de nature.",
  "Jardinier amateur et défenseur de l'environnement.",
  "Je soutiens l'agriculture locale.",
  "Consommateur conscient, je veux changer le monde à mon échelle."
];

const avatarBaseUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=";

// --- Helpers ---

function getRandomElement<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error('Empty array');
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Main ---

async function seedManyUsers() {
  console.log('🚀 Starting generation of 50 users...');

  const createdUsers = [];

  for (let i = 0; i < 50; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    // Add a random number to email to ensure uniqueness
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${getRandomInt(100, 9999)}@example.com`;
    const city = getRandomElement(cities);
    const role = getRandomElement(['explorateur', 'protecteur', 'ambassadeur']);
    const bio = getRandomElement(bios);
    
    // Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    });

    if (authError) {
      console.error(`❌ Failed to create auth user ${email}:`, authError.message);
      continue;
    }

    const userId = authData.user.id;
    const avatarUrl = `${avatarBaseUrl}${userId}`;

    // Create Profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        user_level: role,
        points_balance: getRandomInt(0, 5000),
        is_public: true,
        bio: bio,
        address_city: city.name,
        address_country_code: city.country,
        // address_coordinates removed as it does not exist in the schema
        avatar_url: avatarUrl,
        social_links: {
            twitter: `https://twitter.com/${firstName}${lastName}`,
            linkedin: `https://linkedin.com/in/${firstName}${lastName}`
        },
        notification_preferences: {
            email_newsletter: Math.random() > 0.5,
            push_notifications: Math.random() > 0.5
        }
      });

    if (profileError) {
      console.error(`❌ Failed to create profile for ${email}:`, profileError.message);
    } else {
      console.log(`✅ Created user ${i + 1}/50: ${firstName} ${lastName} (${role})`);
      createdUsers.push(userId);
    }
  }

  console.log(`\n🎉 Successfully created ${createdUsers.length} users!`);
}

seedManyUsers().catch(console.error);
