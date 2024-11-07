import { mount } from "@vue/test-utils";
import LoginPage from "@/views/LoginPage.vue";
import "@/mock"; 
import { afterEach, beforeEach, describe, it, expect } from "vitest";
import axios from "axios";

vi.mock("axios");

describe("LoginPage", () => {
  let wrapper;

  beforeEach(() => {
    localStorage.setItem("userDetails", JSON.stringify({ name: "Test User" }));
    wrapper = mount(LoginPage);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("displays email validation error when email is empty", async () => {
    await wrapper.find("#email").setValue("");
    await wrapper.vm.validateEmail();
    expect(wrapper.vm.emailError).toBe("Email address is required.");
  });

  it("displays email validation error when email is invalid", async () => {
    await wrapper.find("#email").setValue("invalid email");
    await wrapper.vm.validateEmail();
    expect(wrapper.vm.emailError).toBe("Email address must be valid.");
  });

  it("displays password validation error when password is empty", async () => {
    await wrapper.find("#password").setValue("");
    await wrapper.vm.validatePassword();
    expect(wrapper.vm.passwordError).toBe("password is required.");
  });

  it("displays password validation error when password is weak", async () => {
    await wrapper.find("#password").setValue("weakpass");
    await wrapper.vm.validatePassword();
    expect(wrapper.vm.passwordError).toBe(
      "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
    );
  });

  it("Login successful!", async () => {
    axios.post.mockResolvedValue({
      data: { message: "Login successful!" },
    });

    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("!password123");
    await wrapper.find("form").trigger("submit.prevent");

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.successMessage).toBe("Welcome back, Test User!");
  });
});
