import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "HIMARPL API Documentation",
        version: "1.0",
      },
      basePath: "/api/v1",
      security: [],
      components: {
        schemas: {
          News: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              title: {
                type: "string",
              },
              metaTitle: {
                type: "string",
              },
              slug: {
                type: "string",
              },
              content: {
                type: "string",
              },
              image: {
                type: "string",
              },
              publishedAt: {
                type: "string",
                format: "date-time",
              },
              createdAt: {
                type: "string",
                format: "date-time",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
              },
              postTags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                    },
                    slug: {
                      type: "string",
                    },
                  },
                },
              },
              author: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  image: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          NewsResponse: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data", "code", "timestamp"],
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/News",
                      },
                      description: "Array of news posts",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      description: "Time when the response was generated",
                    },
                    code: {
                      type: "string",
                      description: "Response code",
                      example: "SUCCESS",
                    },
                    metadata: {
                      type: "object",
                      properties: {
                        total: {
                          type: "integer",
                        },
                        page: {
                          type: "integer",
                        },
                        limit: {
                          type: "integer",
                        },
                        totalPages: {
                          type: "integer",
                        },
                      },
                      description: "Additional response metadata",
                    },
                  },
                },
              },
            },
          },
          BadRequest: {
            description: "Bad request - Invalid parameters",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["error", "code", "timestamp"],
                  properties: {
                    error: {
                      type: "string",
                      description:
                        "Error message describing invalid parameters",
                      example: "Invalid request parameters",
                    },
                    code: {
                      type: "string",
                      description: "Error code for invalid parameters",
                      example: "INVALID_PARAMETERS",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      description: "Time when the error occurred",
                    },
                    metadata: {
                      type: "object",
                      description:
                        "Additional error details about invalid parameters",
                    },
                  },
                },
              },
            },
          },
          Unauthorized: {
            description: "Unauthorized - Invalid or missing API key",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["error", "code", "timestamp"],
                  properties: {
                    error: {
                      type: "string",
                      description: "Error message about authentication failure",
                      example: "Invalid or missing API key",
                    },
                    code: {
                      type: "string",
                      description: "Error code for authentication failure",
                      example: "UNAUTHORIZED",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      description: "Time when the error occurred",
                    },
                    metadata: {
                      type: "object",
                      description: "Additional authentication error details",
                    },
                  },
                },
              },
            },
          },
          Forbidden: {
            description: "Forbidden - API key is not authorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["error", "code", "timestamp"],
                  properties: {
                    error: {
                      type: "string",
                      description: "Error message about authorization failure",
                      example: "API key is not authorized",
                    },
                    code: {
                      type: "string",
                      description: "Error code for authorization failure",
                      example: "FORBIDDEN",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      description: "Time when the error occurred",
                    },
                    metadata: {
                      type: "object",
                      description: "Additional authorization error details",
                    },
                  },
                },
              },
            },
          },
          NotFound: {
            description: "Not Found - Requested resource does not exist",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["error", "code", "timestamp"],
                  properties: {
                    error: {
                      type: "string",
                      description: "Error message about missing resource",
                      example: "Requested resource does not exist",
                    },
                    code: {
                      type: "string",
                      description: "Error code for missing resource",
                      example: "NOT_FOUND",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      description: "Time when the error occurred",
                    },
                    metadata: {
                      type: "object",
                      description: "Additional details about missing resource",
                    },
                  },
                },
              },
            },
          },
          TooManyRequests: {
            description: "Too Many Requests - Rate limit exceeded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["error", "code", "timestamp"],
                  properties: {
                    error: {
                      type: "string",
                      description: "Error message about rate limiting",
                      example: "Rate limit exceeded",
                    },
                    code: {
                      type: "string",
                      description: "Error code for rate limiting",
                      example: "TOO_MANY_REQUESTS",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      description: "Time when the error occurred",
                    },
                    metadata: {
                      type: "object",
                      description: "Additional rate limiting details",
                      properties: {
                        retryAfter: {
                          type: "integer",
                          description: "Seconds until rate limit resets",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          InternalError: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["error", "code", "timestamp"],
                  properties: {
                    error: {
                      type: "string",
                      description: "Error message about server failure",
                      example: "Internal server error",
                    },
                    code: {
                      type: "string",
                      description: "Error code for server failure",
                      example: "INTERNAL_ERROR",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      description: "Time when the error occurred",
                    },
                    metadata: {
                      type: "object",
                      description: "Additional server error details",
                    },
                  },
                },
              },
            },
          },
        },
        securitySchemes: {
          apiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "X-API-Key",
            description: "API key for authentication",
          },
        },
      },
    },
  });
  return spec;
};
