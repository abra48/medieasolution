import { LandingPageContent } from "./landing-page-content";
import { getLandingStepImages } from "@/lib/landing-steps";

// Foto langkah bisa diganti dari admin; halaman diperbarui paling lambat tiap 5 menit
export const revalidate = 300;

export default async function Home() {
  const stepImages = await getLandingStepImages();
  return <LandingPageContent stepImages={stepImages} />;
}
