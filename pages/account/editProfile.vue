<script setup>
import validator from "@/composables/validator"
import avatar from "@/assets/img/avatar.png"
import imageUpload from "@/components/imageUploader.vue"
import fileUpload from "@/components/fileUploader/fileUploader.vue"
import {uploadFile} from "@/components/fileUploader/uploadFunc.js"
import categorySelect from "@/components/CategoryCard.vue"
const verifyForm = ref({});
const user = userStore()
const state = reactive({
  user: [],
  item: null,
  tab: null,
  userImage: avatar,
  expertImages: null,
})

//#region GET
onMounted(async () => {
  await getExpert()
  await getUser()
  await getProvinces()
})

const getUser = async () => {
  await axiosApi().get(apiPath.UserInfo)
    .then((res) => {
      state.user = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const getExpert = async () => {
  await axiosApi().get(apiPath.ExpertInfo)
    .then((res) => {
      state.expert = res.data
      if (state.expert.imageIds) {
        state.expertImages = state.expert.imageIds
      }
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const getProvinces = async () => {
  // await axiosApi().get(apiPath.Province.get.cities)
  await axiosApi().get(apiPath.User.Province.get)
    .then((res) => {
      state.province = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

//#endregion

//#region POST
const postData = async () => {
  const { valid } = await verifyForm.value.validate()
  if (!valid){
    common.showError('موارد ضروری را وارد کنید')
    return
  }
  if (state.tab == 1) {
    await postUserData()
  }
  if (state.tab == 2) {
    await postExpertData()
  }
}

const postUserData = async () => {
  await axiosApi().post(apiPath.ChangeProfile, state.user)
    .then((res) => {
      common.showMessage(res.messages)
      getUser()
      let user = localStorage.getUser()
      user.firstName = state.user.firstName
      user.lastName = state.user.lastName
      user.imageId = state.user.imageId
      localStorage.saveUser(user)
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const postExpertData = async () => {
  state.expert.imageIds =  await uploadFile(state.expertImages)
  await axiosApi().put(apiPath.ExpertRequest, state.expert)
    .then((res) => {
      common.showMessage(res.messages)
      getExpert()
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}
//#endregion

const setImageId = (value) => {
  state.user.imageId = value
}

const setFileId = (value) => {
  state.expertImages = value
}
fileUpload.upload

</script>

<template>
  <fieldset class="myFieldset rounded-xl">
    <h3>ویرایش کاربری</h3>
  </fieldset>
  <v-tabs v-model="state.tab" align-tabs="center" fixed-tabs>
    <v-tab value="1">اطلاعات عمومی</v-tab>
    <v-tab value="2" v-if="user.getIsConsultant ? true : false">اطلاعات اختصاصی</v-tab>
  </v-tabs>
  <fieldset class="myFieldset rounded-xl">
    <v-form @submit.prevent="postData" ref="verifyForm" :readonly="user.getIsConsultant ? true : false">
      <v-window v-model="state.tab">
        <v-window-item value="1" class="mt-3">
          <v-row>
            <!-- فرم -->
            <v-col cols="12" lg="8" class="order-2 order-lg-1">
              <v-text-field variant="outlined" label="نام" v-model="state.user.firstName" :rules="validator.user.firstName"></v-text-field>
              <v-text-field variant="outlined" label="نام خانوادگی" v-model="state.user.lastName" :rules="validator.user.lastName"></v-text-field>
              <v-text-field variant="outlined" label="شماره موبایل" v-model="state.user.phoneNumber" readonly></v-text-field>
              <v-text-field variant="outlined" label="توضیحات" v-model="state.user.description"></v-text-field>
              <v-text-field variant="outlined" label="آدرس" v-model="state.user.address"></v-text-field>
            </v-col>
            <!-- فایل -->
            <v-col cols="12" lg="4" class="order-1 order-lg-2">
              <imageUpload v-model="state.user.imageId" @update:modelValue="setImageId" customeClass="mx-auto">
              </imageUpload>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- فرم ویرایش کاربر مشاور -->
        <v-window-item value="2" class="mt-3">
          <v-row>
            <!-- فرم -->
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="state.expert.nationalCode" variant="outlined" label="کد ملی"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="customDatePicker">
                    <input type="text" id="my-custom-editable-input" placeholder="تاریخ تولد" readonly>
                    <button type="button" @click="state.showDatePicker = true" :disabled="(state.tab == 2 && state.expert?.changeProfileLock) ? true : false">
                      <v-icon>
                        mdi-calendar-month-outline
                      </v-icon>
                    </button>
                  </div>
                  <date-picker append-to="#mainForm" :show="state.showDatePicker" v-model="state.expert.dateOfBirth"
                    :editable="true" simple format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD"
                    custom-input="#my-custom-editable-input" @close="state.showDatePicker = false" clearable />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select label="جنسیت" variant="outlined" v-model="state.expert.gender" :items="constract.gender"
                    :item-title="constract.gender.title" :item-value="constract.gender.id"></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="مبلغ مشاوره" type="number" variant="outlined" :rules="validator.expert.counselingAmount"
                    v-model="state.expert.counselingAmount"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete label="محل تولد" :items="state.province" :rules="validator.expert.placeOfBirth"
                    item-title="fullTitle" item-value="id" v-model="state.expert.placeOfBirth"
                    variant="outlined"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="کد نظام پزشکی" variant="outlined" :rules="validator.expert.medicalNumber"
                    v-model="state.expert.medicalNumber"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete label="مدرک" :items="constract.grade" item-value="id" item.title="title"
                    :rules="validator.expert.grade" v-model="state.expert.grade" variant="outlined"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="جمله انگیزشی" variant="outlined"
                    v-model="state.expert.motivationalSentence"></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea v-model="state.expert.additionalText" variant="outlined" label="رزومه"
                    placeholder="چند جمله درباره رزومه کاری خود بنویسید"></v-textarea>
                </v-col>
                <!-- <v-col cols="12" md="6">
                  <v-switch label="درخواست تعیین به عنوان مشاور" color="info"></v-switch>
                </v-col> -->
              </v-row>
            </v-col>
            <!-- <v-col cols="12" md="4">
              <lazy-image class="rounded-xl mb-3"></lazy-image>
              <lazy-image class="rounded-xl mb-3" v-for="image in state.expert.imageIds"></lazy-image>
              <categorySelect v-model="state.expert.categoryIds" :rules="validate.categoryIds" />
            </v-col> -->

            <!-- فایل -->
            <v-col cols="12" md="4">
              <v-col>
                <h3 v-if="(state.tab == 2 && state.expert?.changeProfileLock) ? true : false">تخصص ها</h3>
                <categorySelect v-model="state.expert.categoryIds" :rules="validator.expert.categoryIds" :disabled="(state.tab == 2 && state.expert?.changeProfileLock) ? true : false"/>
              </v-col>
              <fileUpload :imageIds="state.expertImages ?? state.expert.imageIds" @update:modelValue="setFileId" customeClass="mx-auto" :disabled="(state.tab == 2 && state.expert?.changeProfileLock) ? true : false">
              </fileUpload>
              <small>
                <ul class="pa-5 text-red">
                  <li>شناسنامه(همه صفحات)</li>
                  <li>کارت ملی(پشت و رو)</li>
                  <li>مدرک تحصیلی(معتبر)</li>
                </ul>
              </small>
            </v-col>
          </v-row>
        </v-window-item>

      </v-window>
      <v-btn type="submit" class="bg-info" size="large" :disabled="(state.tab == 2 && state.expert?.changeProfileLock) ? true : false" block>ثبت</v-btn>
    </v-form>

  </fieldset>
</template>

<style>
a.filepond--credits {
  display: none !important;
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