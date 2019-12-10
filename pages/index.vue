<template>
       <v-container
        class="fill-height"
        fluid 
        style="background-color:#333333" 
        @keydown.13="onsubmit"
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card tile>
              <v-row class="text-center" justify="center">
              <v-card-title class="text-center">Member Login</v-card-title>
              </v-row>
              <v-form v-model="valid" @submit.prevent="onsubmit" ref="form">
              <v-card-text>
                
                  <v-text-field
                    label="Email"
                    name="login"
                    prepend-icon="mdi-account-circle"
                    type="text"
                    v-model="email" 
                    :rules="emailRules"
                    required
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    v-bind:append-icon="showpassword ? 'mdi-eye':'mdi-eye-off'"
                    v-bind:type="showpassword ? 'text':'password'"
                    v-on:click:append="showpassword=!showpassword"
                    v-model="password" 
                    :rules="passwordRules" 
                    required
                  ></v-text-field>
                 <v-switch v-model="isLogin" :label="isLogin? 'Login':'Sign Up'"></v-switch>
              </v-card-text>
              <v-card-actions >
                <v-row class="text-center" justify="center">
                
                <v-btn color="#3F3A5F" type="submit" id="btn1" dark>{{isLogin? 'Login':'Sign Up'}}</v-btn>
                
                </v-row>
              </v-card-actions>
               </v-form>
              <v-col cols="12"></v-col>
            </v-card>
          </v-col>
      </v-row>


         

       
         <v-snackbar v-model="snackbar" :timeout="5000" top color="orange" :auto-width="true">
      <span> {{$store.getters.errormsg}} !!!</span>
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
      </v-container>
 

</template>

<script>
export default {
   created(){

    },
  mounted() {

  },
    data(){
        return{
            showpassword:false,
            valid:false,
            emailRules: [
      v => !!v || 'E-mail is required',
      v => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => v.length >= 6 || 'Password must be atleast 6 characters',
    ],
           snackbar:false,
            isLogin: true,
            email:'',
            password:'',
           
        }
        
    },
    computed:{
    
    
    },
    methods: {
     
      onsubmit(){
         if (this.$refs.form.validate()) {
      console.log('submitting')
      this.$store.dispatch('authmethod',{
        isLogin:this.isLogin,
        email:this.email,
        password:this.password
      }).then(()=>{this.snackbar=true})
         }
     
    },
    

    
    },
}
</script>