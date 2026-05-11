'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (term: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(term)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="搜索资讯..."
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600"
      />
      <button
        type="submit"
        className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-r-lg hover:bg-primary-600"
      >
        搜索
      </button>
    </form>
  )
}
