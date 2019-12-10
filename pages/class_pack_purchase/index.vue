<template>
    <v-container>
{{message}}

<v-row justify="center">
  
        <v-card max-width="320" min-width="320" 
        v-for="item in pack_list"
         :key="item.pack_id" 
         @click="$router.push(`/class_pack_purchase/${item.pack_id}`)">
            <v-row>
            <v-btn dark class="mt-3 ml-5" x-small v-if="item.tag_name? true:false">{{item.tag_name}}</v-btn> 
            <v-col cols="12" v-else></v-col>
            </v-row>
            <v-row justify="center" class="text-center">
            <v-card-title><h3 class="teal--text">{{item.pack_name}}</h3></v-card-title>
            </v-row>
            <v-row justify="center" class="text-center">
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="item.total_credit==0">
                    <h1>&#8734;   </h1>
                </v-btn>
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="item.total_credit==1">
                   <h1>S</h1>       
                </v-btn>
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="!(item.total_credit==1||item.total_credit==0)">
                    {{item.total_credit}}        
                </v-btn>
            </v-row>


            <v-card-text class="text--primary text-center" v-show="!(item.pack_type=='shareable'||item.pack_type=='unlimited')">

            <p> Take your class at any YM Studio<br>
            Choose from 350 weekly classes<br>
            7 day booking window</p>
            </v-card-text>

            <v-card-text class="text--primary text-center" v-show="item.pack_type=='shareable'">

            <p> 50 Class Shareable Packs<br>
            Perks& Hooks do not apply</p>
            </v-card-text>

             <v-card-text class="text--primary text-center" v-show="item.pack_type=='unlimited'">

            <p> <b>Monthly Subscription Fees</b><br>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo dolore cum quae 
            </p>
            </v-card-text>
            
                
            <v-card-actions>
            <v-card-text class="text--primary text-center">

            <h3 v-show="!(item.pack_type=='unlimited')"> $ {{item.pack_price}}</h3>
            <h3 v-show="item.pack_type=='unlimited'"> $ {{Math.round(item.pack_price/item.validity_month)}} per month</h3>
            <h4 v-show="!(item.total_credit==1||item.total_credit==0)">$ {{item.estimate_price}} per class!!</h4>
            
            </v-card-text>
            

            
            </v-card-actions>
            
                
        
        </v-card>
   
</v-row>
    </v-container>
</template>


<script>
import axios from "axios"
export default {
    middleware:['checkauth','auth'],
    asyncData(context){
        return axios.get('https://vuetest-81d31.firebaseio.com/classpacks_response.json')
                    .then((res)=>{
                        
                        console.log(res.data)
                        console.log(res.data.data.pack_list)
                        context.store.dispatch('setproduct', res.data.data.pack_list)
                        return {
                            message:res.data.message
                        }
                        
                        
                        }
                    
                    
                    
                    ).catch((err)=>{
                         vuexcontext.commit('seterrormsg',err.response.data.error.message)
                    })
    },
    data(){
        return{
         
           
        }
        
    },
    computed:{
    pack_list(){
        return this.$store.getters.loadedproduct
    }
    
    },
    methods: {
     
    
    },
    

    
   
}
</script>