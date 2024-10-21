SELECT
  `pc`.`palavra` AS `palavra_chave`,
  `fatec_tcc_v1`.`tcc`.`titulo` AS `titulo_tcc`,
  `a`.`nome` AS `nome_aluno`
FROM
  (
    (
      (
        (
          `fatec_tcc_v1`.`tcc_palavra_chave_associacao` `tpc`
          JOIN `fatec_tcc_v1`.`tcc` ON(`tpc`.`tcc_id` = `fatec_tcc_v1`.`tcc`.`id`)
        )
        JOIN `fatec_tcc_v1`.`tcc_palavra_chave` `pc` ON(`tpc`.`palavra_id` = `pc`.`id`)
      )
      JOIN `fatec_tcc_v1`.`tcc_metadata` `tm` ON(`fatec_tcc_v1`.`tcc`.`metadata_id` = `tm`.`id`)
    )
    JOIN `fatec_tcc_v1`.`aluno` `a` ON(`tm`.`aluno_id` = `a`.`id`)
  )