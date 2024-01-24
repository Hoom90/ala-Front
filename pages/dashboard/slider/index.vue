<script setup>
import imageComp from "@/components/image.vue"
import validator from "@/composables/validator";

dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'اسلایدر ',
    disabled: true,
    to: '/dashboard/slider',
  }])


const verifyForm = ref({});
const slidePic = ref()
const state = reactive({
  slider: {},
  sliderId: 0,
  editDialog: false,
  deleteDialog: false,
  formTitle: null,
  sliders: [],
  editState: false,

  slides: [],
  slide: {},
  imageId: null,
  editDialogSlide: false,
  isEdit: false
})

//#region Slider
//#region GET
const getData = async () => {
  axiosApi().get(apiPath.Slider.get.all)
    .then((res) => {
      state.sliders = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}
getData()
//#endregion

const saveSlider = async (s) => {
  if (s){
    const { valid } = await verifyForm.value.validate()
    if (!valid) {
      common.showError('موارد ضروری را وارد کنید')
      return
    }
  
    if(state.slider.title.length < 4){
      common.showError('عنوان حداقل باید 4 کاراکتر داشته باشد')
      return
    }
      if (state.editState)
        putSlider()
      else
        postNewSlider()
  }
  else
    state.editDialog = false
}

//#region POST
const postNewSlider = async () => {
  await axiosApi().post(apiPath.Slider.post, state.slider)
    .then(res => {
      common.showMessage(res.messages)
      getData()
    })
    .catch(error => {
      common.showError(error?.data?.messages)
    })
    .finally(() => {
      close()
    })
}
//#endregion

//#region PUT
const putSlider = async () => {
  await axiosApi().put(apiPath.Slider.update, state.slider)
    .then(res => {
      common.showMessage(res.messages)
      getData()
    })
    .catch(error => {
      common.showError(error?.data?.messages)
    })
    .finally(() => {
      close()
    })
}
//#endregion

//#region DELETE
const deleteSlider = async (r) => {
  if (r) {
    await axiosApi().delete(apiPath.Slider.delete + state.slider.id)
      .then(res => {
        common.showMessage(res.messages)
        getData()
        selectSlider([state.sliderId])
      })
      .catch(error => {
        common.showError(error?.data?.messages)
      })
      .finally(() => {
        close()
      })
  }
  else
    state.deleteDialog = false
}
//#endregion

//#region MODAL
const close = () => {
  state.slider = {}
  state.editDialog = false;
  state.deleteDialog = false
}

const handleSelect = (item) => {
  state.editDialog = true;
  state.editState = false
  state.slider = {}
  if (item) {
    state.slider = { ...item }
    state.editState = true
  }
}

const handleDelete = (item) => {
  state.deleteDialog = true
  if (item)
    state.slider = { ...item }
}
//#endregion
//#endregion

//#region Slide
//#region GET All
const selectSlider = (id) => {
  state.sliderId = id[0]
  if (state.sliderId)
    axiosApi().get(apiPath.Slide.get.all + id)
      .then(res => {
        state.slides = res.data
      })
      .catch(error => {
        common.showError(error?.data?.messages)
      })
      .finally(() => {
      })
}
//#endregion

//#region POST
const postSlide = async () => {
  const { valid } = await verifyForm.value.validate()

  // if(state.slide.title?.length < 4){
  //   common.showError('عنوان حداقل باید 4 کاراکتر داشته باشد')
  //   return
  // }

  if(!state.imageId){
    slidePic.value.style.color = 'red';
    return
  }

  if(!valid){ return}


  slidePic.value.style.color = '';

  state.slide.imageId = state.imageId
  state.slide.parentId = state.sliderId

  await axiosApi().post(apiPath.Slide.post, state.slide)
    .then(res => {
      state.editDialogSlide = false
      common.showMessage(res.messages)
      selectSlider([state.sliderId])
    })
    .catch(error => {
      common.showError(error?.data?.messages)
    })
    .finally(() => {

    })
}
//#endregion

//#region PUT
const putSilde = async () => {
  const { valid } = await verifyForm.value.validate()

  // if(state.slide.title.length < 4){
  //   common.showError('عنوان حداقل باید 4 کاراکتر داشته باشد')
  //   return
  // }

  if(!state.imageId){
    slidePic.value.style.color = 'red';
    return
  }

  if(!valid){ return}

  slidePic.value.style.color = '';

  state.slide.imageId = state.imageId
  state.slide.parentId = state.sliderId

  await axiosApi().put(apiPath.Slide.update, state.slide)
    .then(res => {
      state.editDialogSlide = false
      common.showMessage(res.messages)
      selectSlider([state.sliderId])
    })
    .catch(error => {
      common.showError(error?.data?.messages)
    })
    .finally(() => {

    })
}
//#endregion

//#region MODAL
const selectSlide = (item) => {
  if (state.sliderId) {
    state.editDialogSlide = true
    state.isEdit = false
    state.imageFile = null
    state.imagePath = null
    state.slide = {}
    if (item) {
      state.slide = { ...item }
      state.imageFile = state.slide.imageId
      state.imageId = state.slide.imageId
      state.isEdit = true
    }
  }
}
//#endregion

const saveSlide = async (s) => {
  if (s) {
    if (state.isEdit) {
      await putSilde()
    }
    else {
      await postSlide()
    }
  }
  else {
    state.editDialogSlide = false
    state.imageId = null
    state.imageFile = null
    state.slide = {}
  }
}
//#endregion

</script>
<template>
  <v-row class="mb-3">
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title class="d-flex">
          اسلایدر
          <v-btn class="bg-blue-grey-lighten-1 ms-auto" size="large" @click="handleSelect()">
            <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
            ایجاد اسلایدر جدید
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-list class="mt-3" select-strategy="single-independent" @update:selected="selectSlider">
          <v-list-item v-for="slider in state.sliders" :key="slider.id" :value="slider.id">
            <v-list-item-title> {{ slider.title }} </v-list-item-title>
            <template v-slot:append>
              <v-list-item-action start>
                <v-btn variant="plain" class="px-1" @click="handleSelect(slider)">
                  <v-icon icon>mdi-pen</v-icon></v-btn>
                <v-btn variant="plain" class="px-1" @click="handleDelete(slider)">
                  <v-icon icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <v-card>
        <v-card-title class="d-flex">
          اسلاید
          <v-btn @click="selectSlide()" class="bg-blue-grey-lighten-1 ms-auto" size="large" :disabled="state.sliderId == 0 ? true : false">
            <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
            ایجاد اسلاید جدید
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>


        <div class="ma-3">

          <v-row>
            <v-col cols="6" md="4" lg="3" v-for="item in state.slides" :key="item.id">
              <v-card>
                <imageComp :src="item.imageId" min-height="125" style="cursor: pointer;" @click="selectSlide(item)">
                </imageComp>
                <v-card-text>
                  <span>{{ item.title }}</span>
                  <div class="d-flex mx-auto">
                    <v-btn @click="handleDelete(item)" color="red" variant="text" class="float-left">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                    <v-btn @click="selectSlide(item)" color="green" variant="text" class="float-left">
                      <v-icon>mdi-pencil-outline</v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

      </v-card>
    </v-col>
  </v-row>

  <!-- edit Slide form -->
  <mj-dialog v-model="state.editDialogSlide" title="اسلاید" :action-btn="true" action-btn-text="ذخیره" :cancel-btn="true"
    action-type="primary" @action-callback="saveSlide" size="sm">
    <v-form @submit.prevent="saveSlide" ref="verifyForm">

      <v-text-field v-model="state.slide.title" variant="outlined" label="عنوان اسلاید" :rules="validator.slider.title"></v-text-field>
      <v-text-field v-model="state.slide.description" variant="outlined" label="توضیحات"></v-text-field>
      <v-text-field v-model="state.slide.link" variant="outlined" label="لینک"></v-text-field>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="state.slide.sort" type="number" variant="outlined" label="ترتیب"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-switch class="justify-center d-flex v-locale--is-ltr" v-model="state.slide.isActive"
            color="blue-grey-lighten-1" :label="state.slide?.isActive ? 'فعال' : 'غیر فعال'"></v-switch>
        </v-col>
      </v-row>
      <p ref="slidePic">عکس اسلاید*</p>
      <div class=" text-center ma-4 ">
        <imageUploader v-model="state.imageId" customeClass="mx-auto w-50"></imageUploader>
      </div>
    </v-form>
  </mj-dialog>





  <!-- edit Slider form -->
  <mj-dialog v-model="state.editDialog" title="اسلایدر" :action-btn="true" action-btn-text="ذخیره" :cancel-btn="true"
    action-type="primary" @action-callback="saveSlider" size="sm">
    <v-form @submit.prevent="saveSlider" ref="verifyForm">
      <v-text-field v-model="state.slider.title" variant="outlined" label="نام اسلایدر را وارد کنید" :rules="validator.slider.title"></v-text-field>
      <v-switch class="justify-center d-flex v-locale--is-ltr" v-model="state.slider.isActive" color="blue-grey-lighten-1"
        :label="state.slider?.isActive ? 'فعال' : 'غیر فعال'"></v-switch>
    </v-form>
  </mj-dialog>


  <!-- delete item form -->
  <mj-dialog v-model="state.deleteDialog" title="حذف" :action-btn="true" action-btn-text="حذف شود" :cancel-btn="true"
    action-type="error" @action-callback="deleteSlider" size="sm">
    <p>
      '{{ state.slider?.title }}' حذف می شود.
      <br />
      آیا مطمئن هستید؟ عملیات حذف غیر قابل بازگشت است!
    </p>
  </mj-dialog>
</template>

