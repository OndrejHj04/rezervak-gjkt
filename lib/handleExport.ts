export default function handleExport(blob: any, fileName: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `${fileName}.csv`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);

  return URL.revokeObjectURL(url);
}
