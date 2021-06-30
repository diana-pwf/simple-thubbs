import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        logged: window.localStorage.logged === "true",
        postTotal: 0,
        currPage: 1,
        pageSize: 10,
        searchUserId: 0,
        favorite: [], //JSON.parse(window.localStorage.favorite),
        history: [] //JSON.parse(window.localStorage.history)
    }
})
export default store