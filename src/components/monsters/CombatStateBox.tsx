type CombatstatBoxProps = {
  label: string
  stat: string
}

export function CombatStateBox({ label, stat }: CombatstatBoxProps) {
  return (
    <div className="border bg-card p-1">
      <div className="text-lg font-medium text-muted-foreground">{label}</div>
      <div className="text-xl font-bold text-foreground">{stat}</div>
    </div>
  )
}
