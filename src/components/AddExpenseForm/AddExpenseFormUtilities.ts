import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";

 export  const createPdf=async (correctedImage:string,file:File):Promise<Blob |null>=>{
    try{

         // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]); // Define page size

      // Embed the image into the PDF
      const imageBytes = await fetch(correctedImage).then((res) =>
        res.arrayBuffer()
      );
      let embeddedImage;
      if (file.type === "image/png") {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
      } else {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
      }

      if (embeddedImage) {
        const { width, height } = embeddedImage;

        const pageWidth = 600; // PDF page width
        const pageHeight = 800; // PDF page height

        const marginLeft = 50; // Gap from the left
        const marginTop = 50; // Gap from the top

        // Calculate the available space for the image within the page
        const availableWidth = pageWidth - marginLeft * 2;
        const availableHeight = pageHeight - marginTop * 2;

        // Calculate the scale factor to fit the image within the available space
        const scale = Math.min(
          availableWidth / width,
          availableHeight / height
        );

        // Scale the image dimensions
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        // Calculate the position to center the image with margins
        const x = marginLeft + (availableWidth - scaledWidth) / 2; // Center horizontally with margin
        const y = marginTop + (availableHeight - scaledHeight) / 2; // Center vertically with margin

        // Draw the scaled and centered image on the page
        page.drawImage(embeddedImage, {
          x: x,
          y: y,
          width: scaledWidth,
          height: scaledHeight,
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();

        // Convert pdfBytes to a Blob
        return  new Blob([pdfBytes], {
          type: "application/pdf",
        });
    }else{
        throw new Error("Failed to embed image into PDF.");
    }
    }catch(err){
        console.log(err);
        toast.error("Some error occured creating pdf");
        return null;
    }
     
}