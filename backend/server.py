from fastapi import FastAPI, Request
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
import httpx
import os
import logging

# This server acts as a thin reverse proxy, forwarding all /api/* requests
# to the Next.js application running on port 3000.
# In production (Vercel), this proxy is not needed — Next.js handles everything.

NEXTJS_URL = "http://localhost:3000"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
async def proxy(request: Request, path: str):
    target_url = f"{NEXTJS_URL}/api/{path}"
    query = str(request.url.query)
    if query:
        target_url += f"?{query}"

    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)

    body = await request.body()

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            resp = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body if body else None,
            )
            response_headers = dict(resp.headers)
            response_headers.pop("transfer-encoding", None)
            response_headers.pop("content-encoding", None)
            response_headers.pop("content-length", None)
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=response_headers,
            )
        except httpx.ConnectError:
            logger.error(f"Next.js not reachable at {target_url}")
            return Response(
                content='{"error":"Backend service unavailable"}',
                status_code=503,
                media_type="application/json",
            )
        except Exception as e:
            logger.error(f"Proxy error: {e}")
            return Response(
                content=f'{{"error":"Proxy error: {str(e)}"}}',
                status_code=502,
                media_type="application/json",
            )
