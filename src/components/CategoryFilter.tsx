'use client'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { key: 'all', label: '全部' },
  { key: 'daily', label: '日报' },
  { key: 'company', label: '企业' },
  { key: 'policy', label: '政策' },
]

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeCategory === cat.key
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
