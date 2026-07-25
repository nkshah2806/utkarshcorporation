import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Leaf } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("frenchies_admin_token");
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const loadMembers = async () => {
      try {
        const { data } = await api.get("/admin/members", { headers: { Authorization: `Bearer ${token}` } });
        setMembers(data.members || []);
      } catch (err) {
        toast.error(formatApiError(err));
        navigate("/admin/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1A3626] mb-2">
              <Leaf className="w-5 h-5 text-[#C5A059]" />
              <span className="text-sm uppercase tracking-[0.2em]">Utkarsh Admin</span>
            </div>
            <h1 className="font-serif-display text-3xl text-[#1A3626]">Registered Members</h1>
          </div>
        </div>
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 text-center">Loading members...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-[#1A3626]/10">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F9F6F0] text-[#5C4033]">
                <tr>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Mobile Number</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-left">State</th>
                  <th className="px-4 py-3 text-left">Pin Code</th>
                  <th className="px-4 py-3 text-left">Registered On</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id} className="border-t border-[#1A3626]/10">
                    <td className="px-4 py-3">{member.fullName}</td>
                    <td className="px-4 py-3">{member.mobileNumber}</td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">{member.address}</td>
                    <td className="px-4 py-3">{member.city}</td>
                    <td className="px-4 py-3">{member.state}</td>
                    <td className="px-4 py-3">{member.pinCode}</td>
                    <td className="px-4 py-3">{new Date(member.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
