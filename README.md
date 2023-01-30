This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Nutrition Data

I built this project to learn more about React and Next.js and to get nutritional information about many foods from place.

Nutrition Data retrieves nutritional information about many foods from the USDA food database. These foods include fresh produce, meats, fish, dairy, and packaged foods.

## What I Learned

React app structure with Next.js.
How to make axios queries to an api using React Query.
Material UI theme and how to extend a theme.

I used react query instead of useEffect to make the api call. The useEffect hook runs after rendering the entire user interface. So the api call will start after completing the rendering of the UI. By using react query data can be fetched data and rendered in parallel.

The biggest challenge I faced was figuring out how the USDA food database api worked. The documentation is poor. This link https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1#/FDC/getFood is the documentation. There isn't a table that describes which number corresponds to which nutrient name in the GET /v/food/{fdcId} call. I typed in numbers in ascending order and then watched the response to get what nutrient name corresponded with which number.

Here is the link to signup for an api key:
https://fdc.nal.usda.gov/api-key-signup.html

Here is a live version:
https://nutrition-data.vercel.app/
