import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateOgImage() {
  console.log('Generating Open Graph social preview image (1200x630)...');

  const pdfPath = path.join(publicDir, 'og-image.pdf');
  const pngPath = path.join(publicDir, 'og-image.png');

  const doc = new PDFDocument({
    size: [1200, 630],
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    info: {
      Title: 'Nandan Pruthvi Raj R — Open Graph Preview',
      Author: 'Nandan Pruthvi Raj R',
    },
  });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Background: Pristine warm off-white
  doc.rect(0, 0, 1200, 630).fill('#FAFAFA');

  // Subtle outer architectural boundary
  doc.rect(48, 48, 1104, 534).lineWidth(1).strokeColor('#E5E7EB').stroke();
  doc.rect(54, 54, 1092, 522).lineWidth(0.5).strokeColor('#F3F4F6').stroke();

  // Subtle metallic gold corner bracket accents
  const goldColor = '#B89047';
  doc.rect(48, 48, 48, 2.5).fill(goldColor);
  doc.rect(48, 48, 2.5, 48).fill(goldColor);
  doc.rect(1104, 48, 48, 2.5).fill(goldColor);
  doc.rect(1150, 48, 2.5, 48).fill(goldColor);
  doc.rect(48, 580, 48, 2.5).fill(goldColor);
  doc.rect(48, 534.5, 2.5, 48).fill(goldColor);
  doc.rect(1104, 580, 48, 2.5).fill(goldColor);
  doc.rect(1150, 534.5, 2.5, 48).fill(goldColor);

  // Top Category Eyebrow
  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor(goldColor)
    .text('CANDIDATE DOSSIER & VERIFIED PORTFOLIO', 104, 118, { characterSpacing: 2.5 });

  // Candidate Name in Serif
  doc
    .font('Times-Bold')
    .fontSize(58)
    .fillColor('#111111')
    .text('NANDAN PRUTHVI RAJ R', 104, 158);

  // Role subtitle
  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .fillColor('#374151')
    .text('SOFTWARE ENGINEER  /  DATA ANALYST', 104, 248, { characterSpacing: 1.5 });

  // Thin gold divider line
  doc.rect(104, 288, 72, 2).fill(goldColor);

  // Value Proposition / Core Statement
  doc
    .font('Helvetica')
    .fontSize(23)
    .fillColor('#4B5563')
    .text(
      'Building intelligent digital products, full-stack systems\nand data-driven solutions.',
      104,
      314,
      { lineGap: 8 }
    );

  // Verified Technology stack badges indicator
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('#9CA3AF')
    .text('CORE CAPABILITIES', 104, 428, { characterSpacing: 1.5 });

  const techStack = 'React.js  •  Node.js  •  Python  •  SQL / MySQL  •  MongoDB  •  Power BI  •  REST APIs';
  doc
    .font('Helvetica')
    .fontSize(15)
    .fillColor('#1F2937')
    .text(techStack, 104, 450);

  // Bottom Status & Location Bar
  doc.rect(104, 495, 992, 0.75).fill('#E5E7EB');

  doc
    .font('Helvetica')
    .fontSize(13)
    .fillColor('#6B7280')
    .text('Bengaluru, India   •   Cambridge Institute of Technology (CGPA 8.0/10)   •   Immediate Joiner', 104, 514);

  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  // Convert to high quality PNG using Ghostscript
  try {
    execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r72 -sOutputFile="${pngPath}" "${pdfPath}"`);
    console.log('Open Graph image successfully generated at:', pngPath);
    // Cleanup temporary pdf
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  } catch (err) {
    console.error('Failed to convert OG PDF to PNG with Ghostscript:', err);
  }
}

generateOgImage().catch(console.error);
