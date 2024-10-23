SELECT
  `pc`.`palavra` AS `palavra_chave`,
  `tcc_fatec_v1`.`tcc`.`titulo` AS `titulo_tcc`,
  `a`.`nome` AS `nome_aluno`
FROM
  (
    (
      (
        (
          `tcc_fatec_v1`.`tcc_palavra_chave_associacao` `tpc`
          JOIN `tcc_fatec_v1`.`tcc` ON(`tpc`.`tcc_id` = `tcc_fatec_v1`.`tcc`.`id`)
        )
        JOIN `tcc_fatec_v1`.`tcc_palavra_chave` `pc` ON(`tpc`.`palavra_id` = `pc`.`id`)
      )
      JOIN `tcc_fatec_v1`.`tcc_metadata` `tm` ON(`tcc_fatec_v1`.`tcc`.`metadata_id` = `tm`.`id`)
    )
    JOIN `tcc_fatec_v1`.`aluno` `a` ON(`tm`.`aluno_id` = `a`.`id`)
  )