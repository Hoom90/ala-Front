<script setup>
import avatar from "@/assets/img/avatar.png"
import validator from "~/composables/validator";
const router = useRouter()
const route = useRoute()
const verifyForm = ref({});
const state = reactive({
    pageTitle: "افزودن",
    showDatePicker: false,
    user: {},
    expert: {},
    province: [],
    categories: [],
    userImage: avatar,
    uploadImage: false,
    uploadButtonText: 'انتخاب تصویر'
})

if (route.params.id) {
    state.pageTitle = "ویرایش"
}

dashboardbreadcrumbstore().setBreadCrumbs([
    {
        title: 'کاربران ',
        disabled: false,
        to: '/dashboard/user/list',
    },
    {
        title: `${state.pageTitle} کاربر`,
        disabled: true,
    }])

//#region GET
const getData = async () => {
    let id = route.params.id == '' ? null : route.params.id
    if (id) {
        getUsers()
    }
    getCategory()
    getProvinces()
}

const getUsers = async () => {
    await axiosApi().get(apiPath.Users.get.single + route.params.id)
        .then((res) => {
            state.user = res.data
            // if (state.user?.imageId) {
            //     state.userImage = state.user.imageId
            // }
        })
        .catch((error) => {
            common.showError(error?.data?.messages)
        })
}

const getCategory = async () => {
    await axiosApi().get(apiPath.Category.get.all)
        .then((res) => {
            state.categories = res.data
        })
        .catch((error) => {
            common.showError(error?.data?.messages)
        })
}

const getProvinces = async () => {
    await axiosApi().get(apiPath.Province.get.cities)
        .then((res) => {
            state.province = res.data
        })
        .catch((error) => {
            common.showError(error?.data?.messages)
        })
}
getData()
//#endregion

//#region POST
const postUser = async () => {
    await axiosApi().post(apiPath.Users.post, state.user)
        .then((res) => {
            if (res.failed) {
                common.showError(res.messages)
            }
            common.showMessage("کاربر ایجاد شد")
            router.replace(`/dashboard/user/${res.data}`)
        }).catch(e => {
            common.showError(e?.data?.messages)
        })
}
//#endregion

//#region PUT
const putUser = async () => {
    await axiosApi().put(apiPath.Users.update, state.user)
        .then((res) => {
            if (res.failed) {
                common.showError(res.messages)
                return
            }
            common.showMessage("کاربر ویرایش شد")
            // router.push('/dashboard/user/list') 
        }).catch(e => {
            common.showError(e?.data?.messages)
        })
}
//#endregion

const save = async () => {
    const { valid } = await verifyForm.value.validate()
    if (!valid) {
        common.showError('موارد ضروری را وارد کنید')
        return
    }

    if (route.params.id) {
        putUser()
    }
    else {
        postUser()
    }
}

</script>
<template>
    <v-form @submit.prevent="save" ref="verifyForm" id="mainForm">
        <v-row>
            <v-col cols="12" md="8" lg="9">
                <v-card class="mb-5">
                    <v-card-title>مشخصات کاربر</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field label="نام*" variant="outlined" v-model="state.user.firstName"
                                    :rules="validator.user.firstName"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="نام خانوادگی*" variant="outlined" v-model="state.user.lastName"
                                    :rules="validator.user.lastName"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-text-field label="شماره موبایل*" variant="outlined" v-model="state.user.phoneNumber"
                                    :rules="validator.user.phoneNumber"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="آدرس" variant="outlined" v-model="state.user.address"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea rows="2" label="توضیحات" variant="outlined"
                                    v-model="state.user.description"></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <div class="d-flex">
                                    <v-checkbox v-model="state.user.isActive" label="فعال" color="info"
                                        hide-details></v-checkbox>
                                    <v-checkbox v-model="state.user.isRegistered" label="تکمیل ثبت نام" color="info"
                                        hide-details></v-checkbox>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>

                </v-card>
            </v-col>
            <!-- بارگزاری عکس -->
            <v-col cols="12" md="4" lg="3">
                <v-card class="pa-3 mb-5">
                    <div class="align-items-center text-center">
                        <imageUploader v-model="state.user.imageId" customeClass="mx-auto"></imageUploader>
                        <!-- <label>
                            <imageComp :name="state.user.imageId" :path="state.userImage" :no-image="noImage"
                                custom-class="rounded-circle profile-image mx-auto mb-2" style="width:150px"></imageComp>
                            <input type="file" class="d-none" @change="fileUploadSelect" v-if="!state.uploadImage">

                            <v-alert border="start" border-color="deep-purple accent-4" elevation="2"
                                class="mx-auto pa-2 cursor-pointer" width="135px">
                                {{ state.uploadButtonText }}
                            </v-alert>
                        </label> -->
                        <hr class="my-4" />

                        <v-btn type="submit" variant="tonal" class="bg-blue-grey-lighten-1" block
                            :disabled="state.uploadImage">{{
                                state.uploadImage ? 'لطفا صبر کنید...' : 'ذخیره اطلاعات' }} </v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-form>
</template>

<style>
.profile-image {
    border: solid 1px #b3b3b3;
    padding: 3px;
}

.cursor-pointer {
    cursor: pointer;
}

.customDatePicker {
    display: flex;
    justify-content: space-between;
    border: 1px solid rgb(133, 133, 133);
    padding: 15px;
    border-radius: 3px;

}

.customDatePicker input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
}
</style>