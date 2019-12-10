<template>
<v-container>
<v-row><h2 class="teal--text">THANK YOU! <br> YOU HAVE SUCCESSFULLY PURCHASED A CLASS PACK!</h2></v-row>
    <v-card outlined>
        <v-row>
        <v-col cols="12">
         <v-card-title class="font-weight-black">You have selected:</v-card-title>
        </v-col>
        </v-row>
        <v-row>
             <v-col cols="1">
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="loadedorder.class_pack.total_credit==0">
                    <h1>&#8734;   </h1>
                </v-btn>
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="loadedorder.class_pack.total_credit==1">
                   <h1>S</h1>       
                </v-btn>
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="!(loadedorder.class_pack.total_credit==1||loadedorder.class_pack.total_credit==0)">
                    {{loadedorder.class_pack.total_credit}}        
                </v-btn>
            </v-col>
            <v-col cols="5">
                <h3 >{{loadedorder.class_pack.pack_name}}</h3><br>
                <h5 >{{loadedorder.class_pack.newbie_note}}</h5>
            </v-col>
            <v-col class="text-right" cols="5">
                     <h3 v-if="!(loadedorder.class_pack.pack_type=='unlimited')"> $ {{loadedorder.grand_total}}</h3>
                     <h3 v-else> $ {{Math.round(loadedorder.grand_total/loadedorder.class_pack.validity_month)}} per month</h3>
            </v-col>
        </v-row>
     
        <v-divider></v-divider>
        <v-row>
            <v-col class="text-left pa-1 ml-5" cols="6">
                <h4>Subtotal</h4>
            </v-col>
            <v-col class="text-right" cols="5">
                <h4>$ {{loadedorder.class_pack.pack_price}}</h4>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left pa-1 ml-5" cols="6">
                <h4>GST </h4>
            </v-col>
            <v-col class="text-right" cols="5">
                <h4>$ {{loadedorder.GST}}</h4>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left pa-1 ml-5" cols="6">
                <h4>Discount</h4>
            </v-col>
            <v-col class="text-right" cols="5">
                <h4>-$ {{loadedorder.discount}}</h4>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left pa-1 ml-5" cols="6">
                <h4 class="teal--text">Grand Total</h4>
            </v-col>
            <v-col class="text-right" cols="5">
                <h4 class="teal--text">$ {{loadedorder.grand_total}}</h4>
            </v-col>
        </v-row>
    </v-card>
 
       
</v-container>
</template>
<script>
import axios from 'axios'
export default {
     async asyncData(context) {

                return await axios.get(`https://vuetest-81d31.firebaseio.com/order/${context.route.params.id}.json`)
                    .then((res) => {
                        console.log(res.data)
                        return {loadedorder:res.data}
                    })
                    .catch((e) => { context.error(e) })
            },
        data(){
            return{
           
            }
        },
     computed:{
  
    
    },
     methods: {

    },
}
</script>