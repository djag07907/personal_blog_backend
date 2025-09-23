/**
 * Custom article routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/articles/most-popular',
      handler: 'api::article.article.mostPopular',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};