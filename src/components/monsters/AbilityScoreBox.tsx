import { formatAbilityScore } from '~/utils/monsterHelpers'

interface AbilityScoreCardProps {
  label: string
  score: number
}

export function AbilityScoreBox({ label, score }: AbilityScoreCardProps) {
  const formattedScore = formatAbilityScore(score)

  // Determine color based on score value
  const getScoreColor = (value: number) => {
    if (value > 0) return 'text-foreground'
    if (value < 0) return 'text-destructive'
    return 'text-muted-foreground'
  }

  return (
    <div className="border bg-card pl-2 text-start">
      <div className="text-lg font-medium uppercase tracking-wide text-muted-foreground">
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
