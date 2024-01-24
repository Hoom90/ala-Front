
const get = async (url, opts = {}) => await useFetch(url, { method: "GET", ...opts, ...init()})// baseURL:'http://sahab-5:81/api/' })
const post = async (url, opts = {}) => await useFetch(url, { method: "POST", ...opts, ...init() })
const put = async (url, opts = {}) => await useFetch(url, { method: "PUT", ...opts, ...init() })
// const delete = async (url, opts = {}) => await useFetch(url, { method: "DELETE", ...opts, ...init() })

const init = () => {
    const config = useRuntimeConfig()
    // const token=localStorage.getToken()
    return {
        baseURL: config.public.baseURL,
        headers: {
            "Content-Type": "application/json",
            // Authorization: `bearer ${token}`
        },
        onResponseError({ request, response, options }) {
            switch (response.status) {
                case 0:
                    // common.showError({ "عدم ارتباط با سرور": { "": "با مدیر سامانه تماس بگیرید" } })
                    // swal.fire({
                    //     title: "عدم ارتباط با سرور",
                    //     text: 'اتصال اینترنت خود را بررسی کنید',
                    //     icon: 'error',
                    //     confirmButtonText: 'باشه',
                    //     timer: 5000,
                    // });
                    break;
                case 400:
                    // swal.fire({
                    //     title: "خطا",
                    //     text: 'وقوع خطا در سمت سرور',
                    //     icon: 'error',
                    //     confirmButtonText: 'باشه',
                    //     timer: 5000,
                    // });
                    // console.log("وقوع خطا در سمت سرور...");
                    break;
                case 401:
                    // swal.fire({
                    //     title: "خطا",
                    //     text: 'عدم احراز هویت',
                    //     icon: 'error',
                    //     confirmButtonText: 'باشه',
                    //     timer: 5000,
                    // });
                    // console.log("عدم احراز هویت");
                    //window.location.href = "/account/auth";
                    // routerInstance.push("/account/login");
                    break;
                case 403:
                    // console.log("مشکل عدم دسترسی");
                    // common.showError({ "مشکل عدم دسترسی": { "": "" } })
                    //window.location.href = "/account/auth";
                    // routerInstance.push("/accessDenied");
                    break;
                case 404:
                    // console.log("درخواست شما سمت سرور یافت نشد");
                    // swal.fire({
                    //     title: "خطا",
                    //     text: 'درخواست شما سمت سرور یافت نشد',
                    //     icon: 'error',
                    //     confirmButtonText: 'باشه',
                    //     timer: 5000,
                    // });
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

                    let messages = [];
                    for (const [key, value] of Object.entries(response?._data?.errors)) {
                        console.log(`${key}: ${value}`);
                        if (key != 'instance' && key != 'status' && key != 'title') {
                            value.forEach(item => {
                                messages.push(item);
                            });
                        }
                    }
                    return Promise.reject({
                        title: response._data.errors.title,
                        message: messages,
                        statusCode: response.status
                    });//response._data.errors.Mobile[0]);

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

export default { get, post }
