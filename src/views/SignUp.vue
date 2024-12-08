<template>
    <div class="d-flex align-items-center justify-content-center  my-5">
        <div class="form-container animated-form p-4 rounded shadow">
            <h5 class="text-center mb-4">SIGNUP</h5>

            <form @submit.prevent="handleSignup">
                <div class="row">
                    <!-- Name Field -->
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input v-model="formData.name" type="text" id="name" class="form-control" @blur="validateName"
                            placeholder="Enter your name" />
                        <div class="text-danger" v-if="errors.name">{{ errors.name }}</div>
                    </div>

                    <!-- Email Field -->
                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="formData.email" type="email" id="email" class="form-control" @blur="validateEmail"
                            placeholder="email@gmail.com" />
                        <div class="text-danger" v-if="errors.email">{{ errors.email }}</div>
                    </div>

                    <!-- Password Field -->
                    <div class="col-md-6 mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input v-model="formData.password" type="password" id="password" class="form-control"
                            @blur="validatePassword" placeholder="Enter Password" />
                        <div class="text-danger" v-if="errors.password">{{ errors.password }}</div>
                    </div>

                    <!-- Phone Field -->
                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input v-model="formData.phone" type="tel" id="phone" class="form-control" @blur="validatePhone"
                            placeholder="Enter phone number" />
                        <div class="text-danger" v-if="errors.phone">{{ errors.phone }}</div>
                    </div>

                    <!-- Date of Birth Field -->
                    <div class="col-md-6 mb-3">
                        <label for="dob" class="form-label">Date of Birth</label>
                        <input v-model="formData.dob" type="date" id="dob" class="form-control" @blur="validateDob" />
                        <div class="text-danger" v-if="errors.dob">{{ errors.dob }}</div>
                    </div>

                    <!-- Gender Field -->
                    <div class="col-md-6 mb-3">
                        <label for="gender" class="form-label">Gender</label>
                        <select v-model="formData.gender" id="gender" class="form-select" @blur="validateGender">
                            <option value="" disabled>Select your gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <div class="text-danger" v-if="errors.gender">
                            {{ errors.gender }}
                        </div>
                    </div>
                </div>

                <div class="text-danger" v-if="formError">{{ formError }}</div>
                <div class="text-center">
                    <button type="submit" class="btn btn-custom fw-bold px-5">
                        Create Account
                    </button>
                </div>
                <div class="text-center mt-3">
                    <span class="fw-light">Already have an Account? </span>
                    <router-link to="/login" class="btn-link">Login</router-link>
                </div>
            </form>
            <div v-if="successMessage" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title">Congratulation!</h3>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <p class="text-center">{{ successMessage }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                name: "",
                email: "",
                password: "",
                phone: "",
                dob: "",
                gender: "",
            },
            errors: {
                name: "",
                email: "",
                password: "",
                phone: "",
                dob: "",
                gender: "",
            },
            formError: "",
            successMessage: null,
        };
    },

    methods: {
        validateName() {
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(this.formData.name)) {
                this.errors.name = "Name must contain only letters.";
            } else if (this.formData.name.length < 6) {
                this.errors.name = "Name must be at least 6 characters long.";
            } else {
                this.errors.name = "";
            }
        },

        validateEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            this.errors.email = !emailRegex.test(this.formData.email)
                ? "Enter a valid email address."
                : "";
        },

        validatePassword() {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            this.errors.password = !passwordRegex.test(this.formData.password)
                ? "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
                : "";
        },

        validatePhone() {
            const phoneRegex = /^[0-9]{10}$/;
            this.errors.phone = !phoneRegex.test(this.formData.phone)
                ? "Phone number must be 10 digits."
                : "";
        },

        validateDob() {
            const today = new Date();
            const dob = new Date(this.formData.dob);
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();

            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < dob.getDate())
            ) {
                age--;
            }

            if (!this.formData.dob) {
                this.errors.dob = "Date of Birth is required.";
            } else if (age < 18) {
                this.errors.dob = "You must be at least 18 years old.";
            } else {
                this.errors.dob = "";
            }
        },

        validateGender() {
            this.errors.gender = !this.formData.gender ? "Gender is required." : "";
        },

        handleSignup() {
            this.formError = "";
            this.errors = { name: "", email: "", password: "", phone: "", dob: "", gender: "" };

            this.validateName();
            this.validateEmail();
            this.validatePassword();
            this.validatePhone();
            this.validateDob();
            this.validateGender();

            if (Object.values(this.errors).some((error) => error)) {
                this.formError = "Please correct the highlighted fields.";
                return;
            }

            localStorage.setItem("userDetails", JSON.stringify(this.formData));
            this.successMessage = "You have successfully created an account!";
            this.resetForm();

            setTimeout(() => {
                this.closeModal();
                this.$router.push("/dashboard");
            }, 5000);
        },

        closeModal() {
            this.successMessage = null;
        },

        resetForm() {
            this.formData = { name: "", email: "", password: "", phone: "", dob: "", gender: "" };
            this.errors = { name: "", email: "", password: "", phone: "", dob: "", gender: "" };
            this.formError = "";
        },
    },
};
</script>

<style scoped>
.form-container {
    width: 100%;
    max-width: 800px;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin: 0 auto;
}

.btn.btn-custom {
    border: 3px solid;
    border-color: #247B7B;
    border-radius: 20px;
    min-width: 200px;
}

.btn.btn-custom:hover {
    background: #247B7B;
    color: white;
}

.btn-link {
    color: #247B7B;
    text-decoration: none;
    font-weight: bold;
}

.btn-link:hover {
    text-decoration: underline;
    color: #247B7B;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animated-form {
    animation: fadeInUp 0.8s ease-out;
}

.modal-backdrop {
    display: none;
}

.modal.show {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
}




/* Media Query */
@media (max-width: 576px) {
    .form-container {
        padding: 15px;
    }
}
</style>
