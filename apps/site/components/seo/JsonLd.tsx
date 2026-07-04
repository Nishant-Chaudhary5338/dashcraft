/**
 * Renders a JSON-LD <script> block for structured data.
 *
 * Server component — emits no client JS. The structured data grounds both
 * SEO rich results (Google) and AEO/GEO answer engines (ChatGPT, Perplexity,
 * Claude, AI Overviews) so they can describe dashcraft accurately.
 */
export type JsonLdSchema = Record<string, unknown> & {
  "@context": "https://schema.org";
  "@type": string;
};

export function JsonLd({ data }: { data: JsonLdSchema | JsonLdSchema[] }) {
  return (
    <script
      type="application/ld+json"
      // Author-authored objects, no user input — safe to serialize inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
