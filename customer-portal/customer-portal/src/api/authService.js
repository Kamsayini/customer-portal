// src/api/authService.js

const API_BASE_URL = "http://localhost:5081/api/auth"; // adjust this if hosted elsewhere

export async function registerUser(username, email, password, referenceNumber) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      referenceNumber, 
    }),
  });

  if (!response.ok) {
  const error = await response.json();
  console.error("❌ Backend error:", error);
  throw new Error(error.message || "Registration failed");
}


  return await response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user)); // optional fallback
return data; // return { user, token }

}
