```bash
npm install
npm run dev
```

## Классы

| Класс | Поля | Методы |
| --- | --- | --- |
| `User` | `id`, `name` | Конструктор задаёт ID и имя участника |
| `Message` | `id`, `author`, `sentAt`, `text`, `editedAt` | `getText()`, `getEditedAt()`, `edit(text)`. Внутренний `validateText(text)` убирает пробелы по краям и отклоняет пустой текст |
| `ChatRoom` | `name`, `members`, `messages` | `join(user)`, `getMembers()`, `sendMessage(userId, text)`, `getMessages()`, `editMessage(userId, messageId, text)`, `searchMessages(query)` |

