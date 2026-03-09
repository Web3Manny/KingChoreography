'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Calendar, Settings, LogOut, Menu, X } from 'lucide-react'

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_king-choreography/artifacts/uem2uv73_BK%20Logo%20TRSP.png'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/applications', icon: Users, label: 'Applications' },
  { href: '/admin/queue', icon: Calendar, label: 'Queue' },
  { href: '/admin/submissions', icon: FileText, label: 'Submissions' },
  { href: '/admin/services', icon: Settings, label: 'Services' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('kc_token')
    if (!token && !pathname.includes('/login')) {
      router.push('/admin/login')
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('kc_token')
    localStorage.removeItem('kc_user')
    router.push('/admin/login')
  }

  const isActive = (path: string, exact?: boolean) => exact ? pathname === path : pathname.startsWith(path)

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex" data-testid="admin-layout">
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0A0A0A] border-r border-white/5 fixed h-full z-40" data-testid="admin-sidebar">
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3"><img src={LOGO_URL} alt="King Choreography" className="h-10 w-auto" /></Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label, exact }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${
                isActive(href, exact) ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            ><Icon className="w-4 h-4" />{label}</Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="block text-xs text-white/30 hover:text-[#D4AF37] mb-3 transition-colors">View Public Site</Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition-colors" data-testid="admin-logout">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white" data-testid="admin-mobile-toggle">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="font-heading text-sm font-bold tracking-wider text-white uppercase">ADMIN</span>
        <button onClick={handleLogout} className="text-white/40"><LogOut className="w-4 h-4" /></button>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-[#0A0A0A] h-full border-r border-white/5 pt-16 p-4" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {navItems.map(({ href, icon: Icon, label, exact }) => (
                <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${
                    isActive(href, exact) ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-white/50 hover:text-white'
                  }`}
                ><Icon className="w-4 h-4" />{label}</Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}
