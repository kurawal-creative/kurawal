// utils/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi sekali di sini, langsung diekspor
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ekspor instance yang sudah di-config
export default cloudinary;

// Generate signature untuk upload ke folder tertentu
export const generateSignature = (folder: string = "tmp") => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET!);
  return { timestamp, signature, folder, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME };
};

// Generate signature untuk upload ke folder 'tmp' (Legacy support)
export const getUploadSignature = () => {
  const { timestamp, signature } = generateSignature("tmp");
  return { timestamp, signature, folder: "tmp" };
};

// Pindah file dari 'tmp' ke 'posts'
export const finalizeImage = async (publicId: string, targetFolder: string) => {
  try {
    const fileName = publicId.split("/").pop()?.split(".")[0];
    if (!fileName) return publicId;

    const newPublicId = `${targetFolder}/${fileName}`;

    // Jika sudah berada di target folder, jangan rename lagi
    if (publicId.startsWith(`${targetFolder}/`)) {
      return publicId;
    }

    // Pastikan publicId tidak mengandung ekstensi file untuk API Cloudinary
    const cleanPublicId = publicId.split(".")[0];

    await cloudinary.uploader.rename(cleanPublicId, newPublicId, {
      overwrite: true,
    });
    return newPublicId;
  } catch (error: any) {
    if (error.http_code === 404 || error.message?.includes("not found")) {
      console.warn(`Image ${publicId} not found in Cloudinary or already moved. skipping.`);
      return publicId;
    }
    console.error("Cloudinary rename error:", error);
    return publicId;
  }
};

// Hapus file
export const deleteImage = async (publicId: string) => {
  try {
    const cleanPublicId = publicId.split(".")[0];
    await cloudinary.uploader.destroy(cleanPublicId);
  } catch (error: any) {
    console.error(`Failed to delete image ${publicId}:`, error.message);
  }
};
