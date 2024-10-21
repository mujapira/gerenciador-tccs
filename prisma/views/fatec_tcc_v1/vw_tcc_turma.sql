SELECT
  `t`.`nome` AS `nome_turma`,
  `fatec_tcc_v1`.`tcc`.`titulo` AS `titulo_tcc`,
  `a`.`nome` AS `nome_aluno`,
  `o`.`nome` AS `nome_orientador`
FROM
  (
    (
      (
        (
          `fatec_tcc_v1`.`tcc`
          JOIN `fatec_tcc_v1`.`tcc_metadata` `tm` ON(`fatec_tcc_v1`.`tcc`.`metadata_id` = `tm`.`id`)
        )
        JOIN `fatec_tcc_v1`.`aluno` `a` ON(`tm`.`aluno_id` = `a`.`id`)
      )
      JOIN `fatec_tcc_v1`.`orientador` `o` ON(`tm`.`orientador_id` = `o`.`id`)
    )
    JOIN `fatec_tcc_v1`.`turma` `t` ON(`tm`.`turma_id` = `t`.`id`)
  )