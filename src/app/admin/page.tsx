import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBookings, getBlockedDates } from "@/lib/storage";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const bookings = getBookings();
  const blockedDates = getBlockedDates();

  return <AdminDashboard bookings={bookings} blockedDates={blockedDates} />;
}
