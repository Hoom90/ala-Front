<script setup>
const route = useRoute()

const state = reactive({
  dialogDelete: false,
  dialog: false,
  dateRange: [new Date(), new Date(new Date().setDate(new Date().getDate() + 7))],
  days: [],
  currentSchedule: {},
  tasks: [],
  dialogDelete: false,
  copySchedule: {},
});


const DELETETYPE = {
  Day: 1,
  Time: 2
}
const TIMEOFSET = 15
onMounted(() => {
  changeRange()
})

// const days = ['2023/01/01', '2023/01/02', '2023/01/03', '2023/01/04', '2023/01/05', '2023/01/06', '2023/01/07']

// console.log("tasks ====>", tasks)
let regExTime = /([0-9]?[0-9]):([0-9][0-9]):([0-9][0-9])/;
// const regExTimeArr = regExTime.exec(state.tasks[0].startTime);
// console.log("time ====>", regExTimeArr)

function location(item) {
  let time = regExTime.exec(item.startTime);
  var from = parseInt(((parseInt(time[1]) * 60) + parseInt(time[2])))
  var to = parseInt(((parseInt(time[1]) * 60) + parseInt(time[2])))
  return parseInt(((parseInt(time[1]) * 60) + parseInt(time[2]))) + "px"
}

function length(item) {
  let startTime = regExTime.exec(item.startTime);
  let endTime = regExTime.exec(item.endTime);
  var from = parseInt(((parseInt(startTime[1]) * 60) + parseInt(startTime[2])))
  var to = parseInt(((parseInt(endTime[1]) * 60) + parseInt(endTime[2])))
  return (to - from) + "px"
}

// const getDate = (datetime) => datetime.split(' ')[0] ?? ''
const getTime = (datetime) => /([0-9]?[0-9]):([0-9][0-9])/.exec(datetime)[0];

const addDialog = (day, task) => {
  state.currentSchedule = {}
  state.currentSchedule.day = day

  if (task) {
    state.currentSchedule.id = task.id
    state.currentSchedule.endTime = getTime(task.endTime)
    state.currentSchedule.startTime = getTime(task.startTime)
  }
  state.dialog = true
}

const load = () => {
  const [start, end] = state.dateRange
  let data = {
    ExpertId: route.params.id,
    startTime: start,
    endTime: end
  }
  axiosApi().post('admin/schedule/list', data)
    .then(r => {
      state.tasks = r.data
    }).catch(e => {
      common.showError(e?.data?.messages)
    }).finally(() => { })
}

const save = (s) => {
  if (s) {
    if(!state.currentSchedule.startTime) {
      common.showError('زمان شروع الزامی است!')
      return true
    }
    if(!state.currentSchedule.endTime) {
      common.showError('زمان پایان الزامی است!')
      return true
    }
    let data = {
      id: state.currentSchedule.id,
      expertId: route.params.id,
      reserved:state.currentSchedule.reserved,
      startTime: `${state.currentSchedule.day}T${state.currentSchedule.startTime}`,
      endTime: `${state.currentSchedule.day}T${state.currentSchedule.endTime}`
    }
    if (state.currentSchedule.id) {
      axiosApi().put('admin/schedule', data)
        .then(r => {
          state.dialog = false
          load()
        }).catch(e => {
          common.showError(e?.data?.messages)
        }).finally(() => { })
    }
    else {
      axiosApi().post('admin/schedule', data)
        .then(r => {
          state.dialog = false
          load()
        }).catch(e => {
          common.showError(e?.data?.messages)
        }).finally(() => { })
    }
  }
  else
    state.dialog = false
}

const changeRange = () => {
  const [start, end] = state.dateRange
  if (!start || !end) {
    common.showError('تاریخ شروع و پایان را وارد کنید')
    return
  }
  load()
  state.days = []
  let day = new Date(start)
  let endDay = new Date(end)
  while (day <= endDay) {
    state.days.push(dateConverter.normalMiladi(day))
    day.setDate(day.getDate() + 1);
  }
}

const handelDelete = (type, task) => {
  if (type == DELETETYPE.Day)
    state.currentSchedule.day = task
  else
    state.currentSchedule = task

  state.currentSchedule.type = type
  state.dialogDelete = true
}

const acceptDelete = (s) => {
  if (s) {
    if (state.currentSchedule.type == DELETETYPE.Time) {
      axiosApi().delete('admin/schedule/' + state.currentSchedule.id)
        .then(r => {
          common.showMessage('زمانبندی حذف شد')
          state.dialogDelete = false
          load()
        }).catch(e => {
          common.showError(e?.data?.messages)
        }).finally(() => { })
    }
    else {
      axiosApi().delete('admin/schedule/day/' + state.currentSchedule.day)
        .then(r => {
          common.showMessage('زمانبندی ها حذف شد')
          state.dialogDelete = false
          load()
        }).catch(e => {
          common.showError(e?.data?.messages)
        }).finally(() => { })
    }
  }
  else
    state.dialogDelete = false
}

