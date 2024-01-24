export default
    {
        pageSize: [10, 20, 50, 100],
        grade: [{
            title: "دیپلم",
            id: 1
        }, {
            title: "کاردانی",
            id: 2
        }, {
            title: "کارشناسی",
            id: 3
        }, {
            title: "کارشناسی ارشد",
            id: 4
        }, {
            title: "دکتری",
            id: 5
        }],
        gender: [{ title: "مرد", value: 1 }, { title: "زن", value: 2 }],
        ContentStatus:[
            {
                title: "ارشیو",
                id: 1
            },    {
                title: "منتشر",
                id: 2
            },    {
                title: "موقت",
                id: 3
            },
        ],
        dayInWeek: [
            {
                id: 1,
                title: "شنبه",
            },
            {
                id: 2,
                title: "یکشنبه",
            },
            {
                id: 3,
                title: "دوشنبه",
            },
            {
                id: 4,
                title: "سه شنبه",
            },
            {
                id: 5,
                title: "چهارشنبه",
            },
            {
                id: 6,
                title: "پنجشنبه",
            },
            {
                id: 7,
                title: "جمعه",
            },
        ],
        ticketRecievers: [
            {
                id: 1,
                title: "مدیریت",
            },
            {
                id: 2,
                title: "مالی",
            },
            {
                id: 3,
                title: "پشتیبانی",
            },
        ],
        ticketState: [
            {
                id:1,
                title:"در انتظار بررسی",
                color:"orange",
            },
            {
                id:2,
                title:"در حال بررسی",
                color:"pink",
            },
            {
                id:3,
                title:"مشاهده شده",
                color:"info",
            },
            {
                id:4,
                title:"در انتظار تایید",
                color:"blue",
            },
            {
                id:5,
                title:"رد شده",
                color:"red",
            },
            {
                id:6,
                title:"تایید شده",
                color:"green",
            },
            {
                id:7,
                title:"بسته شده",
                color:"grey",
            },
            {
                id:8,
                title:"پاسخ داده شده",
                color:"grey",
            },
        ],
        operator:[
            {
                /// <summary>
                /// Equal
                /// </summary>
                Equal : 0,

                /// <summary>
                /// Greater than
                /// </summary>
                GreaterThan : 1,

                /// <summary>
                /// Greater than or equal
                /// </summary>
                GreaterThanOrEqual : 2,

                /// <summary>
                /// Less than
                /// </summary>
                LessThan : 3,

                /// <summary>
                /// Less than or equal
                /// </summary>
                LessThanOrEqual : 4,

                /// <summary>
                /// Not equal
                /// </summary>
                NotEqual : 5,

                /// <summary>
                /// Contains
                /// </summary>
                Contains : 6,

                /// <summary>
                /// Starts with
                /// </summary>
                StartsWith : 7,

                /// <summary>
                /// Ends with
                /// </summary>
                EndsWith : 8,
            }
        ]
    }