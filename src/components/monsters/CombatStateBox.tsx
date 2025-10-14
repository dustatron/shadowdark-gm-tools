type CombatstatBoxProps = {
  label: string
  stat: string
}

export function CombatStateBox({ label, stat }: CombatstatBoxProps) {
  return (
    <div className="border-2 border-black bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
      <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
        {label}
      </div>
      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {stat}
      </div>
    </div>
  )
}
