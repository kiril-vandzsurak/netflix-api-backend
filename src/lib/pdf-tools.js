import PdfPrinter from "pdfmake";

export const getPdfReadStream = (movies) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  // const content = movies.map((movie) => {
  //   return [
  //     { text: movie.title, style: "header" },
  //     { text: movie.year, style: "subheader" },
  //     { text: movie.type, style: "subheader" },
  //     "\n\n",
  //   ];
  // });

  console.log(movies);

  const docDefinition = {
    content: [
      {
        text: movies.title,
        text: movies.year,
        text: movies.type,
      },
    ],
  };

  const getPdfReadStream = printer.createPdfKitDocument(docDefinition);
  getPdfReadStream.end();

  return getPdfReadStream;
};
