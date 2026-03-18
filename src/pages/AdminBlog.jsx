import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Deprecated — use AdminBlogManagement instead.
export default function AdminBlog() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/AdminBlogManagement", { replace: true });
  }, [navigate]);
  return null;
}
