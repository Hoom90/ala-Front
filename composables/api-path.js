export default {
  //auth
  CheckUserRegistration: "auth/check-user-registration",
  Register: "auth/register",
  LoginWithPassword: "auth/login-with-password",
  SendSmsCode: "auth/send-sms-code",
  ConfirmSmsCode: "auth/confirm-sms-code",
  LoginWithSms: "auth/login-with-sms",
  ForgotPassword: "auth/forgot-password",
  ResetPassword: "auth/reset-password",
  Logout: "auth/logout",
  ChangePassword: "account/change-password",
  ChangeProfile: "account/change-profile",
  UserInfo: "account/user-info",

  //#region Expert
  ExpertInfo: "account/expert-info",
  ExpertRequest: "expert/expert",
  ExpertResult: (id)=> `expert/Result/category/${id}`,
  ExpertOrderPagination: "expert/Order/paged",
  ExpertCounselingResultOrder: (id) => `expert/CounselingResult/order/${id}`,
  ExpertCounselingResultAdd: "expert/CounselingResult/add",
  ExpertTopicPostPagination: "expert/Topic/paged", 
  ExpertTopicPostPagination: "expert/Topic/paged", 
  ExpertTopicGetById: (id) => `expert/Topic/${id}`,
  ExpertTopicUpdate: "expert/Topic", 
  ExpertTopicDeleteById: (id) => `expert/Topic/${id}`,
  ExpertPostAdd: "expert/Post",
  ExpertTopic: {
    post: {
      pagination: "expert/Topic/paged",
      add: "expert/Topic",
    },
    get: (id) => `expert/Topic/${id}`,
    put: "expert/Topic",
    delete: (id) => `expert/Topic/${id}`,
  },
  ExpertPost: {
    add: "expert/Post",
  },
  //#endregion

  //#region Admin
  Schedule:{
    get: (id)=> `admin/Schedule/${id}`,
    post: {
      pagination: "admin/Schedule/paged",
      listByTime: "admin/Schedule/list",
      add: "admin/Schedule",
      copy: "admin/Schedule/copy",
    },
    put: "admin/Schedule",
    delete: {
      byId: (id)=>`admin/Schedule/${id}`,
      byDay: (day)=>`admin/Schedule/day/${day}`,
    },
  },
  Users: {
    get: {
      single: "admin/users/",
      paged: (pageindex, pagesize) =>
        `admin/users/paged${common.insertParams({
          PageIndex: pageindex,
          PageSize: pagesize,
        })}`,
    },
    post: "admin/users",
    update: "admin/users",
    delete: (id) => `admin/users/${id}`,
  },
  Expert: {
    get: {
      paged: "admin/Expert/list",
      byId: (id) => `admin/Expert/${id}`,
    },
    post: "admin/Expert",
    update: "admin/Expert",
    delete: (id) => `admin/Expert/${id}`,
  },
  Category: {
    get: {
      paged: "admin/Category/paged",
      byId: "admin/Category/",
      parents: "admin/Category/parents/",
      all: "admin/Category",
    },
    post: "admin/Category",
    update: "admin/Category",
    delete: "admin/Category/",
  },
  News: {
    get: {
      byId: "admin/Content/",
      list: "admin/Content/all",
    },
    post: "admin/Content/news",
    update: "admin/Content",
    delete: "admin/Content/",
  },
  Article: {
    get: {
      byId: "admin/Content/",
      list: "admin/Content/all",
    },
    post: "admin/Content/article",
    update: "admin/Content",
    delete: "admin/Content/",
  },
  Page: {
    get: {
      byId: "admin/Content/",
      list: "admin/Content/all",
    },
    post: "admin/Content/page",
    update: "admin/Content",
    delete: "admin/Content/",
  },
  Province: {
    get: {
      byParent: (id) => `admin/Province/paged?parentId=${id}`,
      list: "admin/Province/list",
      cities: "admin/province/cities",
    },
    post: "admin/province",
    update: "admin/province",
    delete: "admin/province/",
  },
  Slider: {
    get: {
      all: "admin/slider/all",
      byId: "admin/slider/",
    },
    post: "admin/slider",
    update: "admin/slider",
    delete: "admin/slider/",
  },
  Slide: {
    get: {
      all: "admin/slider/",
      byId: "admin/slider/slide/",
    },
    post: "admin/slider/slide",
    update: "admin/slider/slide",
    delete: "admin/slider/",
  },
  Comment: {
    get: {
      // get by id
      single: "admin/Comment/",
      // get by parentId
      // parentId nullable
      list: "admin/Comment/list",
    },
    delete: "admin/Comment/",
    post: "admin/Comment",
    update: "admin/Comment",
  },
  Discount: {
    get: {
      all: (pageindex, pagesize) =>
        `admin/Discount/all${common.insertParams({
          PageIndex: pageindex,
          PageSize: pagesize,
        })}`,
      single: (id) => `admin/Discount/${id}`,
    },
    post: "admin/Discount",
    update: "admin/Discount",
    delete: (id) => `admin/Discount/${id}`,
  },
  File: {
    url: "files/",
    thumbnail: (id) => `/api/Files/thumbnail/${id}`
  },
  Ticket: {
    get: (id) => `admin/Ticket/${id}`,
    post: {
      pagination: "admin/Ticket/paged",
      add: "admin/Ticket",
    },
    put: "admin/Ticket",
    delete: (id) => `admin/Ticket/${id}`,
  },
  Topic:{
    post:{
      pagination: "admin/Topic/paged",
      add: "admin/Topic",
    },
    get:{
      byId: (id) => `admin/Topic/${id}`,
    },
    put: "admin/Topic",
    delete: {
      byId: (id) => `admin/Topic/${id}`,
    },
  },
  Result:{
    get:{
      byId: (id) => `admin/Result/${id}`,
      byCategoryId: (id) => `admin/Result/category/${id}`,
    },
    post: 'admin/Result/add',
    put: 'admin/Result',
    delete: (id) => `admin/Result/${id}`,
  },
  Post:{
    post: {
      pagination: "admin/Post/paged",
      byTopicId: "admin/Post/posts-by-topicid",
      add: "admin/Post",
    },
    put: "admin/Post",
    get: (id)=> `admin/Post/${id}`,
    delete: (id)=> `admin/Post/${id}`,
  },
  Order:{
    post:{
      pagination: "admin/Order/paged", 
    },
  },
  //#endregion

  //#region Public
  public: {
    Article: {
      get: {
        query:"public/Content",
        all: "public/Content/all",
        byId: (id) => `public/Content/${id}`,
      },
    },
    News:{
      get: {
        query:"public/Content",
        all: "public/Content/all",
        byId: (id) => `public/Content/${id}`,
      }
    },
    Expert:{
      category: "public/Expert/categoryId",
      get: {
        paged: "public/Expert/list",
        byId: (id) => `public/Expert/${id}`,
      },
      put:{
        like: (id) => `public/Expert/${id}/like`,
        dislike: (id) => `public/Expert/${id}/dislike`,
      },
    },
    Category:{
      post: "public/Category/list",
      get:{
        byId: (id) => `public/Category/${id}`,
      },
    },
    Slider:{
      get:{
        parents: "public/Slider/",
        byParent: (id)=> `public/Slider/${id}`,
      }
    },
    Content:{
      put:{
        like: (id) => `public/Content/${id}/like`,
        dislike: (id) => `public/Content/${id}/dislike`,
      },
    },
    Comment: {
      get: "public/Comment/list",
      add_content_comment: "public/Comment/add-content-comment",
      add_expert_comment: "public/Comment/add-expert-comment",
    },
    Score: {
      post: "public/Expert/score",
    },
    Page: {
      query:"public/Content",
      list: "public/Content/all",
      byId: (id)=>`public/Content/${id}`,
    },
    Topic:{
      get: {
        byId: (id) => `public/Topic/${id}`
      },
      post: {
        pagination: "public/Topic/paged",
      }
    },
    Post:{
      post:{
        pagination: "public/Post/paged",
        add: "public/Post",
      },
    },
    Province:{
      get: "public/Province/cities",
    }
  },
  //#endregion

  //#region User
  User:{
    Category:{
      get: "user/Category",
      byId: (id) => `user/Category/${id}`,
    },
    Wallet:{
      balance: "user/Wallet/balance",
      paged: "user/Wallet/paged",
    },
    Payment:{
      post: "user/Payment",
      get: "user/Payment",
      byOrder: (id) => `user/Payment/${id}`,
    },
    Order:{
      post: {
        pagination: "user/Order/paged",
        orders: "user/Order",
      },
      delete: (id) => `user/Order/${id}`,
    },
    Province: {
      get: "user/province/cities"
    },
    Ticket:{
      getbyId: (id) => `user/Ticket/${id}`,
      post: {
        pagination: "user/Ticket/paged",
        add: "user/Ticket",
      },
      put: "user/Ticket",
      delete: (id) => `user/Ticket/${id}`,
    },
  },
  UserCounselingResultOrder: (id) => `user/CounselingResult/${id}`,
  //#endregion
};