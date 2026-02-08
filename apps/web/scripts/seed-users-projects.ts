import { supabaseAdmin } from './utils/supabase-admin';

async function seedUsers() {
  console.log('👥 Seeding Users...');
  
  const users = [
    {
      email: 'alice@example.com',
      password: 'password123',
      firstName: 'Alice',
      lastName: 'Investor',
      role: 'explorateur'
    },
    {
      email: 'bob@example.com',
      password: 'password123',
      firstName: 'Bob',
      lastName: 'Shopper',
      role: 'protecteur'
    },
    {
      email: 'charlie@example.com',
      password: 'password123',
      firstName: 'Charlie',
      lastName: 'Producer',
      role: 'ambassadeur'
    }
  ];

  const createdUsers = [];

  for (const user of users) {
    let userId;
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        first_name: user.firstName,
        last_name: user.lastName
      }
    });

    if (createError) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = listData.users.find(u => u.email === user.email);
        
        if (existingUser) {
            userId = existingUser.id;
            console.log(`User ${user.email} already exists (${userId})`);
        } else {
            console.error(`Failed to create user ${user.email}:`, createError);
            continue;
        }
    } else {
        userId = newUser.user.id;
        console.log(`Created user ${user.email} (${userId})`);
    }

    if (userId) {
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                user_level: user.role,
                points_balance: 1000,
                is_public: true
            });
            
        if (profileError) {
            console.error(`Error updating profile for ${user.email}:`, profileError);
        } else {
            createdUsers.push({ ...user, id: userId });
        }
    }
  }
  
  return createdUsers;
}

async function seedProjects(users: any[]) {
  console.log('🏗️ Seeding Projects...');
  
  const { data: producers } = await supabaseAdmin
    .schema('investment')
    .from('producers')
    .select('id, slug, name_default')
    .in('slug', ['habeebee', 'ilanga-nature']);
    
  if (!producers || producers.length === 0) {
    console.error('Producers not found. Run seed-producers.ts first.');
    return [];
  }
  
  const habeebee = producers.find(p => p.slug === 'habeebee');
  const ilanga = producers.find(p => p.slug === 'ilanga-nature');
  
  const projects = [];

  // 1. Habeebee Project
  if (habeebee) {
      const slug = 'parrainage-ruche-2026';
      
      // Check if exists
      const { data: existing } = await supabaseAdmin
        .schema('investment')
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      const projectData = {
          producer_id: habeebee.id,
          slug: slug,
          type: 'beehive',
          target_budget: 5000,
          current_funding: 1200,
          status: 'active',
          name_i18n: { fr: 'Parrainage de Ruche - Printemps 2026', en: 'Beehive Sponsorship - Spring 2026' },
          description_i18n: { fr: 'Soutenez le développement d\'une nouvelle colonie.', en: 'Support the development of a new colony.' },
          location: 'POINT(4.3517 50.8503)',
          featured: true,
          hero_image_url: 'https://images.unsplash.com/photo-1478489896450-51b98bdbd259?auto=format&fit=crop&w=1200&q=80',
          gallery_image_urls: [
             'https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=800&q=80',
             'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
          ]
      };

      if (!existing) {
          const { data: project, error } = await supabaseAdmin
            .schema('investment')
            .from('projects')
            .insert(projectData)
            .select()
            .single();
            
          if (error) console.error('Error creating Habeebee project:', error);
          else {
              console.log(`Created project: ${project.slug}`);
              projects.push(project);
          }
      } else {
          console.log(`Project ${slug} already exists`);
          projects.push({ ...projectData, id: existing.id });
      }
  }

  // 2. Ilanga Project
  if (ilanga) {
      const slug = 'reforestation-ylang-2026';
      
      const { data: existing } = await supabaseAdmin
        .schema('investment')
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      const projectData = {
          producer_id: ilanga.id,
          slug: slug,
          type: 'olive_tree', // Proxy
          target_budget: 10000,
          current_funding: 3400,
          status: 'active',
          name_i18n: { fr: 'Reforestation Ylang-Ylang', en: 'Ylang-Ylang Reforestation' },
          description_i18n: { fr: 'Plantation durable à Madagascar.', en: 'Sustainable plantation in Madagascar.' },
          location: 'POINT(47.5 18.9)',
          featured: true,
          hero_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b73?auto=format&fit=crop&w=1200&q=80',
          gallery_image_urls: [
              'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80'
          ]
      };

      if (!existing) {
          const { data: project, error } = await supabaseAdmin
            .schema('investment')
            .from('projects')
            .insert(projectData)
            .select()
            .single();
            
          if (error) console.error('Error creating Ilanga project:', error);
          else {
              console.log(`Created project: ${project.slug}`);
              projects.push(project);
          }
      } else {
          console.log(`Project ${slug} already exists`);
          projects.push({ ...projectData, id: existing.id });
      }
  }
  
  return projects;
}

