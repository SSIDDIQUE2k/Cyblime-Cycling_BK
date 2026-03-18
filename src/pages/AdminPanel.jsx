import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// AdminPanel is deprecated — all management is in dedicated Admin*Management pages.
// This redirect ensures old links still work.
export default function AdminPanel() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/AdminDashboard", { replace: true });
  }, [navigate]);
  return null;
}
