<template>
    <div>
        <!-- <div class="flex flex-col-reverse gap-10 md:flex-row justify-between bg-white max-w-screen-2xl" data-aos="fade-up" data-aos-delay="200"> -->
        <div class=" bg-black text-white">
            <div class="max-w-screen-2xl flex flex-col-reverse md:flex-row gap-10 justify-between p-8 w-full l my-0 mx-auto">
                <div class="">
                    
                    <ul class="list">
                        <li class="list_header">ApexTeks</li>
                        <li class="text-sm">
                            In Nigeria, the burgeoning tech industry holds immense promise for both companies seeking skilled professionals and individuals equipped with tech expertise. However, amidst this potential lies a challenge: unemployment among tech professionals persists, even as companies struggle to find the right talent for their projects. Enters Apex Technologies, a pioneering platform on a mission to revolutionize the tech employment landscape in Nigeria. 
                            Whether you're a company looking to expand your tech team or an IT professional seeking your next challenge, Apex Technologies invites you to join our growing community and be part of the future of tech employment in Nigeria. Together, we can unlock the full potential of Nigeria's tech industry and pave the way for a brighter, more prosperous future. 
                        </li>
                    </ul>
                    <div class="w-full flex items-start gap-8 mb-5">
                        <a href="#">
                            <i class="bi bi-linkedin"></i>
                        </a>

                        <a href="https://twitter.com/ApexTeks">
                            <i class="bi bi-twitter-x"></i>
                        </a>

                        <a href="https://instagram.com/apexteks">
                            <i class="bi bi-instagram"></i>
                        </a>
                    </div>
                </div>

                <div class="flex flex-row  flex-wrap gap-5">

                    <ul class="list">
                        <li class="list_header">Job by categories</li>
                        <li v-for="(job, index) in jobCategories.splice(0, 12)" :key="index">
                            <RouterLink to="/jobs">
                                {{ job.name }}
                            </RouterLink>
                        </li>
                    </ul>

                    <ul class="list">
                        <li class="list_header">Job by location</li>
                        <li v-for="(state, index) in availableStates" :key="index">
                            <RouterLink to="/jobs">
                                {{ `Jobs in ${state}` }}
                            </RouterLink>
                        </li>
                    </ul>

                    <ul class="list">
                        <li class="list_header">Quick Links</li>
                        <RouterLink to='/about'><li>About Us</li></RouterLink>
                        <RouterLink to='/vision'><li>Our Vision</li></RouterLink>
                        <li>Team</li>
                        <li>Careers</li>
                    </ul>
                </div>
            </div>
          
        </div>

            
    </div>
     <!-- MINI FOOTER STARTS HERE -->
     <div class=" p-3 w-full bg-[#EDEFF3] justify-center items-center text-sm flex flex-row gap-5">
            
            <div class="flex-row gap-3 hidden md:flex text-center justify-center items-center">
                <span>
                    <RouterLink to='/about'>About Us</RouterLink>
                </span>
                <span>
                    <RouterLink to='/privacy'>Privacy Policy</RouterLink>
                </span>
                <span>
                    <RouterLink to='/privacy'>Cookie Policy</RouterLink>
                </span>
                <span>
                    <RouterLink to='/privacy'>Billing/Payment T&Cs</RouterLink>
                </span>
                <span> 
                    <RouterLink to='/privacy'>Use of software T&Cs</RouterLink>
                </span>
                <span>
                    <RouterLink to='/FAQ'>FAQs</RouterLink>
                </span>
            </div>
            <p>&copy;2024 ApexTeks all rights reserved.</p>
    </div>
    
    <!-- MINI FOOTER ENDS HERE -->
</template>
<script>
import SiteLogo from './SiteLogo.vue';
import jobCategories from '../utils/jobCategories.json';

export default {
    name: "Footer",
    components: { SiteLogo },
    data(){
        return{
            jobCategories,

            availableStates: [
            "Lagos",
            "Abuja",
            "Rivers",
            "Kano",
            "Oyo",
            "Enugu",
            ],
        }
    }
}
</script>
<style scoped>
.section_title{
    @apply font-bold
}

.list{
    @apply text-left text-sm md:max-w-80
}
.list_header{
    @apply font-bold text-xl capitalize mb-3
}

li{
    @apply py-2
}
   
</style>