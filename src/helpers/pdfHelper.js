export const extractItemsFromPdf = (pdfText) => {
  // Divide el texto en ítems por cada "(número). "
  const items = pdfText
    .split(/(?=\d+\.\s)/)
    .filter((item) => /^\d+\.\s/.test(item.trim()));

  // Extrae el título de cada ítem, ignorando subítems como "a)"
  const itemTitles = items
    .map((item) => {
      const match = item.match(/^\d+\.\s([^\n]+)/);
      return match ? match[1].trim() : "";
    })
    .filter(
      (title) => title && !/^[a-z]\)/.test(title) && !/^\d+\.\s/.test(title)
    );

  // Filtra los títulos que no deberían estar
  const filteredTitles = itemTitles.filter((title) => {
    return !/^\d+\.\s/.test(title) && !/^[a-z]\)/.test(title);
  });

  // Cuenta el número de ítems
  const itemCount = filteredTitles.length;

  return { itemCount, filteredTitles };
};
