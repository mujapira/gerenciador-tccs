import { Decimal } from "@prisma/client/runtime/library";

export interface ITccAvaliation {
  id: number;
  tcc_id: number | null;
  orientador_id: number | null;
  data_avaliacao: Date;
  descricao: string;
  nota: Decimal | null;
  numero_avaliacao: number | null;
}
