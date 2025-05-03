/**
 * @swagger
 * /api/v1/greetings:
 *   get:
 *     tags:
 *       - Greetings
 *     summary: Get a greeting message
 *     description: Returns a friendly greeting message to the user
 *     operationId: getGreeting
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional name to personalize the greeting
 *         example: "John"
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         headers:
 *           X-RateLimit-Limit:
 *             schema:
 *               type: integer
 *             description: The number of allowed requests in the current period
 *           X-RateLimit-Remaining:
 *             schema:
 *               type: integer
 *             description: The number of remaining requests in the current period
 *           X-RateLimit-Reset:
 *             schema:
 *               type: string
 *               format: date-time
 *             description: The time when the rate limit resets
 *           Cache-Control:
 *             schema:
 *               type: string
 *             description: Caching directives
 *           ETag:
 *             schema:
 *               type: string
 *             description: Entity tag for cache validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GreetingResponse'
 *             examples:
 *               default:
 *                 value:
 *                   message: "Hello, welcome to HIMARPL API!"
 *                   timestamp: "2024-01-01T00:00:00Z"
 *               withName:
 *                 value:
 *                   message: "Hello John, welcome to HIMARPL API!"
 *                   timestamp: "2024-01-01T00:00:00Z"
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - API key is not authorized for this operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not Found - The requested resource does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *         headers:
 *           X-RateLimit-Reset:
 *             schema:
 *               type: string
 *               format: date-time
 *             description: The time when the rate limit resets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags:
 *       - Greetings
 *     summary: Create a custom greeting
 *     description: Creates a new custom greeting with additional metadata
 *     operationId: createGreeting
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - language
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name to be used in the greeting
 *                 example: "John"
 *               language:
 *                 type: string
 *                 description: Language code for the greeting
 *                 enum: ["en", "es", "fr"]
 *                 example: "en"
 *               metadata:
 *                 type: object
 *                 properties:
 *                   timezone:
 *                     type: string
 *                     description: User's timezone
 *                     example: "UTC"
 *                   preferences:
 *                     type: object
 *                     properties:
 *                       formal:
 *                         type: boolean
 *                         description: Whether to use formal language
 *                         example: true
 *     responses:
 *       201:
 *         description: Greeting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GreetingResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   put:
 *     tags:
 *       - Greetings
 *     summary: Update an existing greeting
 *     description: Updates the configuration of an existing greeting
 *     operationId: updateGreeting
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the greeting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GreetingUpdateRequest'
 *     responses:
 *       200:
 *         description: Greeting updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GreetingResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     tags:
 *       - Greetings
 *     summary: Delete a greeting
 *     description: Removes an existing greeting configuration
 *     operationId: deleteGreeting
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the greeting to delete
 *     responses:
 *       204:
 *         description: Greeting deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * components:
 *   schemas:
 *     GreetingResponse:
 *       type: object
 *       required:
 *         - message
 *         - timestamp
 *       properties:
 *         message:
 *           type: string
 *           description: The greeting message
 *           example: "Hello, welcome to HIMARPL API!"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The time when the greeting was generated
 *           example: "2024-01-01T00:00:00Z"
 *         metadata:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *               description: Language of the greeting
 *               example: "en"
 *             version:
 *               type: string
 *               description: API version
 *               example: "1.0"
 *     GreetingUpdateRequest:
 *       type: object
 *       required:
 *         - language
 *       properties:
 *         language:
 *           type: string
 *           description: Language code for the greeting
 *           enum: ["en", "es", "fr"]
 *         metadata:
 *           type: object
 *           properties:
 *             timezone:
 *               type: string
 *             preferences:
 *               type: object
 *               properties:
 *                 formal:
 *                   type: boolean
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - error
 *         - code
 *         - timestamp
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong
 *           example: "Invalid request parameters"
 *         code:
 *           type: string
 *           description: Error code for machine processing
 *           example: "INVALID_PARAMETERS"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Time when the error occurred
 *         details:
 *           type: object
 *           description: Additional error details
 *   responses:
 *     BadRequest:
 *       description: Bad request - Invalid parameters
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Unauthorized:
 *       description: Unauthorized - Invalid or missing API key
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: Forbidden - API key is not authorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: Not Found - Requested resource does not exist
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     TooManyRequests:
 *       description: Too Many Requests - Rate limit exceeded
 *       headers:
 *         X-RateLimit-Reset:
 *           schema:
 *             type: string
 *             format: date-time
 *           description: The time when the rate limit resets
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     InternalError:
 *       description: Internal Server Error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *   securitySchemes:
 *     apiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *       description: API key for authentication
 */

