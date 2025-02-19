<template>

    <div class="loading">
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="loading-mask"></div>
    </div>
</template>
<style scoped>
.loading {
    width: 100vw;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 19;
}

.loading-mask {
    width: 100vw;
    height: 100%;
    position: fixed;
    background: rgb(var(--ex-bg-color-rgb) / 0.7);
    z-index: 20;
}

.lds-ring,
.lds-ring div {
    position: relative;
    z-index: 21;
    margin: 0 auto;
    text-align: center;
    box-sizing: border-box;
}

.lds-ring {
    display: inline-block;
    position: relative;
    width: 1.6rem;
    height: 1.6rem;
}

.lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 1.28rem;
    height: 1.28rem;
    margin: 0.16rem;
    border: 0.16rem solid var(--ex-primary-color);
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--ex-primary-color) transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
}

@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>