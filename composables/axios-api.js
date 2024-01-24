import axios from "axios";
let timerLoading

export const axiosApi = (timeout=20) => {
    const config = useRuntimeConfig()

     const HttpClient = axios.create({
    baseURL: config.public.baseURL,
    timeout: timeout*1000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",

    },
    });

HttpClient.interceptors.request.use(
    (config) => {
        clearTimeout(timerLoading)
        timerLoading=setTimeout(() => {
            common.globalLoading()            
        }, 500);
        const token=localStorage.getToken()
        if (token) {
            config.headers["authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

HttpClient.interceptors.response.use(
    (response) => {
         clearTimeout(timerLoading)

        common.endLoading()
        
        if (
            response.headers["content-type"] ===
            "application/octet-stream;charset=UTF-8"
        ) {
            return response.data || null;
        }
        const { code, message } = response.data;
        return response.data || null;
    },
    (error) => {
         clearTimeout(timerLoading)
        
        common.endLoading()
        // store.globalLoading=false;
        // debugger;
        // error.response.data.messages
        if (error && error.response) {
            switch (error.response.status) {
                case 0:
                    // common.showError({ "عدم ارتباط با سرور": { "": "با مدیر سامانه تماس بگیرید" } })
                    break;
                case 400:
                    console.log("وقوع خطا در سمت سرور...");
                    // common.showError({ "وقوع خطا در سمت سرور...": { "": "" } })

                    break;
                case 401:
                    console.log("عدم احراز هویت");
                    // common.showError({ "عدم احراز هویت": { "": "" } })

                    //window.location.href = "/account/auth";
                    routerInstance.push("/account/login");
                    break;
                case 403:
                    console.log("مشکل عدم دسترسی");
                    // common.showError({ "مشکل عدم دسترسی": { "": "" } })

                    //window.location.href = "/account/auth";
                    routerInstance.push("/accessDenied");
                    break;
                case 404:
                    console.log("درخواست شما سمت سرور یافت نشد");
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
                    console.log(`http client status : ${error.response.status}`);
            }
        } else {
            // router.replace({
            //     name: "500",
            // });
        }
        return Promise.reject(error.response);
    }
);

return HttpClient;
  }
  
// export default defineNuxtPlugin((nuxtApp) => {
//     const defaultUrl = "<https://localhost:5001>";

//     let api = axios.create({
//       baseUrl: defaultUrl,
//       headers: {
//         common: {},
//       },
//     });
//   return {
//       provide: {
//         api: api,
//       },
//     };
//   });

// export const HttpClient = axios.create({
//     baseURL: 'http://test.ir/',
//     timeout: 20000,
//     headers: {
//         "Content-Type": "application/json;charset=UTF-8",
//         Accept: "application/json",
//         "Access-Control-Allow-Origin": "*",

//     },
// });

// HttpClient.interceptors.request.use(
//     (config) => {
//         debugger
//         // if (config.isLoading)
//         // store.globalLoading=true;
//         const token=window.localStorage.getItem('token')
   
//         if (token) {
//             config.headers["authorization"] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         console.log(error); // for debug
//         return Promise.reject(error);
//     }
// );

// HttpClient.interceptors.response.use(
//     (response) => {
//         debugger
//         // store.globalLoading=false;
//         if (
//             response.headers["content-type"] ===
//             "application/octet-stream;charset=UTF-8"
//         ) {
//             return response.data || null;
//         }
//         const { code, message } = response.data;
//         return response.data || null;
//     },
//     (error) => {
//         // store.globalLoading=false;
//         // debugger;
//         if (error && error.response) {
//             switch (error.response.status) {
//                 case 0:
//                     // common.showError({ "عدم ارتباط با سرور": { "": "با مدیر سامانه تماس بگیرید" } })
//                     break;
//                 case 400:
//                     console.log("وقوع خطا در سمت سرور...");
//                     // common.showError({ "وقوع خطا در سمت سرور...": { "": "" } })

//                     break;
//                 case 401:
//                     console.log("عدم احراز هویت");
//                     // common.showError({ "عدم احراز هویت": { "": "" } })

//                     //window.location.href = "/account/auth";
//                     routerInstance.push("/account/login");
//                     break;
//                 case 403:
//                     console.log("مشکل عدم دسترسی");
//                     // common.showError({ "مشکل عدم دسترسی": { "": "" } })

//                     //window.location.href = "/account/auth";
//                     routerInstance.push("/accessDenied");
//                     break;
//                 case 404:
//                     console.log("درخواست شما سمت سرور یافت نشد");
//                     // common.showError({ "درخواست شما سمت سرور یافت نشد": { "": "" } })
//                     break;
//                 case 405:
//                     break;
//                 case 408:
//                     break;
//                 case 411:
//                     break;
//                 case 413:
//                     break;
//                 case 414:
//                     break;
//                 case 415:
//                     break;
//                 case 500:
//                     // common.showError({ "خطا در سمت سرور": { "": "با مدیر سامانه تماس بگیرید" } })
//                     break;
//                 case 501:
//                     break;
//                 case 502:
//                     break;
//                 case 503:
//                     break;
//                 case 504:
//                     break;
//                 case 505:
//                     break;
//                 default:
//                     console.log(`http client status : ${error.response.status}`);
//             }
//         } else {
//             // router.replace({
//             //     name: "500",
//             // });
//         }
//         return Promise.reject(error);
//     }
// );
// export default HttpClient;