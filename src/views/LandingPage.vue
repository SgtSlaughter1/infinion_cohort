<template>
    <div class="container-fluid">
        <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="/images/campaign.avif" class="d-block w-100" />
                </div>
                <div class="carousel-item">
                    <img src="/images/campaign10.avif" class="d-block w-100" />
                </div>
                <div class="carousel-item">
                    <img src="/images/campaign2.avif" class="d-block w-100" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoginPage from "./LoginPage.vue";

export default {
    components: { LoginPage },
};
</script>

<style lang="scss" scoped></style>
