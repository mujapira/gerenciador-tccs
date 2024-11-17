export function formatCPF(value: string | null | undefined) {
  if (!value) return ""
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    .slice(0, 14)
}

export function formatPhoneNumber(value: string) {
  if (!value) return ""
  const rawValue = value.replace(/\D/g, "") // Remove caracteres não numéricos

  // Limita a 11 dígitos antes de formatar
  const limitedValue = rawValue.slice(0, 11)

  const match = limitedValue.match(/^(\d{2})(\d{5})(\d{4})$/) // Valida o padrão
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }

  return limitedValue // Retorna o valor bruto se não atender ao padrão
}
