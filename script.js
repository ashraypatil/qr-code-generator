let qrCodeCanvas;
let logoImage;

// Generate the QR code
function generateQRCode() {
  const input = document.getElementById("qr-input").value;
  const color = document.getElementById("qr-color").value;

  if (!input) {
    alert("Please enter text or URL.");
    return;
  }

  QRCode.toCanvas(document.getElementById("qr-code"), input, {
    color: {
      dark: color,
      light: "#ffffff",
    },
  })
    .then(() => {
      if (logoImage) {
        addLogoToCanvas();
      }
    })
    .catch((err) => console.error(err));
}

// Update the color of the QR code
function updateColor() {
  generateQRCode();
}

// Handle logo upload
function updateLogo() {
  const fileInput = document.getElementById("qr-logo");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoImage = new Image();
      logoImage.src = e.target.result;
      logoImage.onload = () => {
        addLogoToCanvas();
      };
    };
    reader.readAsDataURL(file);
  }
}

// Add logo to the QR code canvas
function addLogoToCanvas() {
  const canvas = document.getElementById("qr-code");
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;

  const logoSize = Math.min(width, height) * 0.2;
  const logoX = (width - logoSize) / 2;
  const logoY = (height - logoSize) / 2;

  ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
}

// Download the QR code
function downloadQRCode(format) {
  const canvas = document.getElementById("qr-code");
  const link = document.createElement("a");

  if (format === "svg") {
    QRCode.toString(canvas, { type: "svg" }, (err, svgString) => {
      if (err) throw err;
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      link.href = URL.createObjectURL(blob);
      link.download = "qr-code.svg";
      link.click();
    });
  } else {
    link.href = canvas.toDataURL(`image/${format}`);
    link.download = `qr-code.${format}`;
    link.click();
  }
}
