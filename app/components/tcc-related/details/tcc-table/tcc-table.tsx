"use client";

import { useEffect, useState } from "react";

import { tccTableColumns } from "./tcc-col-defs";
import { showErrorToast } from "@/app/utils/toast-utils";

import { ITccDetalhado } from "@/app/models/tcc/tccModel"
import { TccDataTable } from "./tcc-data-table"
import { GetTccsDetails } from "@/app/server-actions/tcc/getTccsDetails"

export function TccTable({
  onSelect,
  selected,
}: {
  onSelect: (data: ITccDetalhado) => void;
  selected: number | null;
}) {
  const [tccs, setTccs] = useState<ITccDetalhado[]>([]);

  const handleGetTccs = async () => {
    try {
      const response = await GetTccsDetails();

      if (response) {
        setTccs(response as any);
      }
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    handleGetTccs();
  }, []);

  return (
    <TccDataTable
      selected={selected}
      columns={tccTableColumns}
      data={tccs}
      onRowClick={(row) => onSelect(row)}
    />
  );
}
