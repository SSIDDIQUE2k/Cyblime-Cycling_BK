import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Deprecated — use AdminEventManagement instead.
export default function AdminEvents() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/AdminEventManagement", { replace: true });
  }, [navigate]);
  return null;
}
