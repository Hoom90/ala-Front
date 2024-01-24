
export const publicbreadcrumbstore = defineStore('publicbreadcrumb', {
    state: () => ({
        breadcrumbs: [],
    }),
    getters: {
        getBreadCrumbs: (state) => {
            // return [{
            //     title: 'خانه',
            //     disabled: false,
            //     to: '/'
            // },
            // ...state.breadcrumbs]
            return [...state.breadcrumbs]
        }
    },
    actions: {
        setBreadCrumbs(breadcrumbs) {
            this.breadcrumbs = breadcrumbs
        }
    }
})