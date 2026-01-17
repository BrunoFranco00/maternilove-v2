# Bootstrap - Materni_Love V2

**Versão:** 1.0  
**Data:** 2025-01-09  
**Status:** AUTORITATIVO

---

## O QUE É O BOOTSTRAP

Este diretório contém **documentação e scripts de bootstrap** do projeto Materni_Love – V2. Ele serve como:

- **Snapshot autoritativo** do estado atual do projeto
- **Guia completo de setup** para novos desenvolvedores
- **Documentação de deploy** para infraestrutura
- **Checklist de auditoria** para stakeholders

---

## O QUE ELE FAZ

O bootstrap fornece:

1. **Documentação técnica completa** do projeto
2. **Scripts seguros** para setup local
3. **Guias passo a passo** para executar o projeto
4. **Checklist de auditoria** para validação
5. **Exemplos de variáveis de ambiente** seguros

---

## O QUE ELE NÃO FAZ

**CRÍTICO:** O bootstrap **NÃO**:

- ❌ Modifica código funcional existente
- ❌ Cria novos endpoints ou features
- ❌ Altera arquitetura existente
- ❌ Quebra locks existentes
- ❌ Altera configurações de produção
- ❌ Cria infraestrutura nova
- ❌ Move arquivos existentes

---

## QUANDO USAR

Use o bootstrap quando você precisa:

- ✅ **Entender o projeto** pela primeira vez
- ✅ **Configurar ambiente local** para desenvolvimento
- ✅ **Auditar o estado** do projeto
- ✅ **Preparar apresentação** para stakeholders
- ✅ **Onboarding** de novos desenvolvedores
- ✅ **Documentar** o estado atual do projeto

---

## QUANDO NÃO USAR

**NÃO use o bootstrap** para:

- ❌ Modificar código funcional
- ❌ Criar novas features
- ❌ Alterar arquitetura
- ❌ Quebrar locks sem aprovação
- ❌ Deploy em produção (usar guias de deploy oficiais)

---

## AVISO CRÍTICO

**QUALQUER VIOLAÇÃO DESTAS REGRAS DEVE SER REPORTADA AO CHAT 00_MASTER**

Este bootstrap é **AUTORITATIVO** e **DEFENSIVO**. Ele documenta o estado atual do projeto sem permitir alterações funcionais.

Se você identificar:
- Tentativa de modificar código funcional via bootstrap
- Tentativa de quebrar locks via bootstrap
- Uso indevido dos scripts de bootstrap
- Qualquer violação da governança

**REPORTE IMEDIATAMENTE ao chat 00_MASTER.**

---

## GOVERNANÇA

Este bootstrap segue rigorosamente a governança definida em:

**`PROJECT_GOVERNANCE.md`** (raiz do repositório)

**Leia esse documento ANTES de usar este bootstrap.**

---

## ESTRUTURA

```
bootstrap/
├── README.md                  # Este arquivo
├── PROJECT_SNAPSHOT.md        # Snapshot técnico completo do projeto
├── SETUP_LOCAL.md             # Guia passo a passo para setup local
├── DEPLOY_GUIDE.md            # Documentação de deploy (leitura)
├── ENVIRONMENT_GUIDE.md       # Guia de variáveis de ambiente
├── SCRIPTS.md                 # Documentação dos scripts
├── CHECKLIST_AUDIT.md         # Checklist para auditoria
├── backend.env.example        # Exemplo de .env do backend
├── frontend.env.example       # Exemplo de .env do frontend
└── scripts/
    ├── setup.sh               # Script de setup inicial
    ├── check-env.sh           # Script de validação de env
    └── reset-local.sh         # Script de limpeza local
```

---

## COMO COMEÇAR

1. **Leia o `PROJECT_GOVERNANCE.md`** na raiz do repositório
2. **Leia o `PROJECT_SNAPSHOT.md`** para entender o estado atual
3. **Siga o `SETUP_LOCAL.md`** para configurar ambiente local
4. **Use os scripts** conforme documentado em `SCRIPTS.md`

---

## PRÓXIMOS PASSOS

- [ ] Ler `PROJECT_GOVERNANCE.md`
- [ ] Ler `PROJECT_SNAPSHOT.md`
- [ ] Seguir `SETUP_LOCAL.md`
- [ ] Validar com `CHECKLIST_AUDIT.md` (se necessário)

---

**LEMBRE-SE:** Este é um bootstrap **defensivo** e **autoritativo**. Ele documenta, não modifica.
