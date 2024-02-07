This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Environment Variable

### Server Side env variables

- **API_CHAPTER_RANDOM_MIN_COUNT** : Return the min count chapters info, default is 3 in the code
- **API_CHAPTER_RANDOM_MAX_COUNT** : Setup the max count chapters info,default is 10 in the code
- **API_CHAPTER_UP_WITH_SELF_DEPTH** : Gets the section from itself and up to the specified depth, default is 3 in the code
- **API_CHAPTER_RELATIONSHIP_MAX_LIMIT** : Return limite count chapters mode info,  default is 10000
- **API_DEFAULT_WALLET_ADDRESS** ：Setup the default wallet address

## Cron Job

### Extend Cron Jobs
1. Wrap your task into a GET function and default export it if necessary.
2. Register your cron job in the ``` /vercel.json ``` 
    - make sure the ```path``` field points to the file where contains the cron job
    - ```schedule``` specifies cron job expression, that specifies the period of the cron job

Note: 
  - [Learn more about Vercel Cron Job](https://vercel.com/docs/cron-jobs)
  - [Learn more about Cron Job Expressions](https://cron-template.vercel.app/)
