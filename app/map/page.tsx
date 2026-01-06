"use client";

// 1. Ubah import untuk mengarah ke MapComponent (yang ada logika Supabase-nya)
import MapComponent from "@/components/MapComponent"; 

export default function Page() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* 2. Render MapComponent, bukan MapFacilities */}
      <MapComponent />
    </div>
  );
}