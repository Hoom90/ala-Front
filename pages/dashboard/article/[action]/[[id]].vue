<script setup>
import validator from "~/composables/validator";
import CategorySelect from "@/components/CategoryCard.vue";

dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'مقالات ',
    disabled: false,
    to: '/dashboard/article/list',
  }, {
    title: 'مقاله جدید ',
    disabled: true,
    to: '/dashboard/article/add/',
  }])

const verifyForm = ref({});
const route = useRoute()
const router = useRouter()

const state = reactive({
  articleData: [],
  categoryList: [],
  files: [],
  formData: {
    title: null,
    body: null,
    status: 2,
    categoryIds: [],
    contentType: 1,
    commentShow: false,
    commentStatus: false,
    keywordList: [],
    summary: null,
  },
  imageId: null,
})


const tinyMCEInit = () => {

  tinyMCE.editors = [];

  tinyMCE.init({
    mode: "exact",
    elements: "articleBody",
    height: 300,
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
    init_instance_callback: load,
    filemanager_title: "Responsive File Manager",
    file_browser_callback: function (field_name) {
      window.open('/Admin/FileManager/Index?out=' + field_name + '&act=ImageBrowser&typ=single', 'ImageBrowser', 'width=900,height=600,scrollbars=no,status=yes,location=no,resizable=yes,dependent');
    }
  });

}

onMounted(() => {

  tinyMCEInit()

})


/**
 * create article
 * @param event
 * @returns {Promise<void>}
 */
const save = async (event) => {
  const { valid } = await verifyForm.value.validate()
  if (!valid) {
    common.showError('موارد ضروری را وارد کنید')
    return
  }

  if(state.formData.title.length < 4){
    common.showError('عنوان حداقل باید 4 کاراکتر داشته باشد')
    return
  }

  if (state.imageId)
    state.formData.imageIds = [state.imageId]
  state.formData.body = tinyMCE.get("articleBody").getContent()

  if (state.formData?.id) {
    await axiosApi().put(apiPath.Article.update, state.formData)
      .then(common.showMessage('مقاله با موفقیت ویرایش شد'))
      .catch(e => {
        common.showError(e?.data?.messages)
      })
  }
  else {
    await axiosApi().post(apiPath.Article.post, state.formData)
      .then(r => {
        common.showMessage('مقاله با موفقیت ذخیره شد')
        router.push('/dashboard/article/edit/' + r.data)
      }).catch(e => {
        common.showError(e?.data?.messages)
      })
  }
}

/**
 * edit article
 * @returns {Promise<void>}
 */
const load = async () => {
  if (Number(route.params.id))
    await axiosApi().get(apiPath.Article.get.byId + route.params.id)
      .then(r => {
        state.formData = r.data
        dashboardbreadcrumbstore().setBreadCrumbs([
          {
            title: 'مقالات ',
            disabled: false,
            to: '/dashboard/article/list',
          }, {
            title: state.formData.title,
            disabled: true,
            to: '/dashboard/article/edit/' + state.formData.id,
          }])
        tinymce.get('articleBody').setContent(state.formData.body);
        if (state.formData?.imageIds?.length > 0) {
          state.imageId = state.formData.imageIds[0]
          state.imageIsUploaded = true
        }
      }).catch(e => {
        common.showError(e?.data?.messages)
      })
}
</script>
<template>
  <v-form @submit.prevent="save" ref="verifyForm">
    <v-row>
      <v-col cols="12" md="8" lg="9">
        <v-card>
          <v-card-text>
            <v-text-field v-model="state.formData.title" variant="outlined" size="x-large" label="عنوان مقاله*"
              :rules="validator.content.title" counter="50" counter-value></v-text-field>

            <v-textarea v-model="state.formData.summary" variant="outlined" label="چکیده مقاله*"
              placeholder="چند جمله مقاله..." :rules="validator.content.summery" rows="5"></v-textarea>

            <textarea id="articleBody" rows="10"></textarea>

            <v-row class="mt-3">
              <v-col cols="12" lg="3" sm="6">
                <v-checkbox v-model="state.formData.commentStatus" label="نمایش نظرات"></v-checkbox>
              </v-col>
              <v-col cols="12" lg="3" sm="6">
                <v-checkbox v-model="state.formData.commentShow" label="نمایش خودکار نظرات"></v-checkbox>
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" lg="3">

        <v-card class="mb-5">
          <v-card-text>
            <v-btn block type="submit" class="bg-blue-grey-lighten-1" size="x-large">ذخیره</v-btn>
            <v-divider class="mt-4"></v-divider>
            <div class="d-flex">
              <label for="status" class="mt-4">ذخیره به عنوان پیش نویس</label>
              <v-switch id="status" v-model="state.formData.status" class="d-inline-flex justify-end" :false-value="2"
                :true-value="1" color="red"></v-switch>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mb-5">
          <v-card-title>دسته بندی</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <CategorySelect v-model="state.formData.categoryIds" />
          </v-card-text>
        </v-card>
        
        <v-card class="mb-5">
          <v-card-title>برچسب ها</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-combobox v-model="state.formData.keywordList" chips clearable multiple filled append-icon=""
              variant="outlined">
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip small v-bind="attrs" :input-value="selected" close @click="select" @click:close="remove(item)">
                  {{ item }}
                </v-chip>
              </template>
            </v-combobox>

          </v-card-text>
        </v-card>

        <v-card class="mb-5">
          <v-card-title>تصویر مقاله</v-card-title>
          <v-divider></v-divider>
          <div class="text-center ma-4 ">
            <imageUploader v-model="state.imageId" customeClass="mx-auto"></imageUploader>
          </div>
        </v-card>

        <v-card class="mb-5">
          <v-card-title>آمار</v-card-title>
          <v-divider></v-divider>
          <div class="pa-3">

            <v-chip variant="outlined" color="primary" class="ma-2">
              تعداد لایک:
              {{ state.formData.likeCount??0 }}
            </v-chip>

            <v-chip variant="outlined" color="primary" class="ma-2">
              تعداد مشاهده:
              {{ state.formData.visitedCount??0 }}
            </v-chip>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>