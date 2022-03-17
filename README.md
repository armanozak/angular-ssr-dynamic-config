# Angular SSR with Dynamic Config

## Installation

1. Clone the repo.
2. Open terminal in root folder.
3. Install dependencies by running `npm ci`.

## CSR Development Mode

1. Run `npm start`.
2. Visit [http://localhost:4200](http://localhost:4200).

"ACME" is retrieved from static config file in assets.

## SSR Development Mode

1. Run `npm run dev:ssr`.
2. Visit [http://localhost:4000](http://localhost:4000).

"Romaguera-Crona" is retrieved from [this remote endpoint](https://jsonplaceholder.typicode.com/users/1) at Node process start and is available for CSR as a static asset afterwards.

## SSR Production Mode (with a development server)

1. Run `npm run build:ssr`.
2. When finished, run `npm run serve:ssr`.
3. Visit [http://localhost:8000](http://localhost:8000).

"Romaguera-Crona" is retrieved from [this remote endpoint](https://jsonplaceholder.typicode.com/users/1) at Node process start and is available for CSR as a static asset afterwards.

> **Important Note:** Prerendering is work in progress.
