# Nuxt Fetch Transforms

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Automatically generate fetch transforms for your Nuxt application.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/@nasontech/nuxt-fetch-transforms?file=playground%2Fapp.vue)

## Features

Automatically generate fetch transforms for your Nuxt application.

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @nasontech/nuxt-fetch-transforms
```

That's it! You can now use `useFetchTransform` in your Nuxt app ✨

```vue
<script setup>
const { data: user, refresh } = await useFetch('/api/user', { transform: useFetchTransform('/api/user', 'get') })
</script>

<template>
  <div>
    <pre>{{ user }}</pre>
    <div>Typeof user.createdAt: {{ typeof user.createdAt }} {{ user.createdAt.constructor.name }}</div>
    <div>Typeof user.updatedAt: {{ typeof user.updatedAt }} {{ user.updatedAt.constructor.name }}</div>
    <div>
      <button @click="refresh">Refresh</button>
    </div>
  </div>
</template>
```

```typescript
export default defineEventHandler(async (event) => {
  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return user
})
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nasontech/nuxt-fetch-transforms/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@nasontech/nuxt-fetch-transforms
[npm-downloads-src]: https://img.shields.io/npm/dm/@nasontech/nuxt-fetch-transforms.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@nasontech/nuxt-fetch-transforms
[license-src]: https://img.shields.io/npm/l/@nasontech/nuxt-fetch-transforms.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@nasontech/nuxt-fetch-transforms
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