const copyTime = (task) => {
  state.currentSchedule = {}
  // state.currentSchedule.startTime = new Date(new Date(task.endTime).getTime() + (TIMEOFSET * 60 * 1000))
  let day = dateConverter.normalMiladi(task.startTime)
  let start = new Date(new Date(task.endTime).getTime() + (TIMEOFSET * 60 * 1000))
  let ofset = new Date(task.endTime).getTime() - new Date(task.startTime).getTime()
  let end = new Date(start.getTime() + ofset)
  state.currentSchedule.startTime = getTime(start)
  state.currentSchedule.endTime = getTime(end)
  state.currentSchedule.day = day
  save(true)
}

const handelCopy = (day) => {
  state.copySchedule = {}
  state.copySchedule.sourceStartDate = day
  state.copySchedule.sourceEndtDate = day
  state.copySchedule.targetStartDate = dateConverter.normalMiladi(new Date(day).setDate(new Date(day).getDate() + 1))
  state.copySchedule.targetEndDate = dateConverter.normalMiladi(new Date(day).setDate(new Date(day).getDate() + 1))
  state.dialogCopy = true
}

const copySchedule = (s) => {
  if (s) {
    state.copySchedule.ExpertId = route.params.id
    axiosApi().post('admin/schedule/copy', state.copySchedule)
      .then(r => {
        common.showMessage('کپی شد')
        state.dialogCopy = false
        load()
      }).catch(e => {
        common.showError(e?.data?.messages)
      }).finally(() => { })
  }
  else
    state.dialogCopy = false
}
</script>

