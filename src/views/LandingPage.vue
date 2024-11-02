<template>
    <div class="carousel-container">
        <div class="carousel">
            <div v-for="(image, index) in images" :key="index" :style="{ backgroundImage: `url(${image})` }"
                :class="{ 'carousel-item': true, active: index === currentIndex }"></div>
        </div>

        <div class="carousel-caption-overlay">
            <div class="content animate__animated animate__slideInLeft">
                <h3>Welcome to Cohort-3 campaign website</h3>
                <p>Experience the best moments with us!</p>
            </div>
            <router-link to="/login" class="btn custom-btn btn-lg">Get Stated</router-link>
        </div>
    </div>

    


</template>

<script>
export default {


    data() {
        return {

            images: [
                '/images/campaign12.png',
                '/images/campaign11.png',
                '/images/campaign10.avif',
                '/images/campaign2.avif',
                '/images/campaign3.avif',
                '/images/campaign5.jpg',
                '/images/campaign7.avif',
                '/images/campaign9.avif'
            ],
            currentIndex: 0,
            intervalTime: 2000,
        };
    },
    mounted() {
        this.startCarousel();
    },
    methods: {
        
        startCarousel() {
            setInterval(() => {

                this.currentIndex = (this.currentIndex + 1) % this.images.length;
            }, this.intervalTime);
        },
    },
};
</script>

<style>
.carousel-container {
    position: relative;
    width: 100%;
    height: 729px;
    overflow: hidden;
}

.carousel {
    position: absolute;
    width: 100%;
    height: 100%;
}

.carousel-item {
    min-width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 1s ease-in-out;
}

.carousel-item.active {
    opacity: 1;
}

.carousel-caption-overlay {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(36, 123, 123, 0.5);
    color: white;
    text-align: center;
    /* border: 1px solid aqua; */

}

.carousel-caption-overlay>div {
    margin-top: 250px;
}

.btn.custom-btn {
    border: 3px solid;
    border-color: #247B7B;
    color: white;
}

.btn.custom-btn:hover {
    background: #247B7B;
    color: white;
}


</style>
