<template>
<SessionExpiredModal v-if="session_expired_modal"/>
<!-- <p v-if="user">{{ user.email_verified }}</p> -->

<div v-if="email_verified == false" class=" bg-[rgb(0,0,0,75%)] dark:bg-[rgba(0,0,0,75%)] h-screen w-screen fixed left-0 z-20 flex flex-col justify-center items-center top-0 p-5">
    <div v-if="sent_verification_mail" class="p-12 rounded-lg bg-white dark:bg-gray-800 max-w-[600px] text-center flex flex-col gap-4 justify-center items-center">
        <i class="bi bi-send-check-fill text-6xl text-green-300"></i>
        <h1 class="text-3xl font-extrabold">Verification Email Sent</h1>
        <p>A verification email has been sent to <b>sample@mail.com</b>. Please check your mailbox to verify your account before you can continue</p>
        <small class="text-blue-300">Please kindly refresh the browser after verifying your email.</small>
        <!-- <button class="btn w-fit mt-4">Send verification email</button> -->
    </div>
    <div v-else class="p-12 rounded-lg bg-white dark:bg-gray-800 max-w-[600px] text-center flex flex-col gap-4 justify-center items-center">
        <i class="bi bi-exclamation-triangle-fill text-6xl text-yellow-300"></i>
        <h1 class="text-3xl font-extrabold">Please verify your email to continue using our platform</h1>
        <p>To keep thing secure and make sure your account is protected please verify your email using the button below</p>
        <button @click="sendVerificationMail()" :disabled="sending_email" class="btn mt-4 w-full">
            <span v-if="sending_email" class="p-2"><SpinnerComponent/></span>
            <span v-else>Send verification email</span>
        </button>
    </div>
    
</div>

