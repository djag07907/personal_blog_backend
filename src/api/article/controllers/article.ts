/**
 *  article controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params;

      let article;
      let isSlug = false;

      if (isNaN(Number(id))) {
        isSlug = true;
        article = await strapi.db.query("api::article.article").findOne({
          where: { slug: id },
          populate: {
            author: {
              populate: ["avatar"],
            },
            image: true,
            category: true,
          },
        });
      } else {
        article = await strapi.db.query("api::article.article").findOne({
          where: { id: Number(id) },
          populate: {
            author: {
              populate: ["avatar"],
            },
            image: true,
            category: true,
          },
        });
      }

      if (!article) {
        return ctx.notFound();
      }

      const currentViews = article.views || 0;

      await strapi.db.query("api::article.article").update({
        where: { id: article.id },
        data: { views: currentViews + 1 },
      });

      return { data: { ...article, views: currentViews + 1 } };
    },

    async find(ctx) {
      const { query } = ctx;

      if (query.mostPopular === "true") {
        try {
          const limit = parseInt(query.limit as string) || 10;

          const articles = await strapi.db
            .query("api::article.article")
            .findMany({
              where: {
                publishedAt: { $notNull: true }, // Only published articles
              },
              populate: {
                author: {
                  populate: ["avatar"],
                },
                image: true,
                category: true,
              },
              orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
              limit,
            });

          console.log(
            "Most popular articles fetched:",
            articles.map((a) => `${a.title}: ${a.views} views`)
          );
          return { data: articles };
        } catch (error) {
          console.error("Error in mostPopular query:", error);
          ctx.throw(500, "Failed to fetch most popular articles");
        }
      }

      return super.find(ctx);
    },

    async mostPopular(ctx) {
      try {
        const { limit = "10" } = ctx.query;

        const articles = await strapi.db
          .query("api::article.article")
          .findMany({
            where: {
              publishedAt: { $notNull: true },
            },
            populate: {
              author: {
                populate: ["avatar"],
              },
              image: true,
              category: true,
            },
            orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
            limit: parseInt(limit as string),
          });

        return { data: articles };
      } catch (error) {
        ctx.throw(500, "Failed to fetch most popular articles");
      }
    },
  })
);
