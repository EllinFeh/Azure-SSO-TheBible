export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "fé"; // Palavra-chave padrão

    console.log("Buscando versículos para:", query);

    const apiUrl = `https://api.biblesupersearch.com/api?bible=almeida_ra&whole_words=true&page_limit=20&search=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("Erro na API externa:", response.status, response.statusText);
      return new Response(JSON.stringify({ error: "Nenhum versículo encontrado com essa palavra, Verifique se está correta ou faltando acento." }), { status: 500 });
    }

    const data = await response.json();
    console.log("Dados recebidos da API:", data);

    if (!data.results || data.results.length === 0) {
      return new Response(JSON.stringify({ error: "Nenhum versículo encontrado" }), { status: 404 });
    }

    // 🔹 Extraindo os versículos corretamente
    const formattedVerses = data.results.map((item) => {
      const chapter = Object.keys(item.verses.almeida_ra)[0]; // Pega o número do capítulo
      const verse = Object.keys(item.verses.almeida_ra[chapter])[0]; // Pega o número do versículo

      return {
        text: item.verses.almeida_ra[chapter][verse].text || "Versículo não disponível",
        book: item.book_name || "Livro desconhecido",
        chapter: chapter || "?",
        verse: verse || "?",
      };
    });

    return new Response(JSON.stringify({ results: formattedVerses }), { status: 200 });
  } catch (error) {
    console.error("Erro no backend do Next.js:", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), { status: 500 });
  }
}
