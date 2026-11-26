# Arquivos só da versão de teste (link do Claude)

O link de teste roda isolado dentro do claude.ai e não pode falar com servidores de fora
(o login do Base44 foi bloqueado). Por isso, nele a "conta" é a conta Claude de quem abre:
cada pessoa tem o progresso salvo na área privada `data/users/<id>/progresso` do banco do
link (capacidades `db` e `user`). Quem abre sem conta pode usar só no aparelho.

Login com e-mail e senha: app do Base44 (https://fenix-ingles-c5968695.base44.app) e,
depois da atualização, o app oficial no Lovable (`src/lib/accounts.ts`, Supabase).
