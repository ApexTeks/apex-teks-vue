    <template>

        <!-- PROFILE EDIT MODAL HERE -->
        <Modal :name="'Edit your profile'" :modal_active="profile_edit_menu">
                <template #body>
                    <div>
                    <form @submit.prevent="updateUserProfile" v-if="user">
                        <div>
                            <div class="flex flex-row gap-3 mb-3">
                                <div class="w-3/6 flex flex-col">
                                    <label for="firstname">firstname</label>
                                    <input class="form_input " type="name" name="firstname" id="firstname" :value="user.firstname" disabled>
                                </div>

                                <div class="w-3/6 flex flex-col">
                                    <label for="firstname">lastname</label>
                                    <input class="form_input" type="name" name="lastname" id="lastname" :value="user.lastname" disabled>
                                </div>
                            </div>

                            <div class="form-section">
                                <div class="form-control">
                                    <label for="email">email</label>
                                    <input class="form_input" type="email" name="email" id="email" :value="user.email" disabled>
                                </div>
                            </div>

                            <div class="form-section">
                                <div class="form-control">
                                    <label for="title">profile title</label>
                                    <input class="form_input" type="text" name="title" id="title" v-model="user_form.profile.title" placeholder="Expereinced Copywriter">
                                </div>
                                <div class="form-control">
                                    <label for="bio">profile bio</label>
                                    <textarea class="form_input h-40 max-h-52" type="text" name="bio" id="bio" v-model="user_form.profile.bio" placeholder="A very brief and descriptive bio"></textarea>
                                </div>
                            </div>

                            <div class="form-section">
                                <div class="form-control">
                                    <label for="skills">skills & expertise</label>
                                    <input class="form_input" type="text" name="skills" id="skills" v-model="user_form.profile.skills" placeholder="Copy writing, Technical writing, Graphic Design">
                                </div>
                            </div>


                            <div class="form-section">
                            

                                <div class="form-control">
                                    <label for="phone">phone</label>
                                    <input class="form_input" type="phone" name="phone" id="phone" v-model="user_form.profile.phone" placeholder="+2348156074667">
                                </div>

                                <div class="form-control">
                                    <label for="phone">social</label>
                                    <input class="form_input" type="text" name="social" id="social" v-model="user_form.profile.social" placeholder="https://facebook.com/johndoe">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            
                </template>
                <template #footer>
                    <button @click="updateUserProfile" type="button" class="btn" :buttonText="'save'" :loading="user_form.loading">Save</button>
                </template>
        </Modal>

        <!-- PROFILE IMAGE UPLOAD MODAL -->
        <Modal :name="'Upload a profile image'" :modal_active="profile_image_menu">
            <template #body>
                <div class="flex flex-row flex-wrap gap-5 p-8 justify-center items-center">
                    <div class="flex flex-col">
                        <!-- <h1 class="font-bold text-xl mb-3">Edit Photo</h1> -->
                        <cropper
                            ref="cropper"
                            class="cropper h-[300px] w-[300px] bg-gray-400 rounded-full"
                            :src="image.src"
                            :stencil-component="$options.components.CircleStencil"
                            :stencil-props="{
                                handlers: {},
                                movable: false,
                                resizable: false,
                                aspectRatio: 1,
                                handlerClasses: {
                                    default: 'handler',
                                },
                                previewClass: 'preview'
                            }"
                            :debounce="false"
                            :stencil-size="{
                                width: 280,
                                height: 280
                            }"
                            :resize-image="{
                                adjustStencil: false
                            }"
                            image-restriction="stencil"
                            @change="change"
                        />
                        <div v-if="image.src" class=" flex flex-row justify-center mt-3 gap-3">
                            <button @click="zoomIn" class="btn"><i class="bi bi-zoom-in"></i></button>
                            <button @click="zoomOut" class="btn"><i class="bi bi-zoom-out"></i></button>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3">
                        <h1 class="text-2xl ">Show Employers<br/> the best version of yourself!</h1>
                        <div  class="flex flex-row gap-3 mt-6">
                            <preview class="bg-gray-400 rounded-full"
                                :width="150"
                                :height="150"
                                :image="result.image"
                                :coordinates="result.coordinates"
                            />
                            <preview class="rounded-full bg-gray-400"
                                :width="75"
                                :height="75"
                                :image="result.image"
                                :coordinates="result.coordinates"
                            />
                            <preview class="rounded-full bg-gray-400"
                                :width="37.5"
                                :height="37.5"
                                :image="result.image"
                                :coordinates="result.coordinates"
                            />
                        </div>
                        <p class="text-blue-500">Must be an actual photo of you (showing your face particularly).<br/>
    Logos, clip-art, group photos, and digitally-altered images are not allowed.</p>
                    </div>
                
                </div>
                
               
                
                
            </template>
            <template #footer>
                <div class="flex flex-row gap-3">
                    <input type="file" ref="file" @change="loadImage($event)" class="hidden" accept="image/*">
                    <button class="border border-tz_blue p-3 rounded-md" @click="$refs.file.click()">Change image </button>
                    <button class="btn" @click="uploadProfileImage">
                        <span v-if="!image_uploading">Save photo</span>
                        <span v-else>Working...</span>
                    </button>
                </div>
            </template>
        </Modal>

        <!-- USER RESUME UPLOAD MODAL -->
        <Modal v-if="user" :title="`${user.firstname} ${user.lastname} Resume`" :modal_active="resume_upload_menu">
                <template #body>
                    <div class="md:w-[500px]">
                        <div class="flex flex-row gap-3">
                            <i class="bi bi-file-earmark-pdf-fill text-6xl text-red-500"></i>
                            <div v-if="user.portfolio_url" class="py-5">
                                Current Resume: <a :href="user.portfolio_url" target="_blank" class="text-blue-400">Download</a>
                            </div>
                        </div>
                        
                        <FileUpload v-if="isAllowed" accept="application/pdf,image/*,.doc,.docx,.pdf" name="file" :url="`${api_url}/profile/resume`" :withCredentials="true" @before-send="addHeaders"
                        :file-limit="1" 
                        :multiple="false" 
                        :show-cancel-button="false"
                        :accept="''" :maxFileSize="5000000">
                            <template #empty>
                                <p>Drag and drop files to here to upload.</p>
                            </template>
                        </FileUpload>
                        
                    </div>
            
                </template>
                <template #footer>
                    <!-- <LoaderButton @click="updateUserProfile" type="button" class="btn" :buttonText="'upload'" :loading="user_form.loading"></LoaderButton> -->
                </template>
        </Modal>

        <PageTitle>Profile</PageTitle>
        <div class="h-full flex flex-col relative">
            

            <FullPageLoading v-if="!user"/>

            <div v-if="user" class="p-5 flex flex-col items-center gap-8 h-full ">

                <div class="flex w-full rounded-xl relative justify-evenly items-start md:items-center  flex-col md:flex-row p-4 xl:w-3/4 border  dark:border-gray-600 ">
                    <div class="flex flex-row justify-start md:justify-start items-center p-5 gap-3 flex-wrap">
                        <div v-if="user.profile.image_url" :style="`background-image: url(${user.profile.image_url})`" class=" group relative h-28 w-28 rounded-full border-4 outline outline-tz_blue bg-cover">
                                <div v-if="isAllowed" class="bg-black absolute top-0 bottom-0 h-full w-full rounded-full hidden justify-center items-center opacity-70 group-hover:flex cursor-pointer text-white" @click="profile_image_menu = !profile_image_menu">
                                    <i class="bi bi-camera text-2xl"></i>
                                </div>
                            </div>
                            <!-- <img v-if="user.profile.image_url" alt="profile image" :src="user.profile.image_url" class=" h-28 w-28 rounded-full"> -->
                        
                        <div class="flex flex-col items-start text-start">
                            <h1 class="font-bold text-4xl flex flex-row items-center gap-1">{{ user.firstname }} {{ user.lastname }}
                                <i v-if=" user.settings.KYC.is_verified" class="text-[25px] text-blue-500 bi bi-patch-check-fill" ></i>
                            </h1>
                            <h2 class="text-sm text-gray-500">{{ user.profile.title }}</h2>
                            <p>{{ user.email }}</p>
                            <div clas="flex flex-row gap-3">
                                <p class="inline-block mr-2 text-tz_blue" v-html="generateStarRatingFromInteger(user.rating)"></p>
                                <span>({{ user.rating }}) {{ user.rating_count }} reviews</span>
                            </div>
                            <div v-if="user" class="flex flex-row flex-wrap gap-3 mt-3">
                                <button v-if="isAllowed" class="btn" @click="profile_edit_menu = !profile_edit_menu">Edit Profile</button>
                                
                                <button v-if="isAllowed" @click="resume_upload_menu = !resume_upload_menu" class="btn_white dark:hover:bg-tz_light_blue"> 
                                    <span v-if="!user.portfolio_url">Upload Resume</span>
                                    <span v-else>view resume</span>
                                </button>
                                <div v-else>
                                    <button v-if="user.portfolio_url" @click="resume_upload_menu = !resume_upload_menu">View Resume</button>
                                    <span v-else>No Resume Uploaded</span>
                                </div>
                                <!-- <SplitButton label="Resume" icon="pi pi-plus" @click="save" :model="items" /> -->
                            </div>
                        </div>

                    </div>
                    <div class="hidden md:block border-r md:h-40 dark:border-gray-500"></div>
                    <div class=" flex flex-col items-start justify-center text-left p-5">
                        <!-- <div>
                            <span v-if="user.email_verified">user email is verified</span>
                            <span v-else>user email is not verified</span>
                        </div> -->
                        <p v-if="user.createdAt">Joined: {{ formatDistanceToNow(user.createdAt) }} ago</p>
                        <p v-else>Joined: {{ formatDistanceToNow(user.created) }} ago</p>
                        <!-- <p>Joined: {{ formatDistance(new Date(user.createdAt)) }} ago</p> -->
                        

                        <p v-if="user.profile.location">Location: {{ user.profile.location.city }}, {{ user.profile.location.state }}, NG.</p>

                         <!-- VIEW PROFILE AS OTHERS -->
                         <!-- <a :href="`/users/${user._id}`" target="_blank" v-if="isAllowed" class="text-blue-500 underline"><i class="bi bi-eye"></i> view profile as others</a> -->
                        <!-- ------- -->
                    </div>
                </div>

                <div class=" w-full xl:w-3/4">
                    <div class="border rounded-xl p-3 text-left  dark:border-gray-600 ">
                        <h1 class="font-bold"><i class="bi bi-person"></i> Profile</h1>
                    </div>

                    <div>
                        <div class="profile_section">
                            <h2 class="font-bold">About Me</h2>
                            <div>
                                {{ user.profile.bio }}
                                <span v-if="!user.profile.bio">No content...</span>
                            </div>
                        </div>

                        <div class="profile_section">
                            <h2 class="font-bold">Skills</h2>
                            <div v-if="user.profile.skills" class="flex flex-row flex-wrap gap-2 gap-y-4 mt-3">
                                <div v-for="skill in user.profile.skills.split(',')" >
                                    <span class=" bg-tz_light_blue p-2 rounded-md text-blue-400">{{ skill }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="profile_section">
                            <h2 class="font-bold">Phone Number</h2>
                            <div>
                                {{ user.profile.phone }}
                            </div>
                        </div>

                        <div class="profile_section">
                            <h2 class="font-bold">Email Address</h2>
                            <div>
                                {{ user.email }}
                            </div>
                        </div>

                        <div class="profile_section">
                            <h2 class="font-bold">Connected Accounts</h2>
                            <a :href="user.profile.social" class="text-tz_blue">
                                {{ user.profile.social }}
                            </a>
                        </div>


                        <div class="profile_section">
                            <h2 class="font-bold">Date Joined</h2>
                            <div>
                                <span v-if="user.createdAt">{{ formatDistanceToNow(user.createdAt) }} ago</span>
                                <span v-else>{{ formatDistanceToNow(user.created) }} ago</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div class=" w-full xl:w-3/4">
                    <div class="border rounded-xl p-3 text-left  dark:border-gray-600 ">
                        <h1 class="font-bold"><i class="bi bi-briefcase"></i> Work History</h1>
                    </div>

                    <div class="my-8">
                        <h2 class="font-bold">Work orders & Contracts</h2>
                        <div class="mt-6">
                            <SkeletonLoader v-if="!contracts"/>
                           
                            <div v-if="contracts.length > 0" class="flex flex-col gap-3 overscroll-y-scroll" >
                                <!-- {{ contract.user_feedback }} -->
                                <div v-for="(contract, contract_id) in contracts"  :key="contract_id">
                                    <div v-if="contract.status != 'completed'" class="flex flex-col p-6 gap-2 border-b dark:border-b-gray-600" >
                                        <div class="flex flex-col gap-1">
                                            <p class="text-lg text-blue-400 underline">{{contract.job.title}}</p>
                                            <span class="text-md text-gray-500" v-if="contract.user_feedback.review">"{{ contract.user_feedback.review }}"</span>
                                            <div class="text-sm text-gray-500">
                                                <p v-if="contract.user_feedback.rating" class="inline-block mr-2 text-tz_blue" v-html="generateStarRatingFromInteger(contract.user_feedback.rating)"></p>
                                                <p v-else class="py-3">No feedback yet</p>
                                            </div>
                                            <small>{{ formatTimestampWithoutTime(contract.createdAt) }} <span v-if="contract.status != 'completed' && contract.status != 'closed'">-in progress</span></small>
                                            <div>NGN{{contract.job.budget}} <span v-if="contract.status == 'completed'">paid</span></div>
                                        </div>
                                        <div class="mt-3">
                                            <!-- contract status goes here -->
                                            <ContractStatus :type="contract.status"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div v-else class="p-3 text-center">No Completed Jobs Yet</div>
                        </div>
                       
                    </div>
                </div>
                
            </div>
        </div>
</template>
<script>
import Navbar from '@/components/Navbar.vue';
import TemplateView from '../TemplateView.vue';
import JobReviewCard from '@/components/JobReviewCard.vue';
import Modal from '@/components/Modal.vue';
import axios from 'axios';
import LoaderButton from '@/components/LoaderButton.vue';
import { generateStarRating } from '@/utils/ratingStars';
import { generateStarRatingFromInteger } from '@/utils/ratingStars';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import FullPageLoading from '@/components/FullPageLoading.vue';
import PageTitle from '@/components/PageTitle.vue';
import { formatTimestamp } from '@/utils/dateFormat';
import { formatTimestampWithoutTime } from '@/utils/dateFormat';
import DismissableAlert from '@/components/DismissableAlert.vue';
import { CircleStencil, Cropper, Preview } from 'vue-advanced-cropper';
import ContractStatus from '@/components/ContractStatus.vue';

import FileUpload from 'primevue/fileupload';
import SplitButton from 'primevue/splitbutton';

import { useToast } from 'vue-toastification';
import { formatDistanceToNow } from 'date-fns'

export default {
    name: "ProfilePage",
    components: { Navbar, TemplateView, 
        JobReviewCard, 
        Modal, 
        LoaderButton, 
        SkeletonLoader, 
        FullPageLoading, 
        PageTitle, 
        DismissableAlert,
        Cropper,
        CircleStencil,
        Preview,
        FileUpload,
        SplitButton,
        ContractStatus
     },
    data(){
        return{
            toast: useToast(),
            formatDistanceToNow,
            show_alert: false,
            alert_type: '',
            alert_message: '',

            user: null,

            profile_edit_menu: false,
            profile_image_menu: false,
            resume_upload_menu: false,

            loading: null,
            user_rating_count: '',
            user_profile_image: '',
            // user_profile_image: 'https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
            result: {
                coordinates: null,
                image: null,
            },
            image: {
				src: '',
				type: null
			},
            current_zoom: 0,
            max_zoom: 5,

            user_form: {
                loading: false,
                preffered_job_types: '',
                profile: {
                    title: '',
                    bio: '',
                    location: {
                        city: '',
                        state: '',
                        address: '',
                    },
                    phone: '',
                    social: '',
                    skills: '',
                    },
                },

                contracts: [],
                isAllowed: false,

            headers: {Authorization: `JWT ${localStorage.getItem('life-gaurd')}`},

            image_uploading: false,
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-refresh',
                },
                {
                    label: 'Update',
                    icon: 'pi pi-times',
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-external-link',
                    command: () => {
                        window.location.href = 'https://vuejs.org/';
                    }
                },
            ],
            generateStarRatingFromInteger,
            formatTimestamp,
            formatTimestampWithoutTime,
        }
    },
    methods: {
        change({ coordinates, image }) {
			// console.log(coordinates, canvas, image);
            this.result = {
				coordinates,
				image
			};
		},

        async getPublicUserData(){
            this.loading = true;
            try{
                const response = await axios.get(`${this.api_url}/user/${this.$route.params.user_id}`);
                this.user = response.data.user;
                console.log("pulic user: ", response);

                this.user_form = response.data.user;
                this.checkCurrentViewer();
                this.loading = false;

                const blob = URL.createObjectURL(this.user.profile.image_url);
				
				// 3. The steps below are designated to determine a file mime type to use it during the 
				// getting of a cropped image from the canvas. You can replace it them by the following string, 
				// but the type will be derived from the extension and it can lead to an incorrect result:
				//
				// this.image = {
				//    src: blob,
				//    type: files[0].type
				// }
                this.image.src = this.user.profile.image_url;

                console.log("image.src: ", this.image.src)
            }catch(error){
                console.log("error fetching public user data", error);
                this.loading = true;
                /* if(error.response.status == 404) {
                    this.loading = false;
                    this.$router.push("/404")
                } */
            }
        },

        async getUserData(){
            try{
                 // Get the token from localStorage
                const token = localStorage.getItem('life-gaurd');
                const headers = {
                    Authorization: `JWT ${token}`, // Assuming it's a JWT token
                };

                const response = await axios.get(`${this.api_url}/user`, { headers });
                console.log("profile page :", response);
                if(!this.user.profile.title){
                    alert("please update your profile");
                    this.$router.push("/profile/complete");
                }
                // push to user variable..
                this.user = response.data.user;
                // this.user_form = response.data.user;
                this.user_form.profile = response.data.user.profile;

                // set image src..
                
                
            }
            catch(error){
                console.error(error)
            }
        },

        async updateUserProfile(){
            this.user_form.loading = true;
            const headers = this.headers;
            try{
                const response = await axios.patch(`${this.api_url}/user/profile`, this.user_form, { headers });
                // console.log(response)
                this.toast.success(response.data.message);
                this.user_form.loading = false;
                this.profile_edit_menu = !this.profile_edit_menu;
            }
            catch(error){
                // display any possible error here...
                this.toast.error(error.response.data.message);
            }
        },

        async getActiveAndCompletedContracts(){
            const headers = this.headers;
            try{
                const response = await axios.get(`${this.api_url}/contracts/good/${this.$route.params.user_id}`, { headers });
                this.contracts = response.data.contracts;
                console.log("user contracts: ", response)
            }catch(error){
                console.log(error)
            }
        },
        

        // CHECK FOR CURRENT PROFILE VIEWER AND RESTRICT CERTAIN ACTIONS...
        checkCurrentViewer(){
            const token = localStorage.getItem('life-gaurd');
            const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
            if(user){
                console.log("user roleeee: ", user);
                if(user.id == this.$route.params.user_id){
                    this.isAllowed = true;
                }
            }
            else{
                this.isAllowed = false;
            }
        },


        // FUNCTIONS FOR ADVANCED IMAGE CROPPER..
        zoomIn() {
            if(this.current_zoom < this.max_zoom){
                this.$refs.cropper.zoom(1.2);
                this.current_zoom += 1;
            }
		},

        zoomOut() {
                this.$refs.cropper.zoom(0.2);
                this.current_zoom = 0;
		},

        crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob((blob) => {
				// Do something with blob: upload to a server, download and etc.
			}, this.image.type);
		},

		reset() {
			this.image = {
				src: null,
				type: null
			}
		},

        getMimeType(file, fallback = null) {
            const byteArray = (new Uint8Array(file)).subarray(0, 4);
            let header = '';
            for (let i = 0; i < byteArray.length; i++) {
            header += byteArray[i].toString(16);
            }
            switch (header) {
                case "89504e47":
                    return "image/png";
                case "47494638":
                    return "image/gif";
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    return "image/jpeg";
                default:
                    return fallback;
            }
        },

		loadImage(event) {
			// Reference to the DOM input element
			const { files } = event.target;
			// Ensure that you have a file before attempting to read it
			if (files && files[0]) {
				// 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
				if (this.image.src) {
					URL.revokeObjectURL(this.image.src)
				}
				// 2. Create the blob link to the file to optimize performance:
				const blob = URL.createObjectURL(files[0]);
				
				// 3. The steps below are designated to determine a file mime type to use it during the 
				// getting of a cropped image from the canvas. You can replace it them by the following string, 
				// but the type will be derived from the extension and it can lead to an incorrect result:
				//
				this.image = {
				   src: blob,
				   type: files[0].type
				}
				
				// Create a new FileReader to read this image binary data
				const reader = new FileReader();
				// Define a callback function to run, when FileReader finishes its job
				reader.onload = (e) => {
					// Note: arrow function used here, so that "this.image" refers to the image of Vue component
					this.image = {
						// Set the image source (it will look like blob:http://example.com/2c5270a5-18b5-406e-a4fb-07427f5e7b94)
						src: blob,
						// Determine the image type to preserve it during the extracting the image from canvas:
						type: this.getMimeType(e.target.result, files[0].type),
					};
				};
				// Start the reader job - read file as a data url (base64 format)
				reader.readAsArrayBuffer(files[0]);
			}
		},

        async uploadProfileImage() {
            const { canvas } = this.$refs.cropper.getResult();
            const headers = this.headers;
            this.image_uploading = true;
            try {
                if (canvas) {
                    const form = new FormData();

                    canvas.toBlob(async blob => {
                        const mimeType = this.image.type; // Use the MIME type determined earlier
                        form.append('image', blob, `${this.user.firstname}_${this.user.lastname}-${this.user._id}-dp.${mimeType.split('/')[1]}`); // Append the blob with original file extension
                        try {
                            const response = await axios.post(`${this.api_url}/profile/image`, form, { headers });
                            this.image_uploading = false;
                            console.log("profile image: ", response);
                            this.profile_image_menu = !this.profile_image_menu;
                            window.location.reload();
                        } catch (error) {
                            console.error("Error uploading profile image:", error);
                            this.image_uploading = false;
                        }
                    }, this.image.type); // Pass original MIME type to toBlob
                    this.toast.success("profile image changed successfully");
                }

            } catch (error) {
                console.error("Error uploading profile image:", error);
                this.toast.error(error.response.data.message);
            }
        },

        addHeaders(event){
            const token = localStorage.getItem('life-gaurd');
            event.xhr.setRequestHeader('Authorization', `JWT ${token}`);
        }

	},
	destroyed() {
		// Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
		if (this.image.src) {
			URL.revokeObjectURL(this.image.src)
		}
    },
    computed: {
        
        },
    created(){
            this.getPublicUserData();
            this.getActiveAndCompletedContracts();
        },
    }
</script>
<style>

    input:disabled{
        @apply text-gray-400
    }
    .profile_section{
        @apply text-left p-3 mt-5
    }

    .form-section{
        @apply flex flex-col gap-3 capitalize justify-between flex-wrap mb-3
    }

    .form-control{
        @apply flex flex-col justify-start w-full
    }

    .handler{
        @apply border-red-500 border 
    }

    .preview {
    	border: dashed 1px rgba(255,255,255, 0.25) !important;
    }
</style>