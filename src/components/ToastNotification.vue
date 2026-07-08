<script setup lang="ts">
const emit = defineEmits([ 'close-toast' ])

const notifs = defineProps({
    message: {
        type: String,
        required: true
    },
    showToast: {
        type: Boolean,
        required: true,
        default: false
    }
})
const closeToast = () => {
    emit('close-toast')
}
</script>
<template>
    <div v-if="notifs.showToast" class="toast-container">
        <!--New project added-->
        <div data-test="toast-notif" class="toast-content">
            <div class="toast-icon">
                <i id="check" class="fas fa-check-circle"></i>
            </div>
            <div class="toast-text">
                <h3>Success</h3>
                <p>{{ notifs.message }}</p>
            </div>
            <div class="toast-close">
                <i id="close" class="fas fa-times" @click="closeToast"></i>
            </div>
        </div>
    </div>
</template>
<style>
.toast-container {
    border-radius: 8px;
    width: fit-content;
}
.toast-content {
    display: flex;
    background: #fff;
    border-radius: 8px;
    padding: 0px 30px 0px 24px;
    gap: 20px;
    align-items: center;
    border-left: 6px solid rgb(116, 192, 252);

    position: absolute;
    top: 2%;
    right: 2.5%;
}
.toast-icon {
    font-size: 45px;
    position: relative;
}
.toast-text{
    position: relative;
    text-align: left;
    top: -10px;
    padding-left: 5px;
}
.toast-text h3{
    position: relative;
    top: 10px;
    font-size: x-large;
    margin: 15px 0px 23px 0px;
}
.toast-text p {
    position: inherit;
    top: -5px;
    margin-bottom: 5px;
    font-size: large;
    color: #3d3d3d;
}
#check {
    color: rgb(116, 192, 252);
}
#close {
    color: rgba(32, 32, 32, 0.416);
}
#close:hover {
    color: rgba(99, 98, 98, 0.416);
}
.toast-close {
    font-size: larger;
    position: relative;
    padding: 4px;
    cursor: pointer;
    padding-left: 50px;
    top: -10px
}
</style>