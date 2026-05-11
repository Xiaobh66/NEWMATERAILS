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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="text-xl font-bold text-primary-700 dark:text-primary-400">
            NEWMATERIALS
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4 text-sm">
              <Link href="/latest" className="hover:text-primary-600">日报</Link>
              <Link href="/companies" className="hover:text-primary-600">企业</Link>
              <Link href="/policy" className="hover:text-primary-600">政策</Link>
            </nav>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-primary-600">
              管理
            </Link>
            <ThemeToggle />
            <SearchBar onSearch={onSearch} />
            <button
              className="md:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-3 pb-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
            <Link href="/latest" className="hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>日报</Link>
            <Link href="/companies" className="hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>企业</Link>
            <Link href="/policy" className="hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>政策</Link>
            <Link href="/admin" className="hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>管理</Link>
          </nav>
        )}
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
      </div>
    </header>
  )
}
