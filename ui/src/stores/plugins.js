import Vue from "vue"

export default {
    namespaced: true,
    state: {
        plugin: undefined,
        tasktask: undefined,
        plugins: undefined,
        icons: undefined
    },
    actions: {
        list({commit}) {
            return Vue.axios.get("/api/v1/plugins").then(response => {
                commit("setPlugins", response.data)

                return response.data;
            })
        },
        load({commit}, options) {
            return Vue.axios.get(`/api/v1/plugins/${options.cls}`).then(response => {
                if (options.tasktask) {
                    commit("setPluginTaskTask", response.data)
                    return response.data;
                }
                commit("setPlugin", response.data)

                return response.data;
            })
        },
        icons({commit}) {
            return Vue.axios.get("/api/v1/plugins/icons").then(response => {
                commit("setIcons", response.data)

                return response.data;
            })
        },

    },
    mutations: {
        setPlugin(state, plugin) {
            state.plugin = plugin
        },
        setPluginTaskTask(state, tasktask) {
            console.log("pop")
            state.tasktask = tasktask
        },
        setPlugins(state, plugins) {
            state.plugins = plugins
        },
        setIcons(state, icons) {
            state.icons = icons
        },
    },
    getters: {}
}

