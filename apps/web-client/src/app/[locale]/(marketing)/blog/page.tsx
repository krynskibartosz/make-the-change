import { SectionContainer } from '@/components/ui/section-container'
import { getBlogPosts } from '@/features/blog/blog-data'
import { BlogCard } from '@/features/blog/components/blog-card'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const featuredPost = posts.find(p => p.featured) || posts[0]
  const otherPosts = posts.filter(p => p.id !== featuredPost?.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Blog & Actualités
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  Explorez le futur de <span className="text-primary block mt-2">l'impact positif.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-lg leading-relaxed">
                  Des histoires inspirantes, des analyses d'experts et les coulisses de nos projets pour comprendre comment nous changeons le monde ensemble.
                </p>
              </div>
              
              {/* Search or Categories could go here */}
              <div className="flex gap-3">
                {['Tous', 'Impact', 'Technologie', 'Lifestyle'].map((cat, i) => (
                  <button 
                    key={cat}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      i === 0 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Post - Side Layout */}
            {featuredPost && (
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <BlogCard post={featuredPost} variant="featured" className="aspect-[4/3] lg:aspect-square" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold tracking-tight">Récents articles</h2>
            {/* Filter component could go here */}
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
