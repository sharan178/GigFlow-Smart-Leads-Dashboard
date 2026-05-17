const API_URL = process.env.API_URL || "http://localhost:5000";
const email = `smoke-${Date.now()}@example.com`;
const password = "password123";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  }
  return body;
};

const run = async () => {
  await request("/health");

  const registered = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Smoke Admin", email, password, role: "admin" }),
  });
  const token = registered.data.token;
  const auth = { Authorization: `Bearer ${token}` };

  await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  await request("/api/auth/me", { headers: auth });

  const created = await request("/api/leads", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({
      name: "Rahul Sharma",
      email: `lead-${Date.now()}@example.com`,
      status: "Qualified",
      source: "Instagram",
    }),
  });

  await request("/api/leads?page=1&status=Qualified&source=Instagram&search=Rahul&sort=latest", { headers: auth });
  await request(`/api/leads/${created.data._id}`, {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({
      name: "Rahul Sharma",
      email: created.data.email,
      status: "Contacted",
      source: "Referral",
    }),
  });
  await request(`/api/leads/${created.data._id}`, { method: "DELETE", headers: auth });

  console.log("Smoke test passed: auth and lead CRUD are working.");
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
