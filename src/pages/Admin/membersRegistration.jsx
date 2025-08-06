import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase, upploadMediaToSupabase } from "../../utill/mediaUpload";

export default function MembersRegistration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "male",
    address: "",
    occupation: "",
    position: "",
    status: "pending",
    mylci: "",
    image: null,
    imagePreview: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      toast.error("Please select a valid image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "firstName", "lastName", "email", "phone", "dob",
      "gender", "address", "occupation", "position", "status"
    ];
    for (let field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === "") {
        toast.error(`Please fill in the ${field} field.`);
        return;
      }
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      let imageUrl = "";
      if (form.image) {
        const fileName = Date.now() + "_" + form.image.name;
        const { error: uploadError } = await upploadMediaToSupabase(
          new File([form.image], fileName)
        );
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const payload = {
        ...form,
        image: imageUrl,
      };
      delete payload.imagePreview;

      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/member`,
        payload,
        { headers }
      );

      toast.success("Member registered successfully!");
      navigate("/admin/dashboard/members");
    } catch (err) {
      console.error("Error creating member:", err);
      if (err.response?.status === 409) {
        toast.error(`${err.response.data.message}`);
      } else {
        toast.error("Failed to register member.");
      }
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">
        Register New Member
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--color-card)] p-6 rounded shadow-md"
      >
        {/* Image Preview + Upload */}
        <div className="col-span-1 md:col-span-2">
          {form.imagePreview && (
            <img
              src={form.imagePreview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          )}
          <label className="px-3 py-2 rounded bg-[var(--color-primary)] text-white text-center cursor-pointer w-fit inline-block">
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Input Fields */}
        {[
          { name: "firstName", label: "First Name" },
          { name: "lastName", label: "Last Name" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone" },
          { name: "dob", label: "Date of Birth", type: "date" },
          { name: "address", label: "Address" },
          { name: "occupation", label: "Occupation" },
          { name: "position", label: "Position" },
          { name: "mylci", label: "MYLCI" },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="text-sm mb-1 block">{label}</label>
            <input
              name={name}
              type={type || "text"}
              value={form[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            />
          </div>
        ))}

        {/* Gender */}
        <div>
          <label className="text-sm mb-1 block">Gender</label>
          <div className="flex gap-4 mt-1">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm mb-1 block">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
          >
            <option value="pending">Pending</option>
            <option value="accept">Accepted</option>
            <option value="reject">Rejected</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
