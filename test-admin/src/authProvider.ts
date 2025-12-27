const API_URL = "http://localhost:8080/api";

export const authProvider = {
  login: async ({ username, password }: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: username,
        password,
      }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    localStorage.setItem("token", data.token);
  },

  logout: async () => {
    localStorage.removeItem("token");
  },

  checkAuth: async () =>
    localStorage.getItem("token") ? Promise.resolve() : Promise.reject(),

  checkError: async () => Promise.resolve(),
  getPermissions: async () => Promise.resolve(),
};
