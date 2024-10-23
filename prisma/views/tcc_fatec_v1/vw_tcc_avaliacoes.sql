SELECT
  `tcc_fatec_v1`.`tcc`.`id` AS `tcc_id`,
  `tcc_fatec_v1`.`tcc`.`titulo` AS `titulo_tcc`,
  `a`.`nome` AS `nome_orientador`,
  `av`.`data_avaliacao` AS `data_avaliacao`,
  `av`.`descricao` AS `descricao_avaliacao`,
  `av`.`nota` AS `nota_avaliacao`
FROM
  (
    (
      `tcc_fatec_v1`.`tcc`
      JOIN `tcc_fatec_v1`.`tcc_avaliacao` `av` ON(`tcc_fatec_v1`.`tcc`.`id` = `av`.`tcc_id`)
    )
    JOIN `tcc_fatec_v1`.`orientador` `a` ON(`av`.`orientador_id` = `a`.`id`)
  )