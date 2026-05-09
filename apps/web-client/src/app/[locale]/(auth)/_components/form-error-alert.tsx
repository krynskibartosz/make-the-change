type FormErrorAlertProps = {
  error?: string
}

export function FormErrorAlert({ error }: FormErrorAlertProps) {
  if (!error) return null
  return (
    <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive font-bold border border-destructive/20 animate-in zoom-in-95">
      {error}
    </div>
  )
}
