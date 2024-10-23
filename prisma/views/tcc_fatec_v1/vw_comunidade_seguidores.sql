SELECT
  `c`.`nome` AS `nome_comunidade`,
CASE
    WHEN `cs`.`seguidor_aluno_id` IS NOT NULL THEN `a`.`nome`
    ELSE `o`.`nome`
  END AS `nome_seguidor`,
CASE
    WHEN `cs`.`seguidor_aluno_id` IS NOT NULL THEN 'Aluno'
    ELSE 'Orientador'
  END AS `tipo_seguidor`,
  `cs`.`data_seguimento` AS `data_seguimento`
FROM
  (
    (
      (
        `tcc_fatec_v1`.`comunidade_seguidor` `cs`
        JOIN `tcc_fatec_v1`.`comunidade` `c` ON(`cs`.`comunidade_id` = `c`.`id`)
      )
      LEFT JOIN `tcc_fatec_v1`.`aluno` `a` ON(`cs`.`seguidor_aluno_id` = `a`.`id`)
    )
    LEFT JOIN `tcc_fatec_v1`.`orientador` `o` ON(`cs`.`seguidor_orientador_id` = `o`.`id`)
  )