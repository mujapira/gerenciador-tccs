export function calcularIdade(dataNasc: string | null | undefined) {
  if (!dataNasc) {
    return 0
  }
  var dataAtual = new Date()
  var anoAtual = dataAtual.getFullYear()
  var mesAtual = dataAtual.getMonth() + 1
  var diaAtual = dataAtual.getDate()

  var dataNascimento = new Date(dataNasc)
  var anoNasc = dataNascimento.getFullYear()
  var mesNasc = dataNascimento.getMonth() + 1
  var diaNasc = dataNascimento.getDate()

  var idade = anoAtual - anoNasc

  if (mesAtual < mesNasc || (mesAtual == mesNasc && diaAtual < diaNasc)) {
    idade--
  }

  return idade
}
