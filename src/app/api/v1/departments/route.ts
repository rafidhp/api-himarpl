import { type NextRequest } from "next/server";

import { ipAddress } from "@vercel/functions";
import { db } from "@/server/db";
import { ratelimit } from "@/server/ratelimit";

/**
 * @swagger
 * /api/v1/departments:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get departments by type, year, and optional acronym
 *     description: Returns department data filtered by type (be or dp), period year, and optional acronym
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           example: be
 *         description: Type of department (be = backend, dp = departemen)
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Period year of the department
 *       - in: query
 *         name: acronym
 *         required: false
 *         schema:
 *           type: string
 *           example: kominfo
 *         description: Acronym of the department (optional)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: "clw123abc456"
 *                   name: "Departemen Komunikasi dan Informasi"
 *                   acronym: "KOMINFO"
 *                   image: "https://example.com/image.jpg"
 *                   description: "Mengelola komunikasi internal & eksternal"
 *                   type: "DP"
 *                   periodYear: 2025
 *                   createdAt: "2025-01-01T12:00:00.000Z"
 *                   updatedAt: "2025-05-16T10:00:00.000Z"
 *               timestamp: "2025-05-16T16:40:52.498Z"
 *               code: "SUCCESS"
 *               metadata:
 *                 count: 1
 *       400:
 *         description: Bad request (invalid or missing query)
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid type value"
 *               timestamp: "2025-05-16T16:40:52.498Z"
 *               code: "BAD_REQUEST"
 *               metadata:
 *                 allowedTypes: [be, dp]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 *               timestamp: "2025-05-16T16:40:52.498Z"
 *               code: "INTERNAL_ERROR"
 *               metadata:
 *                 message: "Error message here"
 */

export async function GET(request: NextRequest) {
  try {
    const ip = ipAddress(request) as string;

    const { success, reset } = await ratelimit.limit(ip);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          timestamp: new Date().toISOString(),
          code: "TOO MANY REQUESTS",
          metadata: {
            resetTimestamp: reset,
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
    const type = searchParams.get("type");
    const year = Number(searchParams.get("year"));
    const acronym = searchParams.get("acronym")?.toLocaleLowerCase() ?? "";

    const filters: any = {};

    if (type) {
      const validTypes = ["be", "dp"];

      if (!validTypes.includes(type.toLowerCase())) {
        return new Response(
          JSON.stringify({
            error: "Invalid type value",
            timestamp: new Date().toISOString(),
            code: "BAD_REQUEST",
            metadata: {
              allowedTypes: validTypes,
            },
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      filters.type = type.toUpperCase();
    }

    if (!isNaN(year)) {
      filters.periodYear = year;
    }

    if (acronym) {
      filters.acronym = {
        contains: acronym,
      };
    }

    if (Object.keys(filters).length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Missing query parameters. Provide at least one of: type, year, or acronym",
          timestamp: new Date().toISOString(),
          code: "BAD_REQUEST",
          metadata: {
            example: "api/v1/departments?type=be&year=2025",
          },
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const departments = await db.department.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        acronym: true,
        image: true,
        description: true,
        type: true,
        periodYear: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        acronym: "asc",
      },
    });

    // if (!type || !["be", "dp"].includes(type.toLowerCase()) || isNaN(year)) {
    //   return new Response(
    //     JSON.stringify({
    //       error: "Invalid or missing query parameters",
    //       timestamp: new Date().toISOString(),
    //       code: "BAD_REQUEST",
    //       metadata: {
    //         example: "api/v1/departments?type=be&year=2025",
    //       },
    //     }),
    //     {
    //       status: 400,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }

    // const departments = await db.department.findMany({
    //   where: {
    //     type: type.toUpperCase(),
    //     periodYear: year,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     acronym: true,
    //     image: true,
    //     description: true,
    //     type: true,
    //     periodYear: true,
    //     createdAt: true,
    //     updatedAt: true,
    //   },
    //   orderBy: {
    //     acronym: "asc",
    //   },
    // });

    return new Response(
      JSON.stringify({
        data: departments,
        timestamp: new Date().toISOString(),
        code: "SUCCESS",
        metadata: {
          count: departments.length,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching departments", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        timestamp: new Date().toISOString(),
        code: "INTERNAL_ERROR",
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
