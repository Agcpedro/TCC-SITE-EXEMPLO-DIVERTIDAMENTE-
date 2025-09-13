
### Cloning the repository

```shell
git clone https://github.com/bouzayenilyes/divertidamente.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
DATABASE_URL="postgresql://..."
STRIPE_API_KEY=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_WEBHOOK_SECRET=""
```

### Setup Drizzle ORM

```shell
npm run db:push

```

### Seed the app

```shell
npm run db:seed

```

or

```shell
npm run db:prod

```

### Start the app

```shell
npm run dev
```
