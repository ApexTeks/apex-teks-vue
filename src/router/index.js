import { createRouter, createWebHistory } from 'vue-router'

import LandingPageViewVue from '@/views/LandingPageView.vue'
import JobsPageViewVue from '@/views/JobsPageView.vue'
import MessagePageViewVue from '@/views/MessagePageView.vue'
import SavedJobsViewVue from '@/views/Users/SavedJobsView.vue'
import ApplicationPageViewVue from '@/views/Users/ApplicationPageView.vue'
import ContractPageViewVue from '@/views/Users/ContractPageView.vue'
import ContractsListPageViewVue from '@/views/Users/ContractsListPageView.vue'
import MyApplicationsPageViewVue from '@/views/Users/MyApplicationsPageView.vue'
import ProfilePageViewVue from '@/views/Users/ProfilePageView.vue'
import LoginViewVue from '@/views/LoginView.vue'
import SignupViewVue from '@/views/SignupView.vue'

import ProfileStepViewVue from '@/views/Users/ProfileStepView.vue'
import RegistrationDecisionVue from '@/views/RegistrationDecision.vue'
import PageNotFoundViewVue from '@/views/PageNotFoundView.vue'
import AboutPageViewVue from '@/views/AboutPageView.vue'
import MissionPageViewVue from '@/views/MissionPageView.vue'


import ClientSignupViewVue from '@/views/ClientSignupView.vue'
import ClientDashBoardPage from '@/views/Employers/ClientDashboardPage.vue'
import ClientPostJobView from '@/views/Employers/ClientPostJobPageView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingPageViewVue
  },

  {
    path: '/users/:user_id',
    name: 'Public profile',
    component: ProfilePageViewVue
  },

  {
    path: '/about',
    name: 'about',
    component: AboutPageViewVue
  },

  {
    path: '/vision',
    name: 'mission & vision',
    component: MissionPageViewVue
  },

  {
    path: '/login',
    name: 'login',
    component: LoginViewVue
  },

  {
    path: '/profile/update',
    name: 'new user',
    component: ProfileStepViewVue
  },

  {
    path: '/register',
    name: 'register',
    component: SignupViewVue
  },


  {
    path: '/register/decide',
    name: 'decide',
    component: RegistrationDecisionVue,
  },


  {
    path: '/register/client',
    name: 'register-client',
    component: ClientSignupViewVue
  },


  {
    path: '/jobs',
    name: 'jobs',
    component: JobsPageViewVue,
  },

  {
    path: '/profile',
    name: 'profile',
    component: ProfilePageViewVue,
    meta: { requiresAuth: true, role: 'user' }
  },

  {
    path: '/jobs/applications',
    name: 'applications',
    component: MyApplicationsPageViewVue,
    meta: { requiresAuth: true, role: 'user' }
  },

  {
    path: '/jobs/:job_id/application',
    name: 'application',
    component: ApplicationPageViewVue,
    meta: { requiresAuth: true, role: 'user' }
  },

  {
    path: '/contracts',
    name: 'contracts',
    component: ContractsListPageViewVue,
    meta: { requiresAuth: true, role: 'user' }
  },

  {
    path: '/contracts/:contract_id',
    name: 'contract',
    component: ContractPageViewVue,
    // meta: { requiresAuth: true, role: 'user' }
  },


  {
    path: '/messages',
    name: 'messages',
    component: MessagePageViewVue,
    meta: { requiresAuth: true, role: 'user' }
  },

  {
    path: '/saved-jobs',
    name: 'saved-job',
    component: SavedJobsViewVue,
    meta: { requiresAuth: true, role: 'user' }
  },

  // 404 PAGES CONFIG...
  {
    path: "/404", 
    name: "404", 
    component: PageNotFoundViewVue
  },

  {
    path: "/:catchAll(.*)", 
    redirect: "/404"
  },
  //  404 PAGES ENDS HERE....


/*
// CLIENT BASED ROUTES STARTS HERE
*/
{
  path: "/client/dashboard",
  name: "dashboard",
  component: ClientDashBoardPage,
  meta: { requiresAuth: true, role: 'employer' }
},

{
  path: "/client/job",
  name: "job",
  component: ClientPostJobView,
  meta: { requiresAuth: true, role: 'employer' }
},

{
  path: "/client/jobs",
  name: "my jobs",
  component: ClientDashBoardPage,
  meta: { requiresAuth: true, role: 'employer' }
},

{
  path: '/client/contracts',
  name: 'client contracts',
  component: ContractsListPageViewVue,
  meta: { requiresAuth: true, role: 'employer' }
},

{
  path: '/client/profile',
  name: 'client profile',
  component: ProfilePageViewVue,
  meta: { requiresAuth: true, role: 'employer' }
},

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



const token = localStorage.getItem('life-gaurd');

let redirectToLogin = false; // Initialize a flag to redirect to login after authentication
let requestedRoute = null; // Initialize a variable to store the requested route



// Create a navigation guard that prevents loggedn in users from visiting irrelevant routes when logged in...
// this is ensured via the user roles present in the token...
router.beforeEach((to, from, next) => {
  // Check if the user is logged in (you should replace this condition)
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  // If the user is logged in and is trying to visit the root URL or login page
  if (userRole && userRole == 'user' && to.path === '/' || userRole && userRole == 'user'&& to.path === '/login') {
    // Redirect users to /jobs
    next('/jobs')

  } else if(userRole && userRole == 'employer' && to.path === '/' || userRole && userRole == 'employer'&& to.path === '/login') {
    // redirect clients to their dashboard
    next('/client/dashboard');
  }
    else{
      // Otherwise, proceed with the navigation
      next()
    }
});

// navigation gaurd to allow only loggedin users to view certain pages..
router.beforeEach((to, from, next) => {
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  // Check if the route has a "requiresAuth" meta field and matches the user's role
  if (to.meta.requiresAuth && to.meta.role !== userRole) {
    redirectToLogin = true; // Set the flag to true
    requestedRoute = to.fullPath; // Store the requested route
    next('/login'); // Redirect to login for unauthorized access
  } else {
    next(); // Proceed to the route
  }
});


export default router
