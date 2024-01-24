<script setup>
const state= reactive({
  textnumber: 0,
  records: [
    {amount: '25000', createdOn: '2023-11-11', status: 'موفق'},
    {amount: '100000', createdOn: '2023-11-11', status: 'ناموفق'},
    {amount: '25000', createdOn: '2023-11-11', status: 'موفق'},
    {amount: '50000', createdOn: '2023-11-11', status: 'موفق'},
    {amount: '50000', createdOn: '2023-11-11', status: 'ناموفق'},
    {amount: '50000', createdOn: '2023-11-11', status: 'موفق'}
  ]
})
</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5">
    <legend>سوابق دریافت</legend>
    <v-table>
      <thead>
      <tr>
        <th>مبلغ</th>
        <th>تاریخ</th>
        <th>وضعیت</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in state.records" :key="item.amount">
        <td>{{item.amount}}</td>
        <td>{{item.createdOn}}</td>
        <td>{{item.status}}</td>
        <td>تسویه حساب</td>
      </tr>
      </tbody>
    </v-table>
  </fieldset>

  <fieldset class="myFieldset rounded-xl">
    <legend>تسویه حساب</legend>
    <v-row>
      <v-col cols="12" md="6">

      </v-col>
      <v-col cols="12" md="6">
        <div class="d-flex">
          <v-text-field density="compact" variant="outlined" label="مبلغ" prepend-inner-icon=""  ></v-text-field>
          <v-btn>دریافت</v-btn>
        </div>
      </v-col>
    </v-row>
  </fieldset>
</template>

<style scoped>

</style>