<!-- {{ email_verified }} -->
<!-- <div>{{ REALTIME_NOTIFICATION }}</div> -->
<div class="bg-transparent border-b dark:border-gray-600">
        <!-- THE DUMMY NAVBAR BELOW SHOWS AS A LOADER ONLY WHEN USER INFO IS NOT AVAILABLE -->
      

        <FullPageLoading  v-if="is_authenticated && !user"/>

        <!-- NAVBAR FOR MAIN APPLICATION AND AUTHENTICATED USERS -->
            <!-- this navbar here displays only on mobile view -->
        
            <div v-if="mobile_nav && user" class="flex flex-col fixed h-screen bg-white top-0 left-0 w-screen z-30 md:hidden py-8 px-4 dark:bg-[#1F2A36] dark:text-white">
                <button @click="mobile_nav = !mobile_nav" class=" text-3xl absolute right-5 top-4">
                    <span class="">
                        <i class="bi bi-x"></i>
                    </span>
                </button>
            
                <div class="text-center">
                <div class="flex flex-col text-left gap-2 mt-8 w-full p-2 " @click="mobile_nav = !mobile_nav" v-if="user_type == 'user'">
                    <RouterLink to="/in/jobs" class="nav_link">Work Explorer</RouterLink>

                    <RouterLink to="/in/saved" class="nav_link">Saved Jobs</RouterLink>

                    <RouterLink to="/in/messages" class="nav_link">Messages</RouterLink>

                    <RouterLink to="/in/contracts" class="nav_link">Contracts</RouterLink>

                    <RouterLink :to="'/in/users/' + user._id" class="nav_link">My Profile</RouterLink>

                    <RouterLink to="/in/applications" class="nav_link">My Applications</RouterLink>

                    <RouterLink to="/in/overview" class="nav_link">Overview</RouterLink>

                    <RouterLink to="/in/notifications" class="nav_link">Notifications</RouterLink>

                    <RouterLink to="/in/settings" class="nav_link">Settings</RouterLink>

                    <RouterLink to="/support" class="nav_link">Help & Support</RouterLink>
                </div>
                <div class="flex flex-col text-left gap-2 mt-8 w-full p-2 " @click="mobile_nav = !mobile_nav" v-if="user_type == 'employer'">
                    <RouterLink to="/client/dashboard" class="nav_link">Dashboard</RouterLink>
                    <RouterLink to="/client/jobs" class="nav_link">My Jobs</RouterLink>
                    <RouterLink to="/messages" class="nav_link">Messages</RouterLink>
                    <RouterLink to="/client/profile" class="nav_link">My Profile</RouterLink>
                    <RouterLink to="/client/contracts" class="nav_link">Contracts & Hires</RouterLink>
                    <RouterLink to="/client/billings" class="nav_link"><i class="bi bi-compass"></i> Billings & payments</RouterLink>
                    <RouterLink to="/client/settings" class="nav_link"> Settings</RouterLink>

                </div>

                    <button @click="logout" class="menu_item mt-5"><i class="bi bi-box-arrow-right"></i> Logout</button>
                    
                
                </div>
            </div>

            <nav v-if="user">
                <div class="flex flex-row w-full justify-between p-3 items-center">
                    
                    <SiteLogo/>

                    <!-- <div @submit.prevent="searchJob" class="border rounded-md hidden md:flex flex-row items-center h-12 overflow-hidden"> -->
                    
                    <!-- ADD Link to search page to redirect on click -->
                    <RouterLink to="/client/search">
                        <div class="border rounded-md hidden md:flex flex-row items-center h-12 overflow-hidden dark:border-gray-600">
                            <input type="search" :placeholder="user.role == 'user' ? 'Search for jobs':'Search for Talents'" v-model="job_search" class="p-3 bg-slate-100 border-none form_input">
                            <button @click="handleSearch" class="flex flex-row gap-2 border-l dark:border-gray-600 h-full px-3 items-center hover:bg-slate-50 dark:hover:bg-tz_light_blue">
                                <i class="bi bi-search"></i>
                                <span>Search</span>
                            </button>
                        </div>
                    </RouterLink>

                    <div  v-if="user" class="flex flex-row items-center gap-3">
                        <button @click="updateTheme" class="p-2 md:hidden rounded-full w-10 h-10 dark:bg-gray-700 bg-gray-200 flex justify-center items-center">
                            <span>
                                <span class="dark:hidden">
                                    <i class="pi pi-sun"></i>
                                </span>
                                <span class="hidden dark:inline-block">
                                    <i class="pi pi-moon"></i>
                                </span>
                            </span>
                        </button>
                        <div class="relative">
                            <!-- <div class=" h-3 w-3 flex justify-center items-center text-white  rounded-full bg-red-600 absolute right-[0] top-0 z-10" v-if="notifications && notifications.length > 0"></div> -->
                            
                            <!-- NOTIFICATION MENU AND BELL ICON AS TRIGGER -->
                            <CustomDropdown>
                                <template #trigger>
                                    <div class="relative">
                                        <div v-if="REALTIME_NOTIFICATION.length > 0" class="p-2 !size-5 flex justify-center items-center bg-blue-500 rounded-full absolute z-10 -right-1 -top-1 text-sm text-white">
                                            {{ REALTIME_NOTIFICATION.length }}
                                        </div>
                                        <i class="bi bi-bell border-2 rounded-full h-10 w-10 flex dark:border-gray-400 justify-center items-center relative group/notifications " ></i>
                                    </div>
                                </template>
                                <template #menu>
                                    <div class=" max-w-[350px] w-[250px] border bg-white rounded-lg p-1 flex  flex-col gap-2 z-50 dark:bg-[#1F2A36] dark:border-gray-600 ">
                                        <span class="text-center p-2 border-b w-full dark:border-gray-600">Notifications</span>
                                        <div class=" max-h-[250px] overflow-y-auto">
                                            <div v-for="(notification, notify_id) in notifications.slice(0,3)" :key="notify_id" class="flex flex-row p-3 hover:bg-slate-50 rounded-md gap-3 justify-start items-start group/notify dark:hover:bg-tz_light_blue relative">
                                                <div class="text-xl">
                                                    <i class="bi bi-gift-fill" v-if="notification.type == 'contract'"></i>
                                                    <i class="bi bi-briefcase-fill" v-if="notification.type == 'job'"></i>
                                                    <i class="bi bi-person-fill" v-if="notification.type == 'account'"></i>
                                                    <i class="bi bi-cash-stack" v-if="notification.type == 'payment'"></i>
                                                    <i class="bi bi-chat-left-text-fill" v-if="notification.type == 'message'"></i>
                                                    <img src="../assets/images/dot_logo.svg" class=" !size-5" v-if="notification.type == 'platform'"/>
                                                </div>

                                                <!-- LINK FOR USERS -->
                                                <RouterLink v-if="user.role == 'user'" :to="`/in${notification.link_url}`" target="_blank">
                                                    <div class="flex flex-col gap-2 w-[90%]">
                                                        <span class="text-sm font-bold">{{  notification.message }}</span>
                                                        <span class="text-sm text-gray-400">{{ realTimeFormat(notification.createdAt)  }}</span>
                                                    </div>
                                                </RouterLink>

                                                <!-- LINK FOR EMPLOYERS -->
                                                <RouterLink v-else :to="`/client${notification.link_url}`" target="_blank">
                                                    <div class="flex flex-col gap-2 w-[90%]">
                                                        <span class="text-sm font-bold">{{  notification.message }}</span>
                                                        <span class="text-sm text-gray-400">{{ realTimeFormat(notification.createdAt)  }}</span>
                                                    </div>
                                                </RouterLink>

                                                <button @click="markNotificationAsRead(notification._id, notify_id)" class="text-lg font-bold hidden group-hover/notify:block absolute top-2 right-2">
                                                    <span>
                                                        <i class="bi bi-x"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        <div class=" text-center text-gray-400 h-[150px] flex flex-col justify-center items-center" v-if="notifications.length == 0">
                                            <i class="bi bi-bell text-3xl"></i>
                                            <p class="text-xl font-bold">You are all caught up</p>
                                            <span>No new notifications</span>
                                        </div>

                                        <RouterLink v-if="user.role == 'user'" to="/in/notifications" class="text-center border-t p-3 dark:border-gray-600">
                                                <span class="text-center text-tz_blue">see all notifications</span>
                                        </RouterLink>
                                        <RouterLink v-else to="/client/notifications" class="text-center border-t p-3 dark:border-gray-600">
                                                <span class="text-center text-tz_blue">see all notifications</span>
                                        </RouterLink>
                                    </div>
                                </template>
                            </CustomDropdown>
                            
                        </div>
                        
                        <i class="bi bi-three-dots-vertical"></i>
                        <div class="flex flex-row items-center gap-3 relative group">
                            <!-- USER MENU AND PROFILE IAMGE AS TRIGGER -->
                            <CustomDropdown>
                                <template #trigger>
                                    <img @click="mobile_nav = !mobile_nav" v-if="user.role == 'user' && user.profile.image_url" alt="profile image" :src="user.profile.image_url" class=" rounded-full h-9">
                                    <div @click="mobile_nav = !mobile_nav" v-else class="rounded-full h-9 w-9 flex font-bold justify-center cursor-pointer items-center bg-slate-200 text-slate-600">{{ user.firstname[0] }}{{ user.lastname[0] }}</div>
                                </template>
                                <template #menu>
                                    <UserDropDownMenu class=" hidden md:block" :username="user.firstname + ' ' + user.lastname" :email="user.email"/>
                                </template>
                            </CustomDropdown>
                        </div>
                    </div>
                </div>
            </nav>
            <div v-if="!is_authenticated && !user" class=" bg-white dark:bg-[#131920] border-b border-gray-200  dark:border-gray-600">
                <HomeNavbar />
            </div>
            
