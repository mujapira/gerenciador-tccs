SELECT
  `tcc_fatec_v1`.`tcc`.`id` AS `tcc_id`,
  `tcc_fatec_v1`.`tcc`.`titulo` AS `titulo_tcc`,
  `rp`.`data_entrega` AS `data_entrega`,
  `rp`.`descricao` AS `descricao_relatorio`,
  `ra`.`nome_arquivo` AS `nome_arquivo`,
  `ra`.`caminho_arquivo` AS `caminho_arquivo`,
  `ra`.`formato_documento` AS `formato_documento`,
  `ra`.`tamanho_arquivo` AS `tamanho_arquivo`
FROM
  (
    (
      `tcc_fatec_v1`.`tcc`
      JOIN `tcc_fatec_v1`.`tcc_relatorio_progresso` `rp` ON(`tcc_fatec_v1`.`tcc`.`id` = `rp`.`tcc_id`)
    )
    LEFT JOIN `tcc_fatec_v1`.`tcc_relatorio_progresso_arquivo` `ra` ON(`rp`.`id` = `ra`.`relatorio_id`)
  )