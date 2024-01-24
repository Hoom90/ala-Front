export default {
  //#region User
  user: {
    firstName: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    lastName: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    phoneNumber: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Expert
  expert: {
    firstName: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    lastName: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    title: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    nationalCode: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    medicalNumber: [
      (v) => {
        if (v && v > 0) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    counselingAmount: [
      (v) => {
        if (v && v > 0) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    categories: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    phoneNumber: [
      (v) => {
        if (/^0?9[0-9]{9}$/.test(v)) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    dateOfBirth: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    placeOfBirth: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    grade: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    gender: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    categoryIds: [
      (v) => {
        if (v && v.length > 0) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Forum
  forum: {
    title: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    categoryId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    description: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Article
  content: {
    title: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    summery: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    description: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    categoryId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    imageId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Category
  category: {
    title: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    categoryId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
  },
  //#endregion

  //#region Slider
  slider: {
    title: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    imageId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Slider
  province: {
    title: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
  },
  //#endregion

  //#region Result
  result:{
    title: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
  },
  //#endregion

  //#region Auth
  auth: {
    mobileNumber: [
      (value) => {
        if (value =="admin" || /^0?9[0-9]{9}$/.test(value)) return true;
        return "شماره وارد شده اشتباه است.";
      },
    ],
    password: [
      (value) => {
        if (value) return true;
        return "رمز وارد شده اشتباه است.";
      },
    ],
  },
  //#endregion
};
