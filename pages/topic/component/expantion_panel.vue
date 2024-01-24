<script setup>
const props = defineProps(["isClose","categories"])

const panel = ref(props.isClose)

</script>
<template>
    <div class="fixed-bar">
        <v-text-field label="دنبال چی میگردی ..." variant="solo-inverted" append-inner-icon="mdi-magnify"
            rounded="xl"></v-text-field>
        <v-expansion-panels class="rounded-xl" v-model="panel" multiple>

            <v-expansion-panel class="rounded-xl" title="تالار های گفتگو">
                <v-expansion-panel-text v-if="props.categories">
                    <v-btn variant="flat" block class="mb-2" color="theme-blue" to="/topic">
                        <span>همه تالارها</span>
                    </v-btn>
                    <v-btn variant="flat" v-for="item in props.categories" :key="item.id" block class="mb-2"
                        color="theme-blue" :to="`/topic/${item.id}`">
                        <span>تالار {{ item.title }}</span>
                    </v-btn>
                </v-expansion-panel-text>
                <v-expansion-panel-text v-else>
                    <span>
                        بدون تالار گفتگو...
                    </span>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- <v-expansion-panel class="rounded-xl" title="نمایش بر اساس">
              <v-expansion-panel-text>
                <v-switch label="بازدید بیشتر" class=" mr-auto" hide-details></v-switch>
                <v-switch label="سابقه بیشتر" hide-details></v-switch>
              </v-expansion-panel-text>
  
            </v-expansion-panel> -->

            <!-- <v-expansion-panel class="rounded-xl" title="سابقه فعالیت">
              <v-expansion-panel-text>
                <div class="text-center">
                  <h3 class="border rounded pa-1 mx-auto">{{ state.step }} سال</h3>
                </div>
                <v-slider color="theme-blue" v-model="state.step" step="1" min="1" max="30" show-ticks="always"
                  tick-size="3" thumb-label hide-details></v-slider>
              </v-expansion-panel-text>
            </v-expansion-panel> -->

            <!-- <v-expansion-panel class="rounded-xl" title="جنسیت">
                <v-expansion-panel-text>
                  <v-radio-group inline hide-details>
                    <v-radio label="خانم" value="radio-1"></v-radio>
                    <v-radio label="آقا" value="radio-2"></v-radio>
                  </v-radio-group>
                </v-expansion-panel-text>
              </v-expansion-panel> -->

            <!-- <v-expansion-panel class="rounded-xl" title="استان/شهر">
                <v-expansion-panel-text>
                  <v-autocomplete
                      variant="outlined"
                      label="انتخاب شهر"
                      :items="state.cities"
                      item-title="fullTitle"
                      item-value="id"
                  >
                  </v-autocomplete>
                </v-expansion-panel-text>
              </v-expansion-panel> -->

        </v-expansion-panels>
    </div>
</template>