export const downloadPDF = (file, filename) => {
    const fileUrl = file;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename+'.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}