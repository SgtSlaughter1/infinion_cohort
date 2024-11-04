import MockAdapter from "axios-mock-adapter";
import axios from "axios";

// Create an instance of the MockAdapter
const mock = new MockAdapter(axios);

// Mock data
const mockData = {
  email: "test@gmail.com",
  password: "!password123",
};

// Setup the mock response for the login endpoint
mock.onPost("/api/login").reply((config) => {
  // Parse the request body
  const { email, password } = JSON.parse(config.data);

  // Check if the credentials match
  if (email === mockData.email && password === mockData.password) {
    // Successful login response
    return [200, { message: "Login successful!" }];
  } else {
    // Failed login response
    return [401, { message: "Invalid credentials." }];
  }
});

// Export the mock instance if needed
export default mock;
