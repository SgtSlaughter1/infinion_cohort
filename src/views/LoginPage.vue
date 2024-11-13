<template>
    <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="form-container animated-form p-4 rounded shadow">
            <form @submit.prevent="handleSubmit">
                <h5 class="text-center mb-4">LOGIN</h5>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email" @input="validateEmail"
                        placeholder="email@gmail.com" />
                    <div class="text-danger" v-if="emailError">{{ emailError }}</div>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" v-model="password"
                        @input="validatePassword" placeholder="Enter your password" />
                    <div class="text-danger" v-if="passwordError">
                        {{ passwordError }}
                    </div>
                </div>
                <button type="submit" class="btn btn-custom w-100 fw-bold">Login</button>
                <div class="text-center mt-3">
                    <span class="fw-light">Don't have an Account? </span>
                    <router-link to="/signup" class="btn-link">Create an Account</router-link>
                </div>
            </form>
            <div class="mt-3 text-success text-center" v-if="successMessage">
                {{ successMessage }}
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../mock";

export default {
    data() {
        return {
            email: "",
            password: "",
            emailError: "",
            passwordError: "",
            successMessage: "",
            error: "",
            loading: false,
        };
    },
    methods: {
        validateEmail() {
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            this.emailError = "";

            if (this.email.trim() === "") {
                this.emailError = "Email address is required.";
            } else if (!gmailRegex.test(this.email)) {
                this.emailError = "Email address must be valid.";
            }
        },
        validatePassword() {
            const passwordRegex =
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            this.passwordError = "";

            if (this.password.trim() === "") {
                this.passwordError = "password is required.";
            } else if (!passwordRegex.test(this.password)) {
                this.passwordError =
                    "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.";
            }
        },

        async handleSubmit() {
            this.emailError = "";
            this.passwordError = "";
            this.successMessage = "";
            this.loading = false;

            this.validateEmail();
            this.validatePassword();

            if (!this.emailError && !this.passwordError) {
                this.loading = true;
                try {
                    const response = await axios.post("/api/login", {
                        email: this.email,
                        password: this.password,
                    });

                    if (response.data.message) {
                        this.successMessage = response.data.message;

                        const savedUser = localStorage.getItem("userDetails");
                        if (savedUser) {
                            const user = JSON.parse(savedUser);
                            this.successMessage = `Welcome back, ${user.name}!`;
                        }

                        this.email = "";
                        this.password = "";

                        setTimeout(() => {
                            this.loading = false;
                            this.successMessage = "";
                            this.$router.push("/dashboard/overview");
                        }, 2000);
                    } else {
                        this.emailError = response.data.message;
                    }
                } catch (err) {
                    this.error = err.response
                        ? err.response.data.message
                        : "Error occurred!";
                } finally {
                    this.emailError = "";
                    this.passwordError = "";
                }
            }
        },
    },
};
</script>

<style scoped>
.form-container {
    width: 100%;
    max-width: 500px;
    background-color: #f8f9fa;
}

.btn.btn-custom {
    border: 3px solid;
    border-color: #247B7B;
    border-radius: 20px;
}

.btn.btn-custom:hover {
    background-color: #247B7B;
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

/* Media Query */
@media (max-width: 576px) {
    .form-container {
        padding: 1.5rem;
        width: 90%;
    }
}

@media (min-width: 768px) {
    .form-container {
        padding: 2rem;
    }
}
</style>
