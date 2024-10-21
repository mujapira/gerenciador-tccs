SELECT
  `fatec_tcc_v1`.`tcc`.`id` AS `tcc_id`,
  `fatec_tcc_v1`.`tcc`.`titulo` AS `titulo_tcc`,
  `a`.`nome` AS `nome_orientador`,
  `av`.`data_avaliacao` AS `data_avaliacao`,
  `av`.`descricao` AS `descricao_avaliacao`,
  `av`.`nota` AS `nota_avaliacao`
FROM
  (
    (
      `fatec_tcc_v1`.`tcc`
      JOIN `fatec_tcc_v1`.`tcc_avaliacao` `av` ON(`fatec_tcc_v1`.`tcc`.`id` = `av`.`tcc_id`)
    )
    JOIN `fatec_tcc_v1`.`orientador` `a` ON(`av`.`orientador_id` = `a`.`id`)
  )