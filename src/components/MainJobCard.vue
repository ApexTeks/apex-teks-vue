<template>
    <div>
        <div  class="flex flex-col justify-between border p-3 rounded-md text-left gap-3 hover:border-tz_blue dark:border-gray-600  dark:bg-[#1F2A36] dark:hover:border-[#769BBF]">

            <div v-if="is_flagged" class="text-gray-400">
               {{ job_title }}
            </div>

            <div v-else @click="previewJob" class="flex flex-col gap-3">
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between items-start">
                        <span class="font-bold">
                            <RouterLink :to="'/in/jobs/' + job_id + '/application'"> {{ job_title }}</RouterLink>
                        </span>
                        <div class="text-lg gap-3 flex flex-row-reverse items-center pl-5">
                            <slot name="save-button">
                                <i class="bi bi-bookmark-check"></i>
                            </slot>
                            <slot name="flag-job">
                                    <i class="bi bi-hand-thumbs-down"></i>
                            </slot>
                        </div>
                    </div>
                    <div class=" capitalize flex flex-row gap-3">
                        <span>{{ company }}</span>
                        <!-- <span>{{ rating }}.0 stars</span> -->
                    </div>
                    <div>
                        <i class="bi bi-geo-alt"></i> 
                        <span>
                            <slot v-if="!remote" name="job-location">job location here..</slot>
                            <span v-else>remote</span>
                        </span>
                    </div>
                </div>
            
                <div class="flex flex-row gap-2">
                    <span class=" bg-tz_light_blue p-2 rounded-md">
                        <i class="bi bi-wallet"></i> <span>₦{{ budget }}</span>
                    </span>
                    <span class=" bg-tz_blue p-2 rounded-md text-white">
                        <i class="bi bi-briefcase"></i> <span>{{ period }}</span>
                    </span>
                </div>


                <div class="">
                    <slot name="job-description">
                        Sample job description
                    </slot>
                </div>

                <div class="text-[12px] text-tz_blue flex flex-row justify-between items-center">
                    <slot name="job-posting-time">Posted 1 hour ago</slot>
                    <span v-if="is_applied" class="px-3 py-1 bg-green-500 rounded-lg text-white">applied</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { stringify } from 'postcss';

export default {
    name: "MainJobCard",
    data(){
        return{
            saved: false,
        }
    },
    props: {
        budget: Number,
        period: String,
        company: String,
        rating: Number,
        remote: Boolean,
        is_applied: Boolean,
        job_is_saved: Boolean,
        is_flagged: Boolean,
        job_id: String,
        job_title: String,
       
    },
    methods: {
        saveJob(){
            this.$emit('saveJob');
            this.saved = !this.saved;
        },

        flagJob(){
            this.$emit('flagJob')
        },

        previewJob(){
            this.$emit('previewJob');
        }
    }
}
</script>
<style scoped>
    .icon_btn{
        @apply p-2 hover:bg-tz_light_blue h-10 w-10 rounded-full
    }
</style>