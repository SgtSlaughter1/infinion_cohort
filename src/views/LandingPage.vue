<template>
    <div class="carousel-container">
        <div class="carousel">
            <div v-for="(image, index) in images" :key="index" :style="{ backgroundImage: `url(${image})` }"
                :class="{ 'carousel-item': true, active: index === currentIndex }"></div>
        </div>

        <div class="carousel-caption-overlay">
            <div class="content animate__animated animate__slideInDown">
                <h1>Welcome to Scrutz</h1>
                <h6>Do you have a campaign and you do not know how to go about it ? <br>Trust us with your campaign and we will give you the very best experience.</h6>
                <!-- <img src="/images/arrowdown.svg"/> -->
            </div>
            <router-link to="/login" class="btn custom-btn btn-lg  animate__animated animate__slideInUp mt-4">Get Started</router-link>
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
    height: 100vh;
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
    background: rgba(0, 0, 0, 0.7);
    color: white;
    text-align: center;
    /* border: 1px solid aqua; */

}

.carousel-caption-overlay>div {
    margin-top: 290px;
}

.btn.custom-btn:hover {
    border: 3px solid;
    border-color: #247B7B;
    color: white;
}

.btn.custom-btn {
    background: #247B7B;
    color: white;
}


</style>
