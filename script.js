const qrCanvas = document.getElementById("qr-code");
let logoImage = null;
let logoSize = 20;

// Generate the QR code
function generateQRCode() {
  const input = document.getElementById("qr-input").value;
  const color = document.getElementById("qr-color").value;

  if (!input) {
    alert("Please enter text or URL.");
    return;
  }

  QRCode.toCanvas(qrCanvas, input, {
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
    .catch((err) => console.error("Error generating QR code:", err));
}

// Live QR code update
function updateQRCodeLive() {
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
        generateQRCode();
      };
    };
    reader.readAsDataURL(file);
  }
}

// Add logo to the QR code canvas
function addLogoToCanvas() {
  const ctx = qrCanvas.getContext("2d");
  const { width, height } = qrCanvas;

  if (!logoImage) return;

  const scaledLogoSize = Math.min(width, height) * (logoSize / 100);
  const logoX = (width - scaledLogoSize) / 2;
  const logoY = (height - scaledLogoSize) / 2;

  ctx.drawImage(logoImage, logoX, logoY, scaledLogoSize, scaledLogoSize);
}

// Remove logo
function removeLogo() {
  logoImage = null;
  generateQRCode();
}

// Resize logo dynamically
function resizeLogo() {
  logoSize = document.getElementById("logo-size-slider").value;
  generateQRCode();
}

// Download the QR code
function downloadQRCode(format) {
  const link = document.createElement("a");

  if (format === "svg") {
    QRCode.toString(
      document.getElementById("qr-input").value,
      {
        type: "svg",
        color: {
          dark: document.getElementById("qr-color").value,
          light: "#ffffff",
        },
      },
      (err, svgString) => {
        if (err) {
          console.error("Error generating SVG:", err);
          alert(
            "An error occurred while generating the SVG. Please try again."
          );
          return;
        }
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        link.href = URL.createObjectURL(blob);
        link.download = "qr-code.svg";
        link.click();
      }
    );
  } else {
    link.href = qrCanvas.toDataURL(`image/${format}`);
    link.download = `qr-code.${format}`;
    link.click();
  }
}
