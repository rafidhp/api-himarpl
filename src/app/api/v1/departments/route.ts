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
 *           enum: [be, dp]
 *         description: Type of department (be = Badan Eksekutif, dp = Dewan Perwakilan)
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
 *         $ref: '#/components/responses/DepartmentsResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
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
    const page = Math.max(1, Number(searchParams.get("page")) ?? 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") ?? 10))
    );
    const skip = (page - 1) * limit;

    const rawType = searchParams.get("type");
    const type = rawType ? rawType.toLowerCase() : undefined;
    const yearParam = searchParams.get("year");
    const year = yearParam ? Number(yearParam) : undefined;
    const acronym = searchParams.get("acronym")?.toLowerCase() ?? "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};

    if (type) {
      const validTypes = ["be", "dp"];

      if (!validTypes.includes(type)) {
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

    if (year !== undefined && !isNaN(year)) {
      filters.periodYear = year;
    }

    if (acronym) {
      filters.acronym = {
        contains: acronym,
      };
    }

    const [departments, total] = await Promise.all([
      db.department.findMany({
        where: filters,
        select: {
          id: true,
          name: true,
          acronym: true,
          image: true,
          description: true,
          type: true,
          periodYear: true,
          period: {
            select: {
              id: true,
              year: true,
              name: true,
            },
          },
          programs: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: {
          acronym: "asc",
        },
        skip,
        take: limit,
      }),
      db.department.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return new Response(
      JSON.stringify({
        data: departments,
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