export async function GET(request: Request) {
  try {
    // Check API key
    const apiKey = request.headers.get("X-API-Key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing API key",
          code: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    // Generate greeting message
    const message = name
      ? `Hello ${name}, welcome to HIMARPL API!`
      : "Hello, welcome to HIMARPL API!";

    const greeting = {
      message,
      timestamp: new Date().toISOString(),
      metadata: {
        language: "en",
        version: "1.0",
      },
    };

    return new Response(JSON.stringify(greeting), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "99",
        "X-RateLimit-Reset": new Date(Date.now() + 3600000).toISOString(),
        "Cache-Control": "max-age=30",
        ETag:
          '"' + Buffer.from(JSON.stringify(greeting)).toString("base64") + '"',
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
        details: { message: error.message },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check API key
    const apiKey = request.headers.get("X-API-Key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing API key",
          code: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.language) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          code: "INVALID_PARAMETERS",
          timestamp: new Date().toISOString(),
          details: {
            required: ["name", "language"],
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate language
    if (!["en", "es", "fr"].includes(body.language)) {
      return new Response(
        JSON.stringify({
          error: "Invalid language code",
          code: "INVALID_PARAMETERS",
          timestamp: new Date().toISOString(),
          details: {
            allowed_languages: ["en", "es", "fr"],
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const greeting = {
      message: `Hello ${body.name}, welcome to HIMARPL API!`,
      timestamp: new Date().toISOString(),
      metadata: {
        language: body.language,
        version: "1.0",
        ...body.metadata,
      },
    };

    return new Response(JSON.stringify(greeting), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        Location: `/api/v1/greetings?id=${Math.random()
          .toString(36)
          .substring(7)}`,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
        details: { message: error.message },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check API key
    const apiKey = request.headers.get("X-API-Key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing API key",
          code: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get greeting ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(
        JSON.stringify({
          error: "Missing greeting ID",
          code: "INVALID_PARAMETERS",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate language if provided
    if (body.language && !["en", "es", "fr"].includes(body.language)) {
      return new Response(
        JSON.stringify({
          error: "Invalid language code",
          code: "INVALID_PARAMETERS",
          timestamp: new Date().toISOString(),
          details: {
            allowed_languages: ["en", "es", "fr"],
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Simulate not found error for demonstration
    if (id === "notfound") {
      return new Response(
        JSON.stringify({
          error: "Greeting not found",
          code: "NOT_FOUND",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const greeting = {
      message: "Updated greeting message",
      timestamp: new Date().toISOString(),
      metadata: {
        language: body.language || "en",
        version: "1.0",
        ...body.metadata,
      },
    };

    return new Response(JSON.stringify(greeting), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
        details: { message: error.message },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Check API key
    const apiKey = request.headers.get("X-API-Key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing API key",
          code: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get greeting ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(
        JSON.stringify({
          error: "Missing greeting ID",
          code: "INVALID_PARAMETERS",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Simulate not found error for demonstration
    if (id === "notfound") {
      return new Response(
        JSON.stringify({
          error: "Greeting not found",
          code: "NOT_FOUND",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(null, {
      status: 204,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
        details: { message: error.message },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
