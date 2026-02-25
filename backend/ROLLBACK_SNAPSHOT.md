# Rollback Snapshot — Pré Maternal Profile

**Data/Hora:** 2026-02-25 11:37  
**Hash atual:** `df512f9bf37210ecd45498171929e2d63a608b78`

---

## Como voltar ao estado atual

### Opção 1: Revert (preferencial)

Se houver commits indesejados após este snapshot:

```bash
git revert <commit-indesejado> --no-edit
# ou, para reverter vários:
git revert <commit-mais-recente>..HEAD --no-edit
```

### Opção 2: Reset (apenas em emergência)

**Atenção:** Perde todos os commits após o hash. Use apenas se tiver certeza.

```bash
git reset --hard df512f9bf37210ecd45498171929e2d63a608b78
git push origin master --force  # cuidado: reescreve histórico remoto
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
git checkout snapshot-pre-maternal-profile-20260225-1137
```
