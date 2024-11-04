export const invokeCsvDownload = (data: Blob, filename: string) => {
  const link = document.createElement("a");
  const href = URL.createObjectURL(new Blob([data], { type: "text/csv" }));

  link.href = href;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
