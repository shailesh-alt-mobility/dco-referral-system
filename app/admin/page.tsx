import AdminDashboard from "@/components/admin-dashboard"
import ProtectedRoute from "@/components/protected-route"

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  )
}
