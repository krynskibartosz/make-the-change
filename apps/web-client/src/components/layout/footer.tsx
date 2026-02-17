'use client'

import { Mail, MapPin, Instagram, Facebook, Linkedin, Music } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Logo } from '@/components/ui/logo'
import { useCart } from '@/features/commerce/cart/use-cart'
import { useUser } from '@/hooks/use-user'

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()
  const { items } = useCart()
  const { user } = useUser()

  return (
    <footer className="hidden border-t bg-card md:block">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo variant="icon" height={36} width={36} className="h-9" />
              <span className="text-xl font-bold text-foreground">Make the Change</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">{t('quick_links')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('projects')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('leaderboard')}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('how_it_works')}
                </Link>
              </li>
              <li>
                <Link
                  href="/brand-guidelines"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('brand_guidelines')}
                </Link>
              </li>
              <li>
                <Link
                  href="/biodex"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  BioDex
                </Link>
              </li>
              <li>
                <Link
                  href="/challenges"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Challenges
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('menu')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Shopping */}
          <div>
            <h3 className="mb-4 font-semibold">Account & Shopping</h3>
            <ul className="space-y-2 text-sm">
              {user ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('profile')}
                    </Link>
                  </li>
                </>
              ) : null}

              <li>
                <Link
                  href="/cart"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('cart')}
                </Link>
              </li>

              {items.length > 0 ? (
                <li>
                  <Link
                    href="/checkout"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('checkout')}
                  </Link>
                </li>
              ) : null}

              {!user ? (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('login')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('register')}
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">{t('support')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">{t('contact_us')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:contact@make-the-change.com"
                  className="hover:text-foreground transition-colors"
                >
                  contact@make-the-change.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{t('address')}</span>
              </li>
            </ul>

            <div className="mt-4">
              <h4 className="mb-3 text-sm font-medium">{t('follow_us')}</h4>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/makethechange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/makethechange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/makethechange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://tiktok.com/@makethechange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                  aria-label="TikTok"
                >
                  <Music className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Make the CHANGE. {t('rights_reserved')}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
