"use client";

import { useEffect, useState } from "react";

import { tccTableColumns } from "./tcc-col-defs";
import { showErrorToast } from "@/app/utils/toast-utils";


import { TccDataTable } from "./tcc-data-table"
import { ITcc } from "@/app/models/mongoModels";
import { getAllTccs } from "@/app/server-actions/mongoActions";


export function TccTable({
  onSelect,
  selected,
}: {
  onSelect: (data: ITcc) => void;
  selected: string | null;
}) {
  const [tccs, setTccs] = useState<ITcc[]>([]);

  const handleGetTccs = async () => {
    try {
      const response = await getAllTccs();
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
