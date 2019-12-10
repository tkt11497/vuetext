import Vuex from 'vuex'
import axios from 'axios'
import Cookie from 'js-cookie'
const createstore = () => {
    return new Vuex.Store({

        state: {
            loadedproduct: [],
            token: null,
            loadedorder: [],
            currentloginname: '',
            errormsg:null,
 

        },
        mutations: {
            setproduct(state, product) {
                state.loadedproduct = product
            },
            addorder(state, order) {
                state.loadedorder.push(order)
            },

            settoken(state, data) {
                state.token = data
            },
            cleartoken(state) {
                state.token = null;
            },
            currentloginname(state, clname) {
                state.currentloginname = clname
            },
            seterrormsg(state,errormsg){
                state.errormsg=errormsg
            }
        },
        actions: {
          nuxtServerInit(vuexcontext, context) {

         return axios.get('https://vuetest-81d31.firebaseio.com/classpacks_response.json')
                .then((res) => {
                     vuexcontext.commit('setproduct', res.data.data.pack_list)
                  })
                   .catch((e) => { context.error(e) })
            },
            setproduct(vuexcontext, product) {
                vuexcontext.commit('setproduct', product)
            },
            addorder(vuexcontext, order) {
                return axios.post('https://vuetest-81d31.firebaseio.com/order.json', order).then(
                    (result) => {
                        vuexcontext.commit('addorder', {...order, id: result.data.name })
                        this.$router.push('/order_success/' + result.data.name)
                        
                    }
                ).catch((err) => console.log(err))
            },

           async authmethod(vuexcontext, authdata) {
                let authurl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
                if (!authdata.isLogin) {
                    authurl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
                }
                return axios.post(authurl + process.env.fbapikey, {
                        email: authdata.email,
                        password: authdata.password,
                        returnSecureToken: true
                    }).then((result) => {
                        let c=result.data.email.split("@")[0]
                        vuexcontext.commit('currentloginname', c)
                        vuexcontext.commit('settoken', result.data.idToken)

                        if (process.client) {
                            localStorage.setItem('token', result.data.idToken)
                            localStorage.setItem('currentloginname', c)
                            localStorage.setItem('expiretime', new Date().getTime() + Number.parseInt(result.data.expiresIn) * 1000)
                        }

                        Cookie.set('ctoken', result.data.idToken)
                        Cookie.set('currentloginname', c)
                        Cookie.set('cexpiretime', new Date().getTime() + Number.parseInt(result.data.expiresIn) * 1000)
                        vuexcontext.commit('seterrormsg',null)
                        this.$router.push('/class_pack_purchase')
                    })
                    .catch((err) => { 
                        //console.log( err.response.data.error.message)
                         vuexcontext.commit('seterrormsg',err.response.data.error.message)
                         
                        console.log(vuexcontext.state.errormsg) 
                    })

            },
            reloadauth(vuexcontext, req) {
                let token;
                let timer;
                let currentloginname;
                if (req) {
                    console.log('runing server')
                    if (!req.headers.cookie) {
                        return;
                    }
                    let jscookie = req.headers.cookie.split(";") //it works here
                        .find((c) => { return c.trim().startsWith("ctoken=") });
                    console.log(jscookie)
                     currentloginname = req.headers.cookie.split(";") //it works here
                    .find((c) => { return c.trim().startsWith("currentloginname=") })
                    if (!jscookie) {
                        return
                    }
                    if (!currentloginname) {
                        return
                    }
                    token = jscookie.split('=')[1];
                    currentloginname=currentloginname.split('=')[1];
                    console.log(currentloginname)
                    timer = req.headers.cookie.split(";")
                        .find(c => c.trim().startsWith("cexpiretime="))
                        .split("=")[1];
                } else {
                    console.log("running local")
                    token = localStorage.getItem('token')
                    currentloginname = localStorage.getItem('currentloginname')
                    timer = localStorage.getItem('expiretime')

                }
                console.log(new Date().getTime(), +timer)
                if (new Date().getTime() > +timer || !token) {
                    console.log('no token or invalidtoken')
                    vuexcontext.dispatch('logout')
                    return;
                }

                console.log("running reloadauth")
                vuexcontext.commit('settoken', token)
                vuexcontext.commit('currentloginname', currentloginname)
                console.log(vuexcontext.state.currentloginname)

            },
            logout(vuexcontext) {
                vuexcontext.commit('cleartoken')
                if (process.client) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('expiretime')
                }
                Cookie.remove('ctoken')
                Cookie.remove('cexpiretime')
            },




        },
        getters: {
            currentloginname(state) {
                return state.currentloginname
            },
            loadedproduct(state) {
                return state.loadedproduct
            },
            loadedorder(state) {
                return state.loadedorder
            },
            authenticated(state) {
                return state.token != null;
            },
            errormsg(state){
                return state.errormsg
            },
            authenticated(state) {
                return state.token != null;
            }
        }




    })
}
export default createstore