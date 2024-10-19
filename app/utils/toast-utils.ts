import { toast } from "@/hooks/use-toast"

export function showErrorToast(
  error: unknown,
  defaultMessage = "Ocorreu um erro inesperado."
) {
  const description = error instanceof Error ? error.message : defaultMessage
  toast({
    title: "Erro ao realizar a operação",
    description,
    variant: "destructive",
  })
}

export function showSuccessToast(title: string, description: string) {
  toast({
    title,
    description,
    variant: "default",
  })
}
