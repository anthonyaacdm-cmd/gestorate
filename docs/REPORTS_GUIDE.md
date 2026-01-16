
# Guia de Relatórios do Sistema

Este documento descreve como utilizar o módulo de relatórios para extrair dados importantes do sistema.

## 1. Acessando os Relatórios

Para acessar os relatórios:
1. Faça login com uma conta de **Administrador**.
2. No menu principal, clique em **Relatórios** (ícone de gráfico).

## 2. Tipos de Relatórios

Atualmente, o sistema oferece três tipos principais de relatórios:

### Agendamentos
Lista detalhada de todas as consultas e exames agendados.
- **Colunas:** Data, Hora, Cliente, Serviço, Profissional, Status, Telefone.
- **Utilidade:** Verificar agenda diária, histórico de atendimentos, auditar cancelamentos.

### Clientes
Visão agregada por cliente.
- **Colunas:** Nome, Contato, Total de Agendamentos, Confirmados, Data da Última Visita.
- **Utilidade:** Identificar clientes frequentes, recuperar contatos inativos.

### Resumo (Volume)
Estatísticas de volume por profissional.
- **Colunas:** Profissional, Total de Agendamentos, Confirmados, Cancelados.
- **Utilidade:** Avaliar desempenho da equipe, carga de trabalho.

## 3. Utilizando Filtros

Use a barra lateral esquerda para filtrar os dados antes de visualizar ou exportar:

- **Período:** Selecione data inicial e final.
- **Status:** Filtre por agendamentos Confirmados, Pendentes ou Cancelados (afeta principalmente o relatório de Agendamentos).
- **Profissional:** Veja dados específicos de um médico ou atendente.

Clique em **Aplicar Filtros** para atualizar a visualização.

## 4. Exportação de Dados

Você pode exportar os relatórios em três formatos:

### PDF (Portable Document Format)
- **Melhor para:** Impressão, compartilhamento formal, envio por e-mail.
- **Layout:** Formatado com cabeçalho da empresa, cores e numeração de páginas.

### Excel (.xlsx)
- **Melhor para:** Análise profunda, criação de gráficos personalizados, cálculos financeiros.
- **Layout:** Dados estruturados em colunas com cabeçalhos formatados.

### CSV (Comma Separated Values)
- **Melhor para:** Importação em outros sistemas (CRM, ERP), backup simples de dados.
- **Layout:** Texto simples separado por vírgulas.

## 5. Solução de Problemas

**O relatório está vazio?**
- Verifique se o período selecionado contém dados.
- Tente limpar os filtros de Status ou Profissional.

**O PDF não baixa?**
- Verifique se o bloqueador de pop-ups do navegador não está impedindo o download.

**Caracteres estranhos no Excel/CSV?**
- O sistema usa codificação UTF-8 para suportar acentos. O Excel geralmente reconhece isso automaticamente, mas em versões antigas pode ser necessário usar a opção "Importar Texto".

## 6. Privacidade de Dados

Lembre-se que os relatórios contêm dados sensíveis dos pacientes (nomes, telefones, e-mails).
- Apenas exporte dados quando necessário.
- Não compartilhe arquivos exportados em canais não seguros.
- Exclua arquivos baixados após o uso se estiver em um computador compartilhado.
