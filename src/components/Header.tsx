'use client'

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
          </div>
        </div>
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
      </div>
    </header>
  )
}
