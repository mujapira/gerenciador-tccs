SELECT
  `o`.`nome` AS `nome_orientador`,
  `tcc_fatec_v1`.`tcc`.`titulo` AS `titulo_tcc`,
  `a`.`nome` AS `nome_aluno`,
  `t`.`nome` AS `nome_turma`
FROM
  (
    (
      (
        (
          `tcc_fatec_v1`.`tcc`
          JOIN `tcc_fatec_v1`.`tcc_metadata` `tm` ON(`tcc_fatec_v1`.`tcc`.`metadata_id` = `tm`.`id`)
        )
        JOIN `tcc_fatec_v1`.`aluno` `a` ON(`tm`.`aluno_id` = `a`.`id`)
      )
      JOIN `tcc_fatec_v1`.`orientador` `o` ON(`tm`.`orientador_id` = `o`.`id`)
    )
    JOIN `tcc_fatec_v1`.`turma` `t` ON(`tm`.`turma_id` = `t`.`id`)
  )