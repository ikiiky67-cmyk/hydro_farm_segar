import { Metadata } from "next";
import { ChangePasswordClient } from "./ChangePasswordClient";

export const metadata: Metadata = {
  title: "Ganti Password",
  description: "Ubah password admin untuk dashboard HydroFarm.",
};

export default function ChangePasswordPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto h-full overflow-y-auto">
      <ChangePasswordClient />
    </div>
  );
}