</div>

 <!-- ACCOUNT WARNINGS -->
 <div v-if="user && user.role == 'user' && !user.settings.KYC.is_verified" class="p-3 bg-red-500 text-white flex flex-row flex-wrap justify-between items-center">
    <div class="container">
        <i class="bi bi-exclamation-triangle-fill mr-3"></i>
        <span>Please verify your account to avoid account restriction</span>
    </div>
    <RouterLink to="/in/settings?tab=verification">
        <button class="p-2 border rounded-md">Verify now</button>
    </RouterLink>
</div>

</template>

<!-- briefcase -->
<!-- gift -->
 <!-- person -->
  <!-- cash-stack -->
   <!-- chat-left-text -->
<script>
import { formatToRelativeTime } from '@/utils/dateFormat';
import SiteLogo from './SiteLogo.vue';
import UserDropDownMenu from './UserDropDownMenu.vue';
import axios from 'axios'
import { io } from 'socket.io-client';

import SessionExpiredModal from './SessionExpiredModal.vue'
import HomeNavbar from './HomeNavbar.vue';

import CustomDropdown from '../components//CustomDropdown'

import Skeleton from 'primevue/skeleton';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import FullPageLoading from '@/components/FullPageLoading.vue'


export default {
    name: "Navbar",
    components: { 
        SiteLogo, 
        UserDropDownMenu, 
        SessionExpiredModal,
        HomeNavbar, 
        CustomDropdown,
        Skeleton,
        SpinnerComponent,
        FullPageLoading
    },
    props: {
        type: String,
        jobs_from_search: '',
    },
    data() {
        return {
            nav_visible: false,
            left_nav_open: false,

            notify_menu: false,
            user_menu: false,

            user: null,
            loading: null,

            notifications: '',
            mobile_nav: false,
            headers: {
                Authorization: `JWT ${localStorage.getItem('life-gaurd')}`
            },
            job_search: '',

            is_authenticated: false,

            user_type: '',
            session_expired_modal: false,

            REALTIME_NOTIFICATION: [],

            socket: io(this.api_url.split('/').slice(0, 3).join('/'), { autoConnect: true}),

            email_verified: null,
            sent_verification_mail: false,
            sending_email: false,

      

            
        };
    },

    sockets: {
        connect() {
            console.log('Connected to server');
        },
        disconnect() {
            console.log('Disconnected from server');
        },
    },

    methods: {
        getNotified(){
            this.socket.on(`notification_${this.user._id}`, (notification) => {
                this.REALTIME_NOTIFICATION.push(notification.message);
                // get user notification and display in notification drop-down
                this.getNotifications();
                console.log("new notification for you: ", notification)
            });
        },
        toggleNavbar(){
            this.left_nav_open = !this.left_nav_open;
            this.$emit('toggle-nav');
        },

        closeDropdown(){
            this.notify_menu = false;
        },

        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true, // Use 12-hour format
            };
            return date.toLocaleDateString(undefined, options);
        },

        async getUserData(){
            try{
                 // Get the token from localStorage
                const token = localStorage.getItem('life-gaurd');
                const headers = {
                    Authorization: `JWT ${token}`, // Assuming it's a JWT token
                };

                const response = await axios.get(`${this.api_url}/user`, { headers });
                this.user = response.data.user;
                this.user_type = response.data.user.role;
                // if(this.user){
                    this.socket.emit('join', `user_${this.user._id}`);
                    this.getNotified();
                // }

                this.email_verified = response.data.user.email_verified;
            }
            catch(error){
                console.log("error from navbar :", error);
                if(error.response.status == '401' && localStorage.getItem('life-gaurd')){
                    
                    localStorage.removeItem('life-gaurd');
                    this.session_expired_modal = true;
                }
            }
        },

        async getNotifications(){
            const headers = this.headers;
            try{
                const response = await axios.get(`${this.api_url}/notifications/unread`, { headers } )
                // console.log("user notifications: ", response);
                this.notifications = response.data.notifications.reverse();

            }catch(error){
                console.log(error);
            }
        },

        async markNotificationAsRead(notification_id, index){
            console.log(notification_id);

            this.notifications.splice(index, 1);
            console.log("removed notifications: ", notification_id, " index: ", index);
            if(this.notifications.length <= 0) {
                this.REALTIME_NOTIFICATION = []
            };

            const headers = this.headers;
            try{
                const response = await axios.post(`${this.api_url}/notifications/${notification_id}/read`, {}, { headers });
                console.log(response);
                this.getNotifications();
            }catch(error){
                console.log("error marking notification as read...", error)
            }
        },

        async searchJob(){
            try{
                const response = await axios.get(`${this.api_url}/jobs/search`, {
                params: {
                    keywords: this.job_search,
                }});

                console.log(response);
                this.jobs_from_search = response.data.jobs;
                this.$router.push('/jobs');

            }catch(error){
                console.log(error)
            }
        },

        async sendVerificationMail(){
            try{
                const email = this.user.email;
                this.sending_email = true;
                const response = await axios.post(`/email/${email}/send`, {}, { headers:this.headers });
                this.sent_verification_mail = true;
                this.sending_email = false;

            }catch(error){
                this.sending_email = false;
                console.log("error sending: ", error);
            }
        },

        handleSearch() {
            this.$emit('search', {
                keywords: this.job_search
        })},

        logout(){
            localStorage.removeItem("life-gaurd");
            localStorage.removeItem("theme");
            this.$router.push('/login');
            window.location.reload();
        },

        updateTheme(){
            if(localStorage.theme == 'light'){
                // dark_mode(){
                    localStorage.setItem('theme', 'dark');
                    document.documentElement.classList.add("dark");
                    this.theme = true;
                // };
            } else {
                localStorage.setItem('theme', 'light');
                document.documentElement.classList.remove("dark");
                this.theme = false;
            }
        },

        realTimeFormat(time){
            return formatToRelativeTime(time)
        },

    },
    created(){
        this.getUserData();
        this.getNotifications();

        if(localStorage.getItem('life-gaurd')){
            this.is_authenticated = true;
        };

      
        
    },

    mounted() {
        // if(this.REALTIME_NOTIFICATION){
        //     this.getNotifications();
        // }
    },

    unmounted() {
        // this.stopNotifications();
    },
}
</script>
<style scoped>
    .nav_btn{
        @apply px-5 py-2 font-bold;
    }

    .nav_link{
        @apply p-3 rounded-md hover:bg-tz_light_blue font-medium hover:font-bold;
    }

    .menu_item{
    
    }

    @keyframes skeletonLoading {
    0% {
        opacity: 0.4;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.4;
    }
    }

    .skeleton {
    animation: skeletonLoading 1.5s infinite;
    }
    
</style>