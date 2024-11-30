<template>
    <div class="coming-soon-container">
        <div class="coming-soon-content text-center">
            <v-icon size="64" color="primary" class="mb-4">mdi-cog-outline</v-icon>
            <h1 class="coming-soon-title mb-3">Account Settings</h1>
            <p class="coming-soon-text">We're building something special for you!</p>
            <div class="coming-soon-badge">Coming Soon</div>
        </div>
    </div>
</template>

<style scoped>
.coming-soon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
}

.coming-soon-content {
    max-width: 600px;
}

.coming-soon-title {
    color: #247B7B;
    font-size: 2.5rem;
    font-weight: bold;
}

.coming-soon-text {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
}

.coming-soon-badge {
    display: inline-block;
    background-color: #247B7B;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-weight: bold;
    font-size: 1.1rem;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

@media (max-width: 768px) {
    .coming-soon-title {
        font-size: 2rem;
    }
    
    .coming-soon-text {
        font-size: 1rem;
    }
}
</style> 