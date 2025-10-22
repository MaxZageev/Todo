# Пример микрофронт-модуля на Webpack Module Federation

Этот репозиторий содержит готовый пример микрофронт-модуля с использованием **Webpack Module Federation**

---

## Основные зависимости

- **React**
- **React Router**
- **TanStack Query**
- **MUI (Material UI)**
- **i18next**
- **TypeScript**
- **Webpack**

---

## Быстрый старт

### Запуск dev-сервера

```bash
npm run start
```

Порт можно изменить в файле .env.development

Переменная DEV_API_URL позволяет указать URL мокового сервера, например: [mocks-server](https://www.mocks-server.org/)

### Сборка Docker-образа

```bash
npm run docker-build
```

Обязательно наличие файла .env.docker с переменными:

- **PUBLIC_PATH — публичный путь для сборки(example PUBLIC_PATH=/)**
- **STYLE_NONCE — nonce для inline-стилей(example STYLE_NONCE=r4nd0m12345)**

Запуск Docker-контейнера

```bash
npm run docker-up
```

## Конфигурация

В приложении используется генерация конфигурации в рантайме:

- **Dev: конфиг создается автоматически(если его нет) из AppConfigData при npm run start**

- **Prod: конфиг должен быть предоставлен администраторами сервера и размещен на сервере заранее**

## Стиль коммитов

Коммиты должны писаться согласно [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), что обеспечивает понятную историю изменений и совместимость с автоматизацией релизов
