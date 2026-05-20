declare module "next/server.js" {
  export class NextRequest extends Request {
    cookies: unknown;
    nextUrl: URL;
  }

  export class NextResponse<Body = unknown> extends Response {
    static json<JsonBody>(body: JsonBody, init?: ResponseInit): NextResponse<JsonBody>;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}

declare module "next/server" {
  export class NextRequest extends Request {
    cookies: unknown;
    nextUrl: URL;
  }

  export class NextResponse<Body = unknown> extends Response {
    static json<JsonBody>(body: JsonBody, init?: ResponseInit): NextResponse<JsonBody>;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}
