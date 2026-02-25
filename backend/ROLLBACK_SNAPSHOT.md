# Rollback Snapshot — Pré Maternal Profile Domain

**Data/Hora:** 2026-02-25 11:42  
**Hash atual:** `2bec28adf50737abdf9476bbaba1895f6206b1fd`

---

## Como voltar ao estado atual (antes do maternal profile)

### Opção 1: Revert (preferencial)

Se houver commits indesejados após este snapshot:

```bash
git revert <commit-indesejado> --no-edit
# ou, para reverter vários:
git revert <commit-mais-recente>..HEAD --no-edit
```

### Opção 2: Reset (apenas em emergência)

**Atenção:** Perde todos os commits após o hash. Use apenas se tiver certeza. Prefira `--force-with-lease` a `--force` para evitar sobrescrever trabalho remoto não puxado.

```bash
git reset --hard 2bec28adf50737abdf9476bbaba1895f6206b1fd
git push origin master --force-with-lease  # somente se necessário
```

---

## Re-deploy

Após rollback ou correção:

```bash
git push origin master
```

---

## Tag de referência

```bash
git checkout snapshot-pre-maternal-profile-20260225-1142
```
