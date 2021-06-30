interface GlobalType{
    username: string
    jwt: string
}

var GLOBAL: GlobalType = {
    username: window.localStorage.username,
    jwt: window.localStorage.token,
}

declare module "vue/types/vue"{
    interface Vue{
        $global: GlobalType
    }
}
export default GLOBAL