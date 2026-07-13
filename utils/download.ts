export const downloadPDF = (file: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = file
  link.download = `${filename}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
