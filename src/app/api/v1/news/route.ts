import { type NextRequest } from "next/server";

import { ipAddress } from "@vercel/functions";
import { db } from "@/server/db";
import { ratelimit } from "@/server/ratelimit";

/**
 * @swagger
 * /api/v1/news:
 *   get:
 *     tags:
 *       - News
 *     summary: Get news posts with 'berita' tag
 *     description: Returns paginated news posts with 'berita' tag and supports sorting and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 1
 *         description: Number of items per page
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter news by title
 *     responses:
 *       200:
 *         $ref: '#/components/responses/NewsResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

export async function GET(request: NextRequest) {
  try {
    const ip = ipAddress(request) as string;

    const success = await ratelimit.limit(ip);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          timestamp: new Date().toISOString(),
          code: "TOO_MANY_REQUESTS",
          metadata: {
            message: "Too many requests",
          },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = Math.max(1, Number(searchParams.get("page")) ?? 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit")) ?? 10)
    );
    const order = (searchParams.get("order") as "asc" | "desc") ?? "desc";
    const search = searchParams.get("search") ?? "";

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where: {
          PostToPostTag: {
            some: {
              post_tags: {
                title: "berita",
              },
            },
          },
          title: {
            contains: search,
          },
          publishedAt: {
            not: null,
          },
        },
        select: {
          id: true,
          title: true,
          metaTitle: true,
          slug: true,
          content: true,
          image: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          PostToPostTag: {
            select: {
              post_tags: {
                select: {
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: {
          publishedAt: order,
        },
        skip,
        take: limit,
      }),
      db.post.count({
        where: {
          PostToPostTag: {
            some: {
              post_tags: {
                title: "berita",
              },
            },
          },
          title: {
            contains: search,
          },
          publishedAt: {
            not: null,
          },
        },
      }),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Mapped the PostToPostTag to postTags
    const mappedPosts = posts.map((post) => {
      const postTags = post.PostToPostTag.map((postTag) => postTag.post_tags);

      // @ts-expect-error - delete PostToPostTag
      delete post.PostToPostTag;
      return {
        ...post,
        postTags,
      };
    });

    return new Response(
      JSON.stringify({
        data: mappedPosts,
        timestamp: new Date().toISOString(),
        code: "SUCCESS",
        metadata: {
          total,
          page,
          limit,
          totalPages,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching news:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        timestamp: new Date().toISOString(),
        code: "INTERNAL_SERVER_ERROR",
        metadata: {
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
