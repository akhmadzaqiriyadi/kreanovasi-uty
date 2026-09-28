import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface BookingPdfData {
  id: string;
  bookingCode: string;
  roomName: string;
  location?: string;
  date: string;
  timeSlot: string;
  applicant: string;
  idNumber?: string;
  prodi?: string;
  role?: string;
  audience: number;
  purpose: string;
  status: "approved" | "pending" | "completed" | "cancelled" | string;
  adminNotes?: string | null;
}

export interface RoomPosterPdfData {
  id: string;
  name: string;
  category?: string;
  capacity?: number;
  location?: string;
  description?: string;
  operationalHours?: string;
}

/**
 * Generate ultra-sharp QR Data URL without any screen capture or canvas scraping
 */
async function generateQrDataUrl(text: string, width = 1000): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "H",
    width,
    margin: 1,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });
}

/**
 * Generate and trigger download for an official, crisp A4 PDF E-Ticket
 */
export async function downloadBookingTicketPdf(
  data: BookingPdfData,
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4", // 210mm x 297mm
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2; // 178mm

  // --------------------------------------------------------------------------
  // 1. KOP SURAT RESMI UNIVERSITAS & UTY CREATIVE HUB
  // --------------------------------------------------------------------------
  let currentY = 18;

  // Blue Accent Bar at the very top
  doc.setFillColor(30, 58, 138); // #1E3A8A
  doc.rect(0, 0, pageWidth, 4, "F");

  // Kop Header Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 58, 138);
  doc.text("UNIVERSITAS TEKNOLOGI YOGYAKARTA", pageWidth / 2, currentY, {
    align: "center",
  });

  currentY += 5.5;
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // #0F172A
  doc.text(
    "PENGELOLA FASILITAS UTY CREATIVE HUB (UCH)",
    pageWidth / 2,
    currentY,
    {
      align: "center",
    },
  );

  currentY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // #64748B
  doc.text(
    "Kampus 1 UTY: Jl. Ringroad Utara, Jombor, Kec. Mlati, Kab. Sleman, D.I. Yogyakarta 55285",
    pageWidth / 2,
    currentY,
    { align: "center" },
  );

  currentY += 3.5;
  doc.text(
    "Laman: uch.uty.ac.id | Pos-el: creativehub@uty.ac.id | Narahubung: (0274) 623310",
    pageWidth / 2,
    currentY,
    { align: "center" },
  );

  currentY += 4.5;
  // Double Divider Line (Formal Indonesian Academic Standard)
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.8);
  doc.line(marginX, currentY, marginX + contentWidth, currentY);

  currentY += 1.2;
  doc.setLineWidth(0.25);
  doc.line(marginX, currentY, marginX + contentWidth, currentY);

  // --------------------------------------------------------------------------
  // 2. DOCUMENT TITLE & REGISTRATION BANNER
  // --------------------------------------------------------------------------
  currentY += 6;
  const bannerY = currentY;
  const bannerHeight = 15;

  doc.setFillColor(241, 245, 249); // #F1F5F9 Slate 100
  doc.setDrawColor(203, 213, 225); // #CBD5E1
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, bannerY, contentWidth, bannerHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text(
    "SURAT BUKTI RESERVASI & TIKET PRESENSI ELEKTRONIK",
    pageWidth / 2,
    bannerY + 6,
    { align: "center" },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const nowStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(
    `No. Registrasi: DOC/UCH/${data.bookingCode} • Tanggal Terbit: ${nowStr}`,
    pageWidth / 2,
    bannerY + 11,
    { align: "center" },
  );

  // --------------------------------------------------------------------------
  // 3. MAIN SECTION: 2-COLUMN (DETAILS TABLE + QR BADGE CARD)
  // --------------------------------------------------------------------------
  currentY = bannerY + bannerHeight + 6;

  const leftColWidth = 114;
  const rightColX = marginX + leftColWidth + 5;
  const rightColWidth = contentWidth - leftColWidth - 5; // ~59mm

  // --- RIGHT COLUMN: QR TICKET BADGE ---
  const qrBoxY = currentY;
  const qrBoxHeight = 100;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(rightColX, qrBoxY, rightColWidth, qrBoxHeight, 3, 3, "FD");

  // QR Header Strip
  doc.setFillColor(30, 58, 138);
  doc.roundedRect(rightColX, qrBoxY, rightColWidth, 8, 3, 3, "F");
  doc.rect(rightColX, qrBoxY + 5, rightColWidth, 3, "F"); // square bottom corners
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("KODE QR PRESENSI", rightColX + rightColWidth / 2, qrBoxY + 5.5, {
    align: "center",
  });

  // Render QR Code Image
  const qrDataUrl = await generateQrDataUrl(data.bookingCode, 800);
  const qrSize = 42;
  const qrX = rightColX + (rightColWidth - qrSize) / 2;
  const qrY = qrBoxY + 12;
  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // Booking Code in Monospace look
  doc.setFont("courier", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text(
    data.bookingCode,
    rightColX + rightColWidth / 2,
    qrY + qrSize + 5.5,
    { align: "center" },
  );

  // Status Badge Pill
  const isDone = data.status === "completed";
  const badgeY = qrY + qrSize + 9;
  const badgeWidth = 46;
  const badgeX = rightColX + (rightColWidth - badgeWidth) / 2;

  if (isDone) {
    doc.setFillColor(209, 250, 229); // Emerald 100
    doc.setDrawColor(5, 150, 105); // Emerald 600
  } else {
    doc.setFillColor(224, 231, 255); // Indigo 100
    doc.setDrawColor(79, 70, 229); // Indigo 600
  }
  doc.setLineWidth(0.3);
  doc.roundedRect(badgeX, badgeY, badgeWidth, 6, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  if (isDone) {
    doc.setTextColor(5, 150, 105);
    doc.text("PRESENSI SELESAI", rightColX + rightColWidth / 2, badgeY + 4.2, {
      align: "center",
    });
  } else {
    doc.setTextColor(67, 56, 202);
    doc.text("DISETUJUI & AKTIF", rightColX + rightColWidth / 2, badgeY + 4.2, {
      align: "center",
    });
  }

  // QR Instructions Note
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  const noteLines = [
    "Pindai di tablet pintu ruangan",
    "atau tunjukkan kepada petugas Hub",
    "saat kedatangan di lokasi.",
  ];
  noteLines.forEach((line, idx) => {
    doc.text(line, rightColX + rightColWidth / 2, badgeY + 11 + idx * 3.5, {
      align: "center",
    });
  });

  // --- LEFT COLUMN: STRUCTURED TABLES ---
  let leftY = currentY;

  // Section A: Data Pemohon
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text("A. DATA IDENTITAS PEMOHON", marginX, leftY + 4);
  leftY += 6;

  const applicantRows: [string, string][] = [
    ["Nama Lengkap", data.applicant],
    ["Kategori / Role", (data.role || "Civitas UTY").toUpperCase()],
    ["No. Identitas (NIM/NIP)", data.idNumber || "5210410000"],
    ["Program Studi / Unit", data.prodi || "Civitas Akademika UTY"],
  ];

  applicantRows.forEach(([label, val], idx) => {
    const rowY = leftY + idx * 6;
    doc.setFillColor(
      idx % 2 === 0 ? 248 : 255,
      idx % 2 === 0 ? 250 : 255,
      idx % 2 === 0 ? 252 : 255,
    ); // Alternating row
    doc.rect(marginX, rowY, leftColWidth, 6, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, rowY + 6, marginX + leftColWidth, rowY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label, marginX + 3, rowY + 4.2);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(val, marginX + 44, rowY + 4.2);
  });

  leftY += applicantRows.length * 6 + 6;

  // Section B: Rincian Reservasi Fasilitas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text("B. RINCIAN RESERVASI RUANGAN", marginX, leftY + 4);
  leftY += 6;

  const bookingRows: [string, string][] = [
    ["Ruangan", data.roomName],
    ["Lokasi Gedung", data.location || "Gedung UTY Creative Hub Lt. 1"],
    ["Tanggal Pelaksanaan", data.date],
    ["Sesi Waktu", data.timeSlot],
    ["Estimasi Partisipan", `${data.audience} Orang`],
  ];

  bookingRows.forEach(([label, val], idx) => {
    const rowY = leftY + idx * 6;
    doc.setFillColor(
      idx % 2 === 0 ? 248 : 255,
      idx % 2 === 0 ? 250 : 255,
      idx % 2 === 0 ? 252 : 255,
    );
    doc.rect(marginX, rowY, leftColWidth, 6, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, rowY + 6, marginX + leftColWidth, rowY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label, marginX + 3, rowY + 4.2);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(val, marginX + 44, rowY + 4.2);
  });

  leftY += bookingRows.length * 6;

  // Keperluan / Agenda Row (Multi-line safe)
  const purposeRowY = leftY;
  const wrappedPurpose = doc.splitTextToSize(
    `"${data.purpose}"`,
    leftColWidth - 48,
  );
  const purposeRowHeight = Math.max(7, wrappedPurpose.length * 4 + 3);

  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, purposeRowY, leftColWidth, purposeRowHeight, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(
    marginX,
    purposeRowY + purposeRowHeight,
    marginX + leftColWidth,
    purposeRowY + purposeRowHeight,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Tujuan & Agenda", marginX + 3, purposeRowY + 4.5);

  doc.setFont("helvetica", "italic");
  doc.setTextColor(15, 23, 42);
  doc.text(wrappedPurpose, marginX + 44, purposeRowY + 4.5);

  // Synchronize Y to below the taller column
  currentY = Math.max(leftY + purposeRowHeight, qrBoxY + qrBoxHeight) + 6;

  // --------------------------------------------------------------------------
  // 4. SECTION C: TATA TERTIB PENGGUNAAN FASILITAS
  // --------------------------------------------------------------------------
  const rulesBoxY = currentY;
  const rulesBoxHeight = 36;

  doc.setFillColor(254, 252, 232); // Amber 50
  doc.setDrawColor(251, 191, 36); // Amber 400
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, rulesBoxY, contentWidth, rulesBoxHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14); // Amber 800
  doc.text(
    "C. KETENTUAN DAN TATA TERTIB PENGGUNAAN RUANGAN",
    marginX + 4,
    rulesBoxY + 5,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(120, 53, 15); // Amber 900
  const rules = [
    "1. Pemegang tiket wajib hadir di lokasi sekurang-kurangnya 15 menit sebelum sesi peminjaman dimulai.",
    "2. Menjaga kebersihan ruangan, kerapian fasilitas, serta tidak memindahkan inventaris tanpa izin tertulis dari pengelola.",
    "3. Dilarang merokok, membawa zat berbahaya, atau melakukan tindakan yang melanggar norma akademik Universitas.",
    "4. Wajib melakukan check-in via QR saat tiba, dan konfirmasi serah terima ruangan kepada pengelola saat sesi berakhir.",
    "5. Pengelola UTY Creative Hub berhak membatalkan izin penggunaan fasilitas apabila terjadi pelanggaran tata tertib.",
  ];

  rules.forEach((rule, idx) => {
    doc.text(rule, marginX + 4, rulesBoxY + 10 + idx * 4.8);
  });

  currentY = rulesBoxY + rulesBoxHeight + 8;

  // --------------------------------------------------------------------------
  // 5. SIGNATURE & VERIFICATION BLOCK
  // --------------------------------------------------------------------------
  const sigY = currentY;
  const sigColWidth = contentWidth / 2;

  // Left: Pemohon
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Yogyakarta, ${nowStr}`, marginX + 6, sigY);
  doc.text("Pemohon / Penanggung Jawab Kegiatan,", marginX + 6, sigY + 4.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(data.applicant, marginX + 6, sigY + 24);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`NIM/NIP: ${data.idNumber || "5210410000"}`, marginX + 6, sigY + 28);

  // Right: Pengelola Hub
  const rightSigX = marginX + sigColWidth + 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Mengetahui & Menyetujui,", rightSigX, sigY);
  doc.text("Pengelola Fasilitas UTY Creative Hub,", rightSigX, sigY + 4.5);

  // Digital Stamp Stamp Graphic
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.4);
  doc.roundedRect(rightSigX - 1, sigY + 7, 58, 14, 1.5, 1.5, "D");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(30, 58, 138);
  doc.text("TERVALIDASI SECARA ELEKTRONIK", rightSigX + 28, sigY + 12.5, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("SISTEM INFORMASI KAMPUS UCH", rightSigX + 28, sigY + 17, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Tim Administrasi & Operasional UCH", rightSigX, sigY + 24);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("NIP. 198506122010121003", rightSigX, sigY + 28);

  // --------------------------------------------------------------------------
  // 6. OFFICIAL FOOTER (DISCLAIMER & PAGE)
  // --------------------------------------------------------------------------
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(marginX, pageHeight - 12, marginX + contentWidth, pageHeight - 12);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184); // #94A3B8
  doc.text(
    "* Dokumen ini merupakan bukti izin peminjaman sah yang diterbitkan secara elektronik oleh Sistem UTY Creative Hub. Sah tanpa tanda tangan basah.",
    marginX,
    pageHeight - 8,
  );

  doc.setFont("helvetica", "normal");
  doc.text("Halaman 1 dari 1", marginX + contentWidth, pageHeight - 8, {
    align: "right",
  });

  // Save PDF
  const filename = `Tiket-Reservasi-${data.bookingCode}.pdf`;
  doc.save(filename);
}

/**
 * Generate and trigger download for an ultra-crisp A4 Poster for Room Door Kiosk
 */
export async function downloadRoomKioskPosterPdf(
  room: RoomPosterPdfData,
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4", // 210mm x 297mm
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 18;
  const contentWidth = pageWidth - marginX * 2; // 174mm

  // Top Dark Banner
  doc.setFillColor(30, 58, 138); // #1E3A8A
  doc.rect(0, 0, pageWidth, 42, "F");

  // Yellow Accent Stripe
  doc.setFillColor(251, 191, 36); // #FBBF24
  doc.rect(0, 42, pageWidth, 3, "F");

  // Institution Title in Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(251, 191, 36);
  doc.text(
    "UNIVERSITAS TEKNOLOGI YOGYAKARTA • CREATIVE HUB",
    pageWidth / 2,
    15,
    { align: "center" },
  );

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("KIOSK PRESENSI MASUK RUANGAN", pageWidth / 2, 25, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(219, 234, 254);
  doc.text(
    "Pindai QR ini melalui smartphone Anda untuk check-in kehadiran langsung",
    pageWidth / 2,
    33,
    { align: "center" },
  );

  // Room Name Block
  let currentY = 56;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text(room.name, pageWidth / 2, currentY, { align: "center" });

  currentY += 8;
  // Room metadata pill
  const locationText = room.location || "Gedung UTY Creative Hub";
  const capacityText = `Kapasitas: ${room.capacity || 30} Orang`;
  const hoursText = `Jam: ${room.operationalHours || "08:00 - 21:00 WIB"}`;
  const metaText = `${locationText}  •  ${capacityText}  •  ${hoursText}`;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(metaText, pageWidth / 2, currentY, { align: "center" });

  currentY += 10;

  // GIANT HIGH-RESOLUTION QR CODE CONTAINER
  const qrFrameSize = 110;
  const qrFrameX = (pageWidth - qrFrameSize) / 2;
  const qrFrameY = currentY;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(1.2);
  doc.roundedRect(qrFrameX, qrFrameY, qrFrameSize, qrFrameSize, 4, 4, "FD");

  // Generate 1200px ultra sharp QR code
  const roomQrPayload = `UCH-ROOM:${room.id}`;
  const qrDataUrl = await generateQrDataUrl(roomQrPayload, 1200);
  const qrInnerSize = 94;
  const qrInnerX = (pageWidth - qrInnerSize) / 2;
  const qrInnerY = qrFrameY + (qrFrameSize - qrInnerSize) / 2;

  doc.addImage(qrDataUrl, "PNG", qrInnerX, qrInnerY, qrInnerSize, qrInnerSize);

  currentY = qrFrameY + qrFrameSize + 7;

  // Room ID Tag
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth / 2 - 40, currentY, 80, 8, 2, 2, "FD");

  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text(roomQrPayload, pageWidth / 2, currentY + 5.5, { align: "center" });

  currentY += 15;

  // STEP BY STEP SCAN INSTRUCTIONS
  const guideBoxY = currentY;
  const guideBoxHeight = 36;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, guideBoxY, contentWidth, guideBoxHeight, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text(
    "PANDUAN PRESENSI MANDIRI (SELF CHECK-IN):",
    marginX + 6,
    guideBoxY + 7,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const steps = [
    "1. Buka situs web UTY Creative Hub di ponsel Anda dan pastikan sudah masuk (login).",
    "2. Masuk ke menu 'Booking Saya' dan klik tombol 'Scan Masuk Ruangan'.",
    "3. Arahkan kamera smartphone ke QR Code di atas hingga sistem memberikan konfirmasi centang hijau.",
    "4. Kehadiran Anda langsung tercatat otomatis di sistem pemantauan pengelola.",
  ];

  steps.forEach((step, idx) => {
    doc.text(step, marginX + 6, guideBoxY + 13.5 + idx * 5.2);
  });

  currentY = guideBoxY + guideBoxHeight + 8;

  // SECURITY NOTE
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.setDrawColor(199, 210, 254);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, 14, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(67, 56, 202);
  doc.text("SISTEM PROTEKSI TERPADU:", marginX + 5, currentY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(79, 70, 229);
  doc.text(
    "Presensi hanya berhasil bagi mahasiswa, dosen, atau tamu yang memiliki jadwal reservasi disetujui pada hari ini.",
    marginX + 5,
    currentY + 10,
  );

  // FOOTER
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "© Universitas Teknologi Yogyakarta • Divisi Fasilitas & Infrastruktur Kreatif UTY Creative Hub",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" },
  );

  // Save PDF
  const filename = `Poster-Kiosk-${room.id}.pdf`;
  doc.save(filename);
}
