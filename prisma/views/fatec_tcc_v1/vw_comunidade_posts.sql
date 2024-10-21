SELECT
  `c`.`nome` AS `nome_comunidade`,
  `cp`.`conteudo` AS `conteudo_post`,
CASE
    WHEN `cp`.`autor_aluno_id` IS NOT NULL THEN `a`.`nome`
    ELSE `o`.`nome`
  END AS `nome_autor`,
CASE
    WHEN `cp`.`autor_aluno_id` IS NOT NULL THEN 'Aluno'
    ELSE 'Orientador'
  END AS `tipo_autor`,
  `cp`.`data_postagem` AS `data_postagem`
FROM
  (
    (
      (
        `fatec_tcc_v1`.`comunidade_post` `cp`
        JOIN `fatec_tcc_v1`.`comunidade` `c` ON(`cp`.`comunidade_id` = `c`.`id`)
      )
      LEFT JOIN `fatec_tcc_v1`.`aluno` `a` ON(`cp`.`autor_aluno_id` = `a`.`id`)
    )
    LEFT JOIN `fatec_tcc_v1`.`orientador` `o` ON(`cp`.`autor_orientador_id` = `o`.`id`)
  )