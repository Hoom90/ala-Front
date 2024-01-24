<script setup>
import imageComp from "@/components/image.vue"
import categorySelect from "@/components/CategoryCard.vue"
import validator from "~/composables/validator";
const route = useRoute()
const verifyForm = ref({});
const state = reactive({
    expert: {},
    province: [],
    showDatePicker: false,
    uploadImage: false,
    currentDate: dateConverter.convertToJalali(new Date())
})

dashboardbreadcrumbstore().setBreadCrumbs([
    {
        title: 'مشاوران ',
        disabled: false,
        to: '/dashboard/expert/list',
    },
    {
        title: `ویرایش مشاور`,
        disabled: true,
    }])

onMounted(() => {
    tinyMCEInit()
    state.expert.dateOfBirth = new Date()
})


const tinyMCEInit = () => {

    tinyMCE.editors = [];

    tinyMCE.init({
        mode: "exact",
        elements: "expertResume",
        height: 200,
        themes: "advanced",
        skin: "lightgray",
        plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools'
        ],
        menubar: 'file tools edit insert format view table',
        toolbar1: ' fontsizeselect fontselect | bold italic | alignleft aligncenter alignright alignjustify  | link image',
        toolbar2: ' bullist numlist outdent indent | forecolor backcolor emoticons | ltr rtl | themes datebutton | ',
        directionality: "rtl",
        language: 'fa_IR',
        init_instance_callback: loadExpert,
        filemanager_title: "Responsive File Manager",
        file_browser_callback: function (field_name) {
            window.open('/Admin/FileManager/Index?out=' + field_name + '&act=ImageBrowser&typ=single', 'ImageBrowser', 'width=900,height=600,scrollbars=no,status=yes,location=no,resizable=yes,dependent');
        }
    });

}


//#region GET
const loadExpert = async () => {
    await axiosApi().get(apiPath.Expert.get.byId(route.params.id))
        .then(r => {
            state.expert = r.data
            tinymce.get('expertResume').setContent(r.data.additionalText ?? '');
            getProvinces()
        }).catch(e => {
            common.showError(e.data?.messages)
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
//#endregion

//#region PUT
const putData = async () => {
    const { valid } = await verifyForm.value.validate()
    if (!valid) {
        common.showError('موارد ضروری را وارد کنید')
        return
    }
    state.expert.additionalText = tinyMCE.get("expertResume").getContent();
    await axiosApi().put(apiPath.Expert.update, state.expert)
        .then(r => {
            common.showMessage("مشاور ویرایش شد")
            // router.push('/dashboard/expert/list')
        }).catch(e => {
            common.showError(e?.data?.messages)
        })
}
//#endregion

</script>

<template>
    <v-form @submit.prevent="putData" ref="verifyForm">
        <v-row>
            <!-- فرم -->
            <v-col cols="12" md="8" lg="9">
                <v-card>
                    <v-card-title>
                        مشخصات مشاور
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field label="نام*" variant="outlined" v-model="state.expert.firstName"
                                    :rules="validator.expert.firstName"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="نام خانوادگی*" variant="outlined" :rules="validator.expert.lastName"
                                    v-model="state.expert.lastName"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="شماره موبایل*" variant="outlined" :rules="validator.expert.phoneNumber"
                                    v-model="state.expert.phoneNumber"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-checkbox label="تائید مشاور" v-model="state.expert.isConfirm" />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-checkbox label="قفل تغیر اطلاعات" v-model="state.expert.changeProfileLock" />
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="کد ملی*" variant="outlined" :rules="validator.expert.nationalCode"
                                    v-model="state.expert.nationalCode"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="تاریخ تولد" variant="outlined" readonly v-model="state.currentDate"
                                    @click="state.showDatePicker = true" :rules="validator.expert.nationalCode"
                                    id="birthDayDatePicker"></v-text-field>
                                <date-picker append-to="#mainForm" v-model="state.expert.dateOfBirth"
                                    :show="state.showDatePicker" simple format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD"
                                    custom-input="#birthDayDatePicker" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select label="جنسیت" variant="outlined" v-model="state.expert.gender"
                                    :rules="validator.expert.gender"
                                    :items="constract.gender" :item-title="constract.gender.title"
                                    :item-value="constract.gender.id"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="مبلغ مشاوره*" type="number" variant="outlined"
                                    :rules="validator.expert.counselingAmount"
                                    v-model="state.expert.counselingAmount"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-autocomplete label="محل تولد" :items="state.province" :rules="validator.expert.placeOfBirth"
                                    item-title="fullTitle" item-value="id" v-model="state.expert.placeOfBirth"
                                    variant="outlined"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="کد نظام پزشکی*" variant="outlined" :rules="validator.expert.medicalNumber"
                                    v-model="state.expert.medicalNumber"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-autocomplete label="مدرک" :items="constract.grade" item-value="id" item.title="title"
                                    :rules="validator.expert.grade" v-model="state.expert.grade"
                                    variant="outlined"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="جمله انگیزشی" variant="outlined"
                                    v-model="state.expert.motivationalSentence"></v-text-field>
                            </v-col>

                            <v-col cols="12">

                                <textarea id="expertResume" rows="5"></textarea>

                            </v-col>
                        </v-row>
                    </v-card-text>

                </v-card>
            </v-col>
            <!-- فایل -->
            <v-col cols="12" md="4" lg="3">
                <v-card class="pa-3 mb-5">
                    <div class="align-items-center text-center">
                        <imageUploader v-model="state.expert.imageId" customeClass="mx-auto"></imageUploader>
                        <hr class="my-4" />
                        <v-btn type="submit" variant="tonal" class="bg-blue-grey-lighten-1" block
                            :disabled="state.uploadImage">{{
                                state.uploadImage ? 'لطفا صبر کنید...' : 'ذخیره اطلاعات' }} </v-btn>
                    </div>
                </v-card>
                <v-card class="mb-5">
                    <v-card-text>
                        <categorySelect v-model="state.expert.categoryIds" :rules="validator.expert.categoryIds" />
                    </v-card-text>
                </v-card>
                <v-card class="mb-5">
                    <v-card-title>فایلهای بارگزاری شده</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <small>
                            <ul class="pa-5 text-red">
                                <li>شناسنامه(همه صفحات)</li>
                                <li>کارت ملی(پشت و رو)</li>
                                <li>مدرک تحصیلی(معتبر)</li>
                            </ul>
                        </small>
                        <v-row>
                            <v-col cols="12" lg="6" v-for="doc in state.expert.imageIds"><imageComp :name="doc" class="ma-1"></imageComp></v-col>
                        </v-row>
                        <h3 v-if="state.expert.imageIds?.length == 0" class="text-center border pa-3 rounded-lg mt-3">فایلی بارگزاری نشده است!</h3>
                    </v-card-text>
                    <v-divider></v-divider>
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