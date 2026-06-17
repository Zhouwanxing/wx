<template>
    <Teleport to="body">
        <Transition name="alert">
            <div v-if="visible" class="alert-overlay" @click.self="close">
                <div class="alert-modal" role="alertdialog" aria-modal="true">
                    <div class="alert-icon-wrap" :class="type">
                        <svg v-if="type === 'error'" class="alert-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M12 8v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <circle cx="12" cy="16" r="0.75" fill="currentColor"/>
                        </svg>
                        <svg v-else class="alert-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M12 8v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <circle cx="12" cy="16" r="0.75" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3 v-if="title" class="alert-title">{{ title }}</h3>
                    <p class="alert-message">{{ message }}</p>
                    <button type="button" class="alert-btn" @click="close">知道了</button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script>
export default {
    props: {
        visible: Boolean,
        message: String,
        title: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'error'
        }
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.alert-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.alert-modal {
    width: 100%;
    max-width: 320px;
    padding: 28px 24px 24px;
    text-align: center;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow:
        0 20px 50px rgba(49, 46, 129, 0.25),
        0 8px 24px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.alert-icon-wrap {
    width: 56px;
    height: 56px;
    margin: 0 auto 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.alert-icon-wrap.error {
    background: linear-gradient(135deg, rgba(254, 226, 226, 0.9) 0%, rgba(254, 202, 202, 0.7) 100%);
    color: #dc2626;
    box-shadow: 0 4px 14px rgba(220, 38, 38, 0.15);
}

.alert-icon-wrap.info {
    background: linear-gradient(135deg, rgba(224, 231, 255, 0.9) 0%, rgba(199, 210, 254, 0.7) 100%);
    color: #4338ca;
    box-shadow: 0 4px 14px rgba(67, 56, 202, 0.15);
}

.alert-icon {
    width: 28px;
    height: 28px;
}

.alert-title {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 700;
    color: #1e1b4b;
    letter-spacing: 0.02em;
}

.alert-message {
    margin: 0 0 24px;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(30, 27, 75, 0.72);
}

.alert-btn {
    width: 100%;
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #312e81 0%, #4338ca 100%);
    color: rgba(255, 255, 255, 0.95);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 12px rgba(67, 56, 202, 0.35);
}

.alert-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(67, 56, 202, 0.4);
}

.alert-btn:active {
    transform: translateY(0) scale(0.98);
}

/* 入场 / 退场动画 */
.alert-enter-active,
.alert-leave-active {
    transition: opacity 0.25s ease;
}

.alert-enter-active .alert-modal,
.alert-leave-active .alert-modal {
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.alert-enter-from,
.alert-leave-to {
    opacity: 0;
}

.alert-enter-from .alert-modal,
.alert-leave-to .alert-modal {
    opacity: 0;
    transform: scale(0.88) translateY(12px);
}
</style>
