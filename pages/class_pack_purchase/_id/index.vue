<template>
<v-container>
<v-row><h2 class="teal--text">CLASS PACK PURCHASE PREVIEW</h2></v-row>
    <v-card outlined>
        <v-row>
        <v-col cols="12">
         <v-card-title class="font-weight-black">You have selected:</v-card-title>
        </v-col>
        </v-row>
        <v-row>
             <v-col cols="1">
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="class_pack.total_credit==0">
                    <h1>&#8734;   </h1>
                </v-btn>
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="class_pack.total_credit==1">
                   <h1>S</h1>       
                </v-btn>
                <v-btn class="mx-2" fab dark x-large color="teal" v-show="!(class_pack.total_credit==1||class_pack.total_credit==0)">
                    {{class_pack.total_credit}}        
                </v-btn>
            </v-col>
            <v-col cols="5">
                <h3 >{{class_pack.pack_name}}</h3><br>
                <h5 >{{class_pack.newbie_note}}</h5>
            </v-col>
            <v-col class="text-right" cols="5">
                <h3 v-if="!(class_pack.pack_type=='unlimited')"> $ {{grand_total}}</h3>
            <h3 v-else> $ {{Math.round(grand_total/class_pack.validity_month)}} per month</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-right pa-1 ml-5" cols="4">
                <v-text-field 
                    outlined 
                    :disabled="disable"
                    dense 
                    color="teal"
                    append-icon="done"
                    label="Promo Code" 
                    v-model="user_input"
                ></v-text-field>
            </v-col>
            <v-col class="text-left pa-1 ma-0" cols="7">
                <v-btn dark color="teal" @click="discounter">APPLY</v-btn>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
            <v-col class="text-left pa-1 ml-5" cols="6">
                <h4>Subtotal</h4>
            </v-col>
            <v-col class="text-right" cols="5">
                <h4>$ {{class_pack.pack_price}}</h4>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left pa-1 ml-5" cols="6">
                <h4>GST </h4>
            </v-col>
            <v-col class="text-right" cols="5">
                <h4>$ {{GST}}</h4>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left pa-1 ml-5" cols="6">
                <h4>Discount</h4>
            </v-col>
            <v-col class="text-right" cols="5">
                <h4>-$ {{discount}}</h4>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left pa-1 ml-5" cols="6">
                <h4 class="teal--text">Grand Total</h4>
            </v-col>
            <v-col class="text-right" cols="5">
                <h4 class="teal--text">$ {{grand_total}}</h4>
            </v-col>
        </v-row>
    </v-card>
    <v-row>
        <v-col cols="12">
            <h5>Please read all <a href="#">trems & condition</a> before purchasing YM class or class pack PACK</h5>
        </v-col>
    </v-row>
     <v-row>
            <v-col class="text-left" cols="6">
                <v-btn @click="$router.push('/class_pack_purchase')" text color="teal" dense><v-icon>arrow_back</v-icon>Back</v-btn>
            </v-col>
            <v-col class="text-right" cols="5">
                <v-btn  color="teal" dark rounded large @click="makeorder">Pay Now</v-btn>
            </v-col>
        </v-row>
       
</v-container>
</template>
<script>
import axios from 'axios'
export default {
     async asyncData(context) {

                return await axios.get('https://vuetest-81d31.firebaseio.com/discount.json')
                    .then((res) => {
                        const discarray = []
                        for (const key in res.data) {
                            discarray.push({...res.data[key], id: key })
                        }
                        console.log(discarray)
                      return {discarray}
                    })
                    .catch((e) => { context.error(e) })
            },
        data(){
            return{
                user_input:'',
                is_dicount: false,
                disable:false,
            }
        },
     computed:{
    class_pack(){
        return this.$store.getters.loadedproduct.find(item=> item.pack_id==this.$route.params.id)
    },
    GST(){
        return Math.round(this.class_pack.pack_price*7/100)
    },
    grand_total(){
        return (this.class_pack.pack_price+this.GST)-this.discount
    },
    discount(){
        let dsc_item;
        if(this.is_dicount){
          dsc_item   =this.discarray.find((item)=>item.code==this.user_input)
          return dsc_item.value
        }
         return 0
    }
    
    },
     methods: {
     discounter(){
         if(this.discarray.find((item)=>item.code==this.user_input)){
             this.is_dicount=true
             this.disable=true
         }
         else{
         alert('Promo Code is Invaliad')
         }
     },
     makeorder(){
         this.$store.dispatch('addorder',{
                    class_pack:this.class_pack,
                    GST:this.GST,
                    grand_total:this.grand_total,
                    discount:this.discount,
                    date: new Date().toISOString().substr(0, 10), 
                    
                    })
     }
 
    },
}
</script>