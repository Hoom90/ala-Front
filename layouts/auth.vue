<script setup>

</script>
<template>
    <v-theme-provider>
        <v-layout>
            <v-row class="h-100 flex-md-row-reverse">
                <v-col cols="12" :md="8">
                    <div class="leftBox pa-3 pb-0 h-100">
                        <div class="leftBox-inner h-100 d-flex justify-center align-center flex-column">

                            <slot />
                            <nuxt-link to="/" class="pa-5">
                              <small>بازگشت به صفحه اصلی</small>
                            </nuxt-link>

                        </div>
                    </div>
                </v-col>
                <v-col :md="4" class="d-none d-md-block position-relative overflow-hidden">
                    <img src="@/assets/img/09.png" class="spin" width="1000" height="1000" />
                </v-col>
            </v-row>
        </v-layout>

    </v-theme-provider>
</template>


<style scoped>
.spin {
    position: absolute;
    top: 0;
    left: -390px;
    height: fit-content;
    -webkit-animation: spin 200s linear infinite;
    -moz-animation: spin 200s linear infinite;
    animation: spin 200s linear infinite;
}

.spin img {
    width: 900px;
    height: 900px;
}

@-moz-keyframes spin {
    100% {
        -moz-transform: rotate(360deg);
    }
}

@-webkit-keyframes spin {
    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}</style>
