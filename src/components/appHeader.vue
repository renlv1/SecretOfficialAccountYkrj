<template>
    <div class="app-header">
        <div class="back" v-show="!hideReturn" @click="goBack" :class="{whiteBack: white}"></div>
        <div class="title">
            <template v-if="title">
                {{title}}
            </template>
            <slot v-else></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                backFlag: false // 判断backIcon是返回home还是上一级(true为home， false为上一级)
            }
        },
        props: {
            white: {
                type: Boolean,
                default: false
            },
            isGoNumber: {
                type: Boolean,
                default: false
            },
            to: String,
            title: String,
            hideReturn: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            this.checkCurrentPath()
        },
        methods: {
            checkCurrentPath() {
                if (this.$route.path === '/WaitUnlock' || this.$route.path === '/WaitActive' || this.$route.path === '/activated' || this.$route.path === '/WaitConfirmed' || this.$route.path === '/completed') {
                    this.backFlag = true
                } else {
                    this.backFlag = false
                }
            },
            goBack() {
                if (this.backFlag) {
                    this.$router.push('/home')
                }  else if (this.to) {
                    this.$router.replace(this.to)
                } else {
                    this.$router.go(-1)
                }
            },
        }
    }
</script>
