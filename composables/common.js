
// const { $swal } = useNuxtApp();
import swal from 'sweetalert2'
let swalLoading
let delayCallFunction
export default
    {
        showError(text, delay = 5) {
            text = text ?? 'خطای ناشناخته'
            setTimeout(() => {
                swal.fire({
                    title: "خطا",
                    text: text,
                    icon: 'error',
                    confirmButtonText: 'باشه',
                    timer: delay * 1000,
                });
            }, 100);
        },
        showMessage(text, delay = 5) {
            setTimeout(() => {
                swal.fire({
                    title: "موفق",
                    text: text,
                    icon: 'success',
                    confirmButtonText: 'باشه',
                    timer: delay * 1000,
                });
            }, 100);
        },
        insertParams(obj) {
            let query = ''
            let keys = Object.keys(obj)
            for (let key of keys)
                if (obj[key])
                    query = this.updateQueryStringParameter(query, key, obj[key])

            return query
        },

        updateQueryStringParameter(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        },
        globalLoading() {
            swalLoading = swal.fire({
                title: 'لطفا صبر کنید',
                allowEscapeKey: false,
                allowOutsideClick: false,
                // timer: 2000,
                // timerProgressBar: true,
                didOpen: () => {
                    swal.showLoading();
                }
            }).then(

            )
        },
        endLoading() {
            swal.close()
        },
        callDelay(func,input, delay = 1000) {
            clearTimeout(delayCallFunction)
            delayCallFunction = setTimeout(() => {
                func(input)
            }, delay);
        }

    }