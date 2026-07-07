import api from "../api/axios.js";

export const updateProfile = (formData) =>
  api
    .put("/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const updateSecurity = (payload) =>
  api.put("/user/update-security", payload).then((r) => r.data);
