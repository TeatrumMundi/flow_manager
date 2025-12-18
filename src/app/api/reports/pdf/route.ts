import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildOrigin(request: Request) {
  const headers = request.headers;
  const forwardedProto = headers.get("x-forwarded-proto");
  const proto = forwardedProto ? forwardedProto.split(",")[0]?.trim() : "http";
  const host = headers.get("x-forwarded-host") ?? headers.get("host");

  if (!host) {
    throw new Error("Missing Host header");
  }

  return `${proto}://${host}`;
}

export async function GET(request: Request) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path || !path.startsWith("/")) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid 'path' query param" },
        { status: 400 },
      );
    }

    const origin = buildOrigin(request);

    const url = new URL(path, origin);
    url.searchParams.set("export", "pdf");

    const cookieHeader = request.headers.get("cookie");

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    if (cookieHeader) {
      await page.setExtraHTTPHeaders({ cookie: cookieHeader });
    }

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.goto(url.toString(), {
      waitUntil: "networkidle0",
      timeout: 60_000,
    });

    // Give client charts a moment to paint.
    await new Promise((resolve) => setTimeout(resolve, 750));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "12mm",
        bottom: "12mm",
        left: "10mm",
        right: "10mm",
      },
    });

    const pdfBuffer = Buffer.from(pdf);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="raport.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to export PDF",
      },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
