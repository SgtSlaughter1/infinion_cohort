import { mount } from "@vue/test-utils";
import SignUp from "@/views/SignUp.vue"; 
import { describe, it, expect, vi } from "vitest";

const mockRouter = {
    push: vi.fn(),
};

describe("SignUp.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(SignUp, {
            global: {
                mocks: {
                    $router: mockRouter,
                },
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    // Validation tests for each input
    it("validates the name field", async () => {
        await wrapper.setData({ formData: { name: "Ab" } });
        await wrapper.vm.validateName();
        expect(wrapper.vm.errors.name).toBe(
            "Name must be at least 6 characters long."
        );

        await wrapper.setData({ formData: { name: "Valid Name" } });
        await wrapper.vm.validateName();
        expect(wrapper.vm.errors.name).toBe("");
    });

    it("validates the email field", async () => {
        await wrapper.setData({ formData: { email: "invalid-email" } });
        await wrapper.vm.validateEmail();
        expect(wrapper.vm.errors.email).toBe("Enter a valid email address.");

        await wrapper.setData({ formData: { email: "test@example.com" } });
        await wrapper.vm.validateEmail();
        expect(wrapper.vm.errors.email).toBe("");
    });

    it("validates the password field", async () => {
        await wrapper.setData({ formData: { password: "short" } });
        await wrapper.vm.validatePassword();
        expect(wrapper.vm.errors.password).toBe(
            "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
        );

        await wrapper.setData({ formData: { password: "Valid1@password" } });
        await wrapper.vm.validatePassword();
        expect(wrapper.vm.errors.password).toBe("");
    });

    it("validates the phone field", async () => {
        await wrapper.setData({ formData: { phone: "12345" } });
        await wrapper.vm.validatePhone();
        expect(wrapper.vm.errors.phone).toBe("Phone number must be 10 digits.");

        await wrapper.setData({ formData: { phone: "1234567890" } });
        await wrapper.vm.validatePhone();
        expect(wrapper.vm.errors.phone).toBe("");
    });

    it("validates the date of birth field", async () => {
        await wrapper.setData({ formData: { dob: "" } });
        await wrapper.vm.validateDob();
        expect(wrapper.vm.errors.dob).toBe("Date of Birth is required.");

        const now = new Date();
        const year = now.getFullYear() - 17;
        const dob = `${year}-01-01`;

        await wrapper.setData({ formData: { dob } });
        await wrapper.vm.validateDob();
        expect(wrapper.vm.errors.dob).toBe("You must be at least 18 years old.");

        const validYear = now.getFullYear() - 20;
        const validDob = `${validYear}-01-01`;

        await wrapper.setData({ formData: { dob: validDob } });
        await wrapper.vm.validateDob();
        expect(wrapper.vm.errors.dob).toBe("");
    });

    it("validates the gender field", async () => {
        await wrapper.setData({ formData: { gender: "" } });
        await wrapper.vm.validateGender();
        expect(wrapper.vm.errors.gender).toBe("Gender is required.");

        await wrapper.setData({ formData: { gender: "male" } });
        await wrapper.vm.validateGender();
        expect(wrapper.vm.errors.gender).toBe("");
    });

    it("prevents form submission if there are validation errors", async () => {
        await wrapper.setData({
            formData: {
                name: "",
                email: "",
                password: "",
                phone: "",
                dob: "",
                gender: "",
            },
        });
        await wrapper.vm.handleSignup();
        expect(wrapper.vm.formError).toBe("Please correct the highlighted fields.");
    });

    it("handles successful form submission correctly", async () => {
        await wrapper.setData({
            formData: {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "Valid1@password",
                phone: "1234567890",
                dob: "2000-01-01",
                gender: "male",
            },
        });

        await wrapper.vm.handleSignup();

        expect(wrapper.vm.successMessage).toBe(
            "You have successfully created an account!"
        );
        expect(localStorage.getItem("userDetails")).toBe(
            JSON.stringify({
                name: "John Doe",
                email: "john.doe@example.com",
                password: "Valid1@password",
                phone: "1234567890",
                dob: "2000-01-01",
                gender: "male",
            })
        );
    });

    it("closes the modal and navigates after success", async () => {
        await wrapper.setData({
            successMessage: "You have successfully created an account!",
        });

        wrapper.vm.closeModal();
        expect(wrapper.vm.successMessage).toBeNull();

        await new Promise((resolve) => setTimeout(resolve, 8000));
        expect(mockRouter.push).toHaveBeenCalledWith("/login");
    }, 10000); 
});
