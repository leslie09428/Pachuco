import { NextResponse } from "next/server";

const MODELO_POR_DEFECTO = "eleven_multilingual_v2";

export async function POST(request: Request) {
  let texto: unknown;
  try {
    const body = (await request.json()) as { texto?: unknown };
    texto = body.texto;
  } catch {
    return NextResponse.json({ error: "Peticion invalida" }, { status: 400 });
  }

  if (typeof texto !== "string" || texto.trim().length === 0) {
    return NextResponse.json({ error: "Falta el texto" }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    return NextResponse.json(
      {
        error:
          "Configura ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID en .env para activar la voz.",
      },
      { status: 503 },
    );
  }

  const recortado = texto.trim().slice(0, 600);
  const modelo = process.env.ELEVENLABS_MODEL_ID ?? MODELO_POR_DEFECTO;
  const endpoint = new URL(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
  );
  endpoint.searchParams.set("output_format", "mp3_44100_128");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: recortado,
        model_id: modelo,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const detalle = await response.text();
      console.error(
        `ElevenLabs respondió con HTTP ${response.status} (modelo: ${modelo}):`,
        detalle,
      );
      const error =
        response.status === 401
          ? "La API key de ElevenLabs no es válida."
          : response.status === 403
            ? "La API key no tiene permiso de Text to Speech."
            : response.status === 404
              ? "No se encontró el Voice ID o el modelo configurado."
              : response.status === 429
                ? "ElevenLabs alcanzó el límite de solicitudes o créditos."
                : "ElevenLabs no pudo generar la voz.";
      return NextResponse.json(
        { error },
        { status: response.status === 429 ? 429 : 502 },
      );
    }

    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error al generar la voz con ElevenLabs:", error);
    return NextResponse.json(
      { error: "No se pudo conectar con ElevenLabs" },
      { status: 502 },
    );
  }
}
