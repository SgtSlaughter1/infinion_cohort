import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mock = new MockAdapter(axios);


mock.onPost("/api/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);
  if (email === "test@gmail.com" && password === "!Password123") {

    return [200, { message: "Login successful!" }];
  } else {

    return [400, { message: "Invalid Credentials." }];
  }
});

// Log the mock setup for debugging purposes
console.log("Axios mock setup complete.");