async function seedInvestments(users: any[], projects: any[]) {
    console.log('💰 Seeding Investments...');
    
    if (users.length === 0 || projects.length === 0) return;
    
    const alice = users.find(u => u.firstName === 'Alice');
    const bob = users.find(u => u.firstName === 'Bob');
    
    const investments = [
        { user: alice, project: projects[0], amount: 500 },
        { user: bob, project: projects[1], amount: 200 },
        { user: alice, project: projects[1], amount: 300 }
    ];
    
    for (const inv of investments) {
        if (!inv.user || !inv.project) continue;
        
        // Check duplication (simple check)
        const { data: existing } = await supabaseAdmin
            .schema('investment')
            .from('investments')
            .select('id')
            .eq('user_id', inv.user.id)
            .eq('project_id', inv.project.id)
            .eq('amount_points', inv.amount)
            .maybeSingle();
            
        if (!existing) {
            const { error } = await supabaseAdmin
                .schema('investment')
                .from('investments')
                .insert({
                    user_id: inv.user.id,
                    project_id: inv.project.id,
                    amount_points: inv.amount,
                    amount_eur_equivalent: inv.amount / 10,
                    status: 'completed'
                });
                
            if (error) console.error(`Error creating investment for ${inv.user.firstName}:`, error);
            else console.log(`Investment created: ${inv.user.firstName} -> ${inv.project.slug} (${inv.amount} pts)`);
        }
    }
}

async function seedOrders(users: any[]) {
    console.log('🛍️ Seeding Orders...');
    
    const { data: products } = await supabaseAdmin
        .schema('commerce')
        .from('products')
        .select('id, name_default, price_points')
        .limit(5);
        
    if (!products || products.length === 0) return;
    
    const bob = users.find(u => u.firstName === 'Bob');
    if (!bob) return;
    
    // Create Order - Try/Catch for trigger error
    try {
        const { data: order, error: orderError } = await supabaseAdmin
            .schema('commerce')
            .from('orders')
            .insert({
                user_id: bob.id,
                subtotal_points: 500,
                total_points: 500,
                points_used: 0,
                status: 'completed',
                shipping_address: { city: 'Paris', country: 'FR' }
            })
            .select()
            .single();
            
        if (orderError) {
            console.error('Error creating order (skipping due to trigger bug?):', orderError);
        } else if (order) {
            // Create Order Items
            for (const product of products.slice(0, 2)) {
                await supabaseAdmin
                    .schema('commerce')
                    .from('order_items')
                    .insert({
                        order_id: order.id,
                        product_id: product.id,
                        quantity: 1,
                        unit_price_points: product.price_points || 100,
                        total_price_points: product.price_points || 100
                    });
            }
            console.log(`Order created for ${bob.firstName} with items`);
        }
    } catch (e) {
        console.error('Exception creating order:', e);
    }
}

async function seedBlogPosts() {
    console.log('📝 Seeding Blog Posts...');
    
    const { data: user } = await supabaseAdmin
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('email', 'charlie@example.com')
        .single();
        
    if (!user) return;

    // 1. Ensure Author Exists
    let authorId;
    const { data: existingAuthor } = await supabaseAdmin
        .schema('content')
        .from('blog_authors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (existingAuthor) {
        authorId = existingAuthor.id;
    } else {
        const { data: newAuthor, error: authorError } = await supabaseAdmin
            .schema('content')
            .from('blog_authors')
            .insert({
                user_id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                bio: 'Producteur passionné et expert en apiculture.',
                avatar_url: user.avatar_url
            })
            .select()
            .single();
            
        if (authorError) {
            console.error('Error creating author:', authorError);
            return;
        }
        authorId = newAuthor.id;
        console.log(`Created author: ${user.first_name}`);
    }

    const posts = [
        {
            title: 'Pourquoi les abeilles sont essentielles ?',
            slug: 'pourquoi-les-abeilles-sont-essentielles',
            excerpt: 'Découvrez le rôle crucial des pollinisateurs.',
            cover_image_url: 'https://images.unsplash.com/photo-1559214369-a6b1d7919865?auto=format&fit=crop&w=1200&q=80',
            status: 'published',
            content: { 
                type: 'doc', 
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Les abeilles sont vitales pour notre écosystème...' }] }] 
            }
        },
        {
            title: 'L\'histoire de l\'Ylang-Ylang à Madagascar',
            slug: 'histoire-ylang-ylang-madagascar',
            excerpt: 'Un voyage olfactif au cœur de l\'île rouge.',
            cover_image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=80',
            status: 'published',
            content: { 
                type: 'doc', 
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Madagascar produit les meilleures huiles essentielles...' }] }] 
            }
        }
    ];

    for (const post of posts) {
        // Check existing
        const { data: existing } = await supabaseAdmin
            .schema('content')
            .from('blog_posts')
            .select('id')
            .eq('slug', post.slug)
            .maybeSingle();
            
        if (!existing) {
            const { error } = await supabaseAdmin
                .schema('content')
                .from('blog_posts')
                .insert({
                    ...post,
                    author_id: authorId,
                    published_at: new Date().toISOString()
                });
                
            if (error) console.error(`Error creating post ${post.title}:`, error);
            else console.log(`Created post: ${post.title}`);
        }
    }
}

async function main() {
    try {
        const users = await seedUsers();
        const projects = await seedProjects(users);
        await seedInvestments(users, projects);
        await seedOrders(users);
        await seedBlogPosts();
        console.log('✅ Done!');
    } catch (e) {
        console.error('Fatal:', e);
    }
}

main();
