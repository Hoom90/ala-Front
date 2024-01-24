// export const uploadFile = (files) => {
//   let index = 1;
//   const state = reactive({
//     imageIds: [],
//   });
//   if (files) {
//     for await (let file of files) {
//       index++;
//       let formData = new FormData();
//       formData.append("file", file);
//       await axiosApi().post("admin/Files", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           // onUploadProgress,
//         })
//         .then((r) => {
//           console.log(r.data);
//           console.log("in", index);
//           index--;
//           state.imageIds.push(r.data);
//         })
//         .catch((e) => {
//           // uploadButtonText("خطا در ذخیره کردن تصویر");
//           common.showError(e?.data?.messages);
//         });
//       // .finally(() => (state.uploadImage = false));
//     })
//     // .then(()=>{
//     // })
//     // .catch((error)=>{
//     //   common.showError(error?.messages)
//     // })
//   }
//   console.log("out", index);
//   return state.imageIds;
//   // emits("update:modelValue", state.imageIds);
// };

// const onUploadProgress = (event) => {
//   const percentage = Math.round((100 * event.loaded) / event.total);
//   state.uploadButtonText = `درحال ذخیره: ${percentage}%`
//   if (percentage > 98) {
//     setTimeout(() => {
//       uploadButtonText('ذخیره شد')
//     }, 2000);

//   }
// };

// const uploadButtonText = (text) => {
//   state.uploadButtonText = text
//   setTimeout(() => {
//     state.uploadButtonText = 'انتخاب تصویر'
//   }, 4000);
// }
//     async function uploadFile(formData) {


export const uploadFile = async (files) => {
  const state = reactive({
    imageIds: [],
  });
  if (files) {
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if(typeof file == 'string'){
          state.imageIds.push(file);
        }
        else{
          let formData = new FormData();
          formData.append("file", file);
          const response = await axiosApi().post("admin/Files", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          state.imageIds.push(response.data);
        }
      });
      await Promise.all(uploadPromises);
    } catch (error) {
      common.showError(error?.response?.data?.messages);
    }
  }
  return state.imageIds;
};