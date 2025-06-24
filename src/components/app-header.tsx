'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterUiSelect } from './cluster/cluster-ui'
import { WalletButton } from '@/components/solana/solana-provider'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="relative z-50 bg-white/5 backdrop-blur-md border-b border-purple-500/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
        {/* Logo + Links */}
        <div className="flex items-center gap-6">
          <Link
            className="text-xl font-bold tracking-wider text-purple-300 hover:text-purple-100 transition"
            href="/"
          >
            <span>{mounted ? 'HexSkull' : 'Demo'}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            {links.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className={`text-sm transition hover:text-purple-400 ${
                  isActive(path) ? 'text-purple-400 font-semibold' : 'text-gray-300'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <WalletButton />
          <ClusterUiSelect />
          <ThemeSelect />
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-purple-300 hover:text-purple-100"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden fixed inset-x-0 top-[56px] bg-[#1a1830]/95 backdrop-blur-lg border-t border-purple-700/20 px-4 py-6">
          <ul className="flex flex-col gap-4">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  href={path}
                  onClick={() => setShowMenu(false)}
                  className={`block text-md py-2 transition hover:text-purple-400 ${
                    isActive(path) ? 'text-purple-400 font-semibold' : 'text-gray-300'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-4">
            <WalletButton />
            <ClusterUiSelect />
            <ThemeSelect />
          </div>
        </div>
      )}
    </header>
  )
}
