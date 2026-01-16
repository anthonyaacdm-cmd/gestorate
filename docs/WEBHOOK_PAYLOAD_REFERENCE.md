
# Referência do Payload do Webhook

Esta referência detalha a estrutura JSON enviada pelo Sistema de Agendamentos para o n8n. Todos os campos são enviados no corpo (body) da requisição POST.

## Estrutura Raiz

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
| :--- | :--- | :--- | :--- | :--- |
| `appointment_id` | UUID | Sim | Identificador único do agendamento no banco de dados. | `a0eebc99-9c0b...` |
| `date` | String | Sim | Data do agendamento (YYYY-MM-DD). | `2024-12-25` |
| `time` | String | Sim | Hora do agendamento (HH:MM:SS). | `14:30:00` |
| `service` | String | Não | Nome do serviço ou tipo de exame. | `Consulta Geral` |
| `notes` | String | Não | Observações adicionais do agendamento. | `Paciente alérgico.` |
| `status` | String | Sim | Status atual (`pending`, `confirmed`, `canceled`). | `pending` |
| `timestamp` | ISO Date | Sim | Data/hora do disparo do evento. | `2024-10-01T10:00:00Z` |

## Objeto `client`
Contém informações sobre a pessoa que será atendida.

| Campo | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | String | ID do usuário no banco ou "guest" se for convidado. | `uuid` ou `guest` |
| `name` | String | Nome completo do cliente. | `Maria Silva` |
| `email` | String | Email de contato. Pode ser nulo. | `maria@email.com` |
| `phone` | String | Telefone de contato. | `5511999999999` |

## Objeto `admin`
Contém informações sobre o profissional responsável pelo atendimento.

| Campo | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | UUID | ID do profissional no banco. Nulo se não atribuído. | `uuid` |
| `name` | String | Nome do profissional. | `Dr. João` |
| `email` | String | Email do profissional. | `joao@clinica.com` |
| `phone` | String | Telefone do profissional. | `5511988888888` |

## Objeto `meta`
Metadados técnicos sobre a origem da requisição.

| Campo | Tipo | Descrição | Valores Possíveis |
| :--- | :--- | :--- | :--- |
| `source` | String | Origem do disparo. | `web-app` |
| `type` | String | Tipo de agendamento. | `user_booking`, `guest_booking` |

## Exemplo de JSON Completo

