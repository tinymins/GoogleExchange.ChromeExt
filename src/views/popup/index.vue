<template>
  <div class="popup" :style="{ height }">
    <div class="popup-title">
      <h3><b>{{ title }}</b></h3>
    </div>
    <div class="popup-body conv">
      <div class="conv-image">
        <img class="conv-image__img" :src="chartUrl">
      </div>
      <div class="conv-body">
        <div class="conv-body-line">
          <el-input class="conv-body-line-amount" v-model="fromAmount" size="small" value="100"></el-input>
          <el-select class="conv-body-line-currency" v-model="fromCurrency" size="small" filterable placeholder="请选择" @visible-change="onSelectVisibleChange">
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="conv-body-line">
          <el-input class="conv-body-line-amount" v-model="toAmount" size="small" readonly></el-input>
          <el-select class="conv-body-line-currency" v-model="toCurrency" size="small" filterable placeholder="请选择" @visible-change="onSelectVisibleChange">
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { popupWindow } from '@/utils/util';
import { setLocal, getLocal } from '@/utils/storage';
import { mapActions, mapState } from 'vuex';
import { Input, Select, Option } from 'element-ui';

export default {
  components: {
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  asyncData({ store }) {
    const ps = [];
    ps.push(store.dispatch('currency/CURRENCY_LIST_REQUEST'));
    ps.push(store.dispatch('currency/CURRENCY_RATE_REQUEST'));
    return Promise.all(ps);
  },
  methods: {
    popupUser() {
      popupWindow('index.html#/user', true);
    },
    onSelectVisibleChange(visible) {
      if (visible) {
        if (this.timerSelectVisible) {
          clearTimeout(this.timerSelectVisible);
        }
        this.selectVisible = visible;
      } else if (!this.timerSelectVisible) {
        this.timerSelectVisible = setTimeout(() => {
          this.selectVisible = visible;
          this.timerSelectVisible = null;
        }, 200);
      }
    },
    ...mapActions('currency', {
      getList: 'CURRENCY_LIST_REQUEST',
      getRate: 'CURRENCY_RATE_REQUEST',
    }),
  },
  computed: {
    height() {
      return this.selectVisible ? '380px' : '128px';
    },
    toAmount() {
      return Math.ceil(this.fromAmount * this.rate * 10000) / 10000;
    },
    chartUrl() {
      return this.chart.replace('chst=vkc', 'chst=cob').replace('chs=270x94', '').replace('chsc=2', '');
    },
    ...mapState('currency', ['list', 'rate', 'chart']),
  },
  data() {
    return {
      title: '汇率转换',
      fromAmount: getLocal('fromAmount') || '100',
      fromCurrency: getLocal('fromCurrency') || '',
      toCurrency: getLocal('toCurrency') || '',
      selectVisible: false,
    };
  },
  watch: {
    fromAmount(val) {
      this.getRate({ fromCurrency: this.fromCurrency, toCurrency: this.toCurrency });
    },
    fromCurrency(val) {
      this.getRate({ fromCurrency: this.fromCurrency, toCurrency: this.toCurrency });
    },
    toCurrency(val) {
      this.getRate({ fromCurrency: this.fromCurrency, toCurrency: this.toCurrency });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/views/popup/index.scss';
</style>
