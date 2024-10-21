SELECT
  `c`.`nome` AS `nome_comunidade`,
  `c`.`descricao` AS `descricao_comunidade`,
CASE
    WHEN `c`.`criador_aluno_id` IS NOT NULL THEN `a`.`nome`
    ELSE `o`.`nome`
  END AS `nome_criador`,
CASE
    WHEN `c`.`criador_aluno_id` IS NOT NULL THEN 'Aluno'
    ELSE 'Orientador'
  END AS `tipo_criador`,
  `c`.`data_criacao` AS `data_criacao`
FROM
  (
    (
      `fatec_tcc_v1`.`comunidade` `c`
      LEFT JOIN `fatec_tcc_v1`.`aluno` `a` ON(`c`.`criador_aluno_id` = `a`.`id`)
    )
    LEFT JOIN `fatec_tcc_v1`.`orientador` `o` ON(`c`.`criador_orientador_id` = `o`.`id`)
  )