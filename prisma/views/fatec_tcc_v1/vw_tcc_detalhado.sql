SELECT
  `fatec_tcc_v1`.`tcc`.`id` AS `tcc_id`,
  `fatec_tcc_v1`.`tcc`.`titulo` AS `titulo_tcc`,
  `a`.`id` AS `aluno_id`,
  `a`.`nome` AS `nome_aluno`,
  `a`.`data_ingresso` AS `data_ingresso_aluno`,
  `o`.`id` AS `orientador_id`,
  `o`.`nome` AS `nome_orientador`,
  `fatec_tcc_v1`.`turma`.`id` AS `turma_id`,
  `fatec_tcc_v1`.`turma`.`nome` AS `nome_turma`,
  `tema`.`id` AS `tema_id`,
  `tema`.`descricao` AS `tema`,
  `classif`.`id` AS `classificacao_id`,
  `classif`.`descricao` AS `classificacao`,
  coalesce(`nf`.`nota_final`, 'N/A') AS `nota_final`,
  `es`.`id` AS `estado_id`,
  `es`.`descricao` AS `estado_atual`,
  count(DISTINCT `av`.`id`) AS `numero_avaliacoes`,
  max(`av`.`data_avaliacao`) AS `data_ultima_avaliacao`,
  GROUP_CONCAT(`pc`.`palavra` SEPARATOR ', ') AS `palavras_chave`,
  GROUP_CONCAT(`pc`.`id` SEPARATOR ', ') AS `palavras_chave_ids`
FROM
  (
    (
      (
        (
          (
            (
              (
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
                  JOIN `fatec_tcc_v1`.`turma` ON(`tm`.`turma_id` = `fatec_tcc_v1`.`turma`.`id`)
                )
                JOIN `fatec_tcc_v1`.`tcc_tema` `tema` ON(`tm`.`tema_id` = `tema`.`id`)
              )
              JOIN `fatec_tcc_v1`.`tcc_classificacao` `classif` ON(`tm`.`classificacao_id` = `classif`.`id`)
            )
            LEFT JOIN `fatec_tcc_v1`.`tcc_palavra_chave_associacao` `tpc` ON(`fatec_tcc_v1`.`tcc`.`id` = `tpc`.`tcc_id`)
          )
          LEFT JOIN `fatec_tcc_v1`.`tcc_palavra_chave` `pc` ON(`tpc`.`palavra_id` = `pc`.`id`)
        )
        LEFT JOIN `fatec_tcc_v1`.`tcc_nota_final` `nf` ON(`fatec_tcc_v1`.`tcc`.`id` = `nf`.`tcc_id`)
      )
      LEFT JOIN `fatec_tcc_v1`.`tcc_estado` `es` ON(`fatec_tcc_v1`.`tcc`.`status` = `es`.`id`)
    )
    LEFT JOIN `fatec_tcc_v1`.`tcc_avaliacao` `av` ON(`av`.`tcc_id` = `fatec_tcc_v1`.`tcc`.`id`)
  )
GROUP BY
  `fatec_tcc_v1`.`tcc`.`id`,
  `a`.`id`,
  `a`.`nome`,
  `a`.`data_ingresso`,
  `o`.`id`,
  `o`.`nome`,
  `fatec_tcc_v1`.`turma`.`id`,
  `fatec_tcc_v1`.`turma`.`nome`,
  `tema`.`id`,
  `tema`.`descricao`,
  `classif`.`id`,
  `classif`.`descricao`,
  `es`.`id`,
  `es`.`descricao`,
  `nf`.`nota_final`