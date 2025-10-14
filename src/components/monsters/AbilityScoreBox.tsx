import { formatAbilityScore } from '~/utils/monsterHelpers'

interface AbilityScoreCardProps {
  label: string
  score: number
}

export function AbilityScoreBox({ label, score }: AbilityScoreCardProps) {
  const formattedScore = formatAbilityScore(score)

  // Determine color based on score value
  const getScoreColor = (value: number) => {
    if (value > 0) return 'text-black dark:text-gray-400'
    if (value < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className="border-2 border-black bg-white pl-2 text-start dark:border-gray-700 dark:bg-gray-900">
      <div className="text-lg font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
        {label}
      </div>
      <div
        className={`text-2xl font-bold ${getScoreColor(score)}`}
        aria-label={`${label} modifier: ${formattedScore}`}
      >
        {formattedScore}
      </div>
    </div>
  )
}
