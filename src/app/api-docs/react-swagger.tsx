"use client";

import { useEffect, useRef } from "react";
import { SwaggerUIBundle } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css";

// eslint-disable-next-line
export function ReactSwagger({ spec }: { spec: any }) {
  const swaggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swaggerRef.current || !spec) return;
    SwaggerUIBundle({
      domNode: swaggerRef.current,
      spec,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="swagger-ui-wrapper" ref={swaggerRef} />;
}
