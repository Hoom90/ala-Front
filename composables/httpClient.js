import swal from 'sweetalert2'
// export const httpClient = (request, opts) => {
//     const config = useRuntimeConfig()
//     return useFetch(request, { baseURL: config.public.baseURL, ...opts })
//   }
//const { $swal } = useNuxtApp();


export default
    {
        async get(url, opts = {}) {
            opts.method = "GET"
            opts = { ...opts, ...this.init() }
            const result = await useFetch(url, opts);
            return result;
        },

        async post(url, opts = {}) {
            opts.method = "POST"
            opts = { ...opts, ...this.init() }
            const result = await useFetch(url, opts);
            return result;
        },

        async delete(url, opts = {}) {
            opts.method = "DELETE"
            opts = { ...opts, ...this.init() }
            const result = await useFetch(url, opts);
            return result;
        },

        async put(url, opts = {}) {
            opts.method = "PUT"
            opts = { ...opts, ...this.init() }
            const result = await useFetch(url, opts);
            return result;
        },

        init() {
            const token='';//window.localStorage.getItem('token')
            const config = useRuntimeConfig()
            return {
                baseURL: config.public.baseURL,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${token}`
                },
                onResponseError({ request, response, options }) {
                    switch (response.status) {
                        case 0:
                            // common.showError({ "عدم ارتباط با سرور": { "": "با مدیر سامانه تماس بگیرید" } })
                            swal.fire({
                                title: "عدم ارتباط با سرور",
                                text: 'اتصال اینترنت خود را بررسی کنید',
                                icon: 'error',
                                confirmButtonText: 'باشه',
                                timer: 5000,
                            });
                            break;
                        case 400:
                            swal.fire({
                                title: "خطا",
                                text: 'وقوع خطا در سمت سرور',
                                icon: 'error',
                                confirmButtonText: 'باشه',
                                timer: 5000,
                            });
                            console.log("وقوع خطا در سمت سرور...");

                            break;
                        case 401:
                            swal.fire({
                                title: "خطا",
                                text: 'عدم احراز هویت',
                                icon: 'error',
                                confirmButtonText: 'باشه',
                                timer: 5000,
                            });
                            console.log("عدم احراز هویت");

                            //window.location.href = "/account/auth";
                            // routerInstance.push("/account/login");
                            break;
                        case 403:
                            console.log("مشکل عدم دسترسی");
                            // common.showError({ "مشکل عدم دسترسی": { "": "" } })

                            //window.location.href = "/account/auth";
                            // routerInstance.push("/accessDenied");
                            break;
                        case 404:
                            console.log("درخواست شما سمت سرور یافت نشد");
                            swal.fire({
                                title: "خطا",
                                text: 'درخواست شما سمت سرور یافت نشد',
                                icon: 'error',
                                confirmButtonText: 'باشه',
                                timer: 5000,
                            });
                            // common.showError({ "درخواست شما سمت سرور یافت نشد": { "": "" } })
                            break;
                        case 405:
                            break;
                        case 408:
                            break;
                        case 411:
                            break;
                        case 413:
                            break;
                        case 414:
                            break;
                        case 415:
                            break;
                        case 500:
                            // common.showError({ "خطا در سمت سرور": { "": "با مدیر سامانه تماس بگیرید" } })
                            break;
                        case 501:
                            break;
                        case 502:
                            break;
                        case 503:
                            break;
                        case 504:
                            break;
                        case 505:
                            break;
                        default:
                            console.log(`http client status : ${response.status}`);

                            return Promise.reject({
                                message: response?._data?.messages,
                                statusCode: response.status
                            });

                    }
                    // return Promise.reject(new Error("response"));
                    //throw new Error('Parameter is not a number!'); //response
                },

                // onRequest({ request, options }) {
                //     // options.headers = options.headers || {}
                //     // options.headers.authorization = '...'
                // },
                // onRequestError({ request, options, error }) {
                //     // Handle the request errors
                //     // debugger
                // },
                // onResponse({ request, response, options }) {
                //     // Process the response data
                //     // localStorage.setItem('token', response._data.token)
                //     // debugger
                // }
            }
        }
    }