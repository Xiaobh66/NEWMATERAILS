'use client'

import { useState } from 'react'
import Link from 'next/link'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  onSearch: (term: string) => void
}

export default function Header({ activeCategory, onCategoryChange, onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              NEWMATERIALS
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex gap-1">
              {[
                { href: '/latest', label: '日报' },
                { href: '/companies', label: '企业' },
                { href: '/policy', label: '政策' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              管理
            </Link>

            <ThemeToggle />
            <SearchBar onSearch={onSearch} />

            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-1 pb-4 text-sm border-t border-gray-100 dark:border-gray-800 pt-3">
            {[
              { href: '/latest', label: '日报' },
              { href: '/companies', label: '企业' },
              { href: '/policy', label: '政策' },
              { href: '/admin', label: '管理' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* 分类筛选 */}
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
      </div>
    </header>
  )
}