<template>
  <v-toolbar class="mb-5" :elevation="1" color="white" rounded>
    <v-toolbar-title>زمانبندی نوبت ها</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- <v-btn to="/dashboard/news/add" class="bg-blue-grey-lighten-1" color="info">ایجاد نوبت جدید</v-btn> -->
    بازه زمان:
    <!-- {{ state.dateRange }} -->
    <date-picker v-model="state.dateRange" range format="YYYY-MM-DD" @change="changeRange" style="width: 250px;"
      class="mx-3" display-format="jYYYY/jMM/jDD" />
    <!-- {{ state.dateRange }} -->
  </v-toolbar>

  <v-card>
    <v-card-text>


      <div class="schedule">
        <div class="schedule-header">
          <div class="schedule-title">زمان</div>
          <!-- <div> 0:00</div> -->
          <div v-for="(day, i) in state.days">
            {{ dateConverter.dayInWeek(day) }}
            <br />
            {{ dateConverter.convertToJalali(day) }}<br />
            <v-btn density="compact" icon="mdi-plus" size="small" @click="addDialog(day)" class="ml-4"></v-btn>
            <v-btn density="compact" icon="mdi-delete-outline" size="small" @click="handelDelete(DELETETYPE.Day, day)"
              class="ml-4"></v-btn>
            <v-btn density="compact" icon size="small">
              <v-icon size="small" @click="handelCopy(day)">mdi-content-copy</v-icon>
            </v-btn>
          </div>
          <!-- <div v-for="i in 24"> {{ i }}:00</div> -->
        </div>
        <div class="schedule-body">
          <div class="schedule-time">

            <div class="schedule-title">0:00</div>
            <div v-for="i in 23" class="schedule-title">{{ i }}:00</div>

          </div>
          <div v-for="day in state.days" class="schedule-day">

            <div v-for="task in state.tasks.filter(x => dateConverter.normalMiladi(x.startTime) == day)"
              class="schedule-task" :title="`از:${getTime(task.startTime)}  تا:${getTime(task.endTime)}`"
              :style="{ top: location(task), height: length(task) }">


              <div class="task-inner " :class="{ 'bg-success': task.reserved }">
                <div class="task-action">
                  <v-icon size="small" class="mx-3"
                    @click="handelDelete(DELETETYPE.Time, task)">mdi-delete-outline</v-icon>
                  <v-icon size="small" class="mx-3" @click="addDialog(day, task)">mdi-pencil-outline</v-icon>
                  <v-icon size="small" class="mx-3" @click="copyTime(task)">mdi-content-copy</v-icon>
                </div>
                <small>{{ `از:${getTime(task.startTime)} تا:${getTime(task.endTime)}` }}</small><br />
                <small>{{ task.reserved ? 'رزرو شده' : '' }}</small>
                <v-tooltip activator="parent" location="top">
                  <small>{{ `از:${getTime(task.startTime)} تا:${getTime(task.endTime)}` }}</small><br />
                  <small>{{ task.reserved ? 'رزرو شده' : '' }}</small>
                </v-tooltip>
              </div>
            </div>

          </div>

        </div>
      </div>


      <mj-dialog v-model="state.dialog" :title="` نوبت ${dateConverter.convertToJalali(state.currentSchedule.day)}`"
        :action-btn="true" action-btn-text="ذخیره" :cancel-btn="true" action-type="success" @action-callback="save"
        size="sm">
        <v-form @submit.prevent="save" ref="verifyForm">

          <v-row>
            <v-col cols="12" md="6">
              <date-picker v-model="state.currentSchedule.startTime" format="HH:mm" type="time" />

              <!-- <v-text-field variant="outlined" label="از ساعت"></v-text-field> -->
            </v-col>
            <v-col cols="12" md="6">
              <date-picker v-model="state.currentSchedule.endTime" format="HH:mm" type="time" />
              <!-- <v-text-field variant="outlined" label="تا ساعت"></v-text-field> -->
            </v-col>
          </v-row>
          <v-checkbox v-model="state.currentSchedule.reserved" label="رزرو" hide-details=""></v-checkBox>
          <button class="d-none"></button>
        </v-form>
      </mj-dialog>

      <mj-dialog v-model="state.dialogDelete" title="حذف نوبت" :action-btn="true" action-btn-text="حذف نوبت"
        :cancel-btn="true" action-type="error" @action-callback="acceptDelete" size="sm">
        <div v-if="state.currentSchedule.type == DELETETYPE.Day">
          همه زمانهای روز {{ dateConverter.convertToJalali(state.currentSchedule.day) }} حذف می شوند
          <br />
          آیا اطمینان دارید؟
        </div>
        <div v-else>
          زمان از {{ getTime(state.currentSchedule.startTime) }} تا {{ getTime(state.currentSchedule.endTime) }} روز {{
            dateConverter.convertToJalali(state.currentSchedule.startTime) }} حذف می شود
          <br />
          آیا اطمینان دارید؟
        </div>

      </mj-dialog>


      <mj-dialog v-model="state.dialogCopy" title="کپی نوبت" :action-btn="true" action-btn-text="کپی نوبت"
        :cancel-btn="true" action-type="error" @action-callback="copySchedule" size="sm">
        <v-form @submit.prevent="save" ref="verifyForm">
          <v-row>
            <v-col cols="12" md="6">
              <small>از تاریخ:</small>
              <date-picker v-model="state.copySchedule.sourceStartDate" format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD"
                :auto-submit="true" type="date" />

              <!-- <v-text-field variant="outlined" label="از ساعت"></v-text-field> -->
            </v-col>
            <v-col cols="12" md="6">
              <small>تا تاریخ:</small>
              <date-picker v-model="state.copySchedule.sourceEndtDate" format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD"
                :auto-submit="true" type="date" />
              <!-- <v-text-field variant="outlined" label="تا ساعت"></v-text-field> -->
            </v-col>
            <v-col cols="12">
              <p>
                کپی می شود در بازه
              </p>
            </v-col>
            <v-col cols="12" md="6">
              <small>از تاریخ:</small>
              <date-picker v-model="state.copySchedule.targetStartDate" format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD"
                :auto-submit="true" type="date" />

              <!-- <v-text-field variant="outlined" label="از ساعت"></v-text-field> -->
            </v-col>
            <v-col cols="12" md="6">
              <small>تا تاریخ:</small>
              <date-picker v-model="state.copySchedule.targetEndDate" type="date" format="YYYY-MM-DD" :auto-submit="true"
                display-format="jYYYY/jMM/jDD" />
              <!-- <v-text-field variant="outlined" label="تا ساعت"></v-text-field> -->
            </v-col>
          </v-row>
          <v-alert class="mt-3" color="warning">
            زمان بندی های مقصد حذف می شوند
          </v-alert>
          <button class="d-none"></button>
        </v-form>
      </mj-dialog>


    </v-card-text>
  </v-card>
</template>
<style>
.schedule {
  /* width: 100%; */
  border-top: 1px solid;
  border-right: 1px solid;
  overflow: auto;
}

.schedule-header {
  display: flex;
}

.schedule-title {
  width: 80px !important;
  min-width: unset !important;
  height: 60px;
  border-bottom: 1px solid;
  border-left: 1px solid;
  text-align: center;
  flex: none !important;
}

.schedule-header div {
  padding: 5px;
  min-width: 110px;
  height: 80px;
  border-bottom: 1px solid;
  border-left: 1px solid;
  text-align: center;
  flex: 1;
}

.schedule-day {
  min-width: 110px;
  border-bottom: 1px solid;
  border-left: 1px solid;
  flex: 1;
  position: relative;
}

.schedule,
.schedule-title,
.schedule-day,
.schedule-header div {
  border-color: #AAA;
}

.schedule-body {
  display: flex;
  position: relative;

}

.schedule-task {
  position: absolute;
  padding: 0 5px;
  width: 100%;
}

.schedule-task .task-inner {
  background-color: #e7a7a7;
  width: 100%;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  align-content: center;
  overflow: hidden;
  height: 100%;
  position: relative;
}

.schedule-task .task-inner:hover {
  background: #fc7b7b;
}

.task-action {
  display: none;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  position: absolute;
  background: rgba(0, 0, 0, 0.70);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.schedule-task .task-inner:hover .task-action {
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  color: white;
}
</style>