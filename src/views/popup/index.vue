<template>
  <div class="popup" :style="{ height }">
    <div class="popup-title">
      <h3><b>{{ title }}</b></h3>
    </div>
    <div class="popup-author">&copy; 一名宅</div>
    <div class="popup-body conv">
      <div class="conv-image">
        <img v-if="chart" class="conv-image__img" :src="chartUrl">
      </div>
      <div class="conv-body">
        <div class="conv-body-line">
          <el-input class="conv-body-line-amount" v-model="fromAmount" size="small" value="100"></el-input>
          <el-select
            v-model="fromCurrency"
            class="conv-body-line-currency"
            size="small"
            filterable
            placeholder="请选择"
            @visible-change="onSelectVisibleChange"
          >
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="conv-body-line">
          <el-input class="conv-body-line-amount" v-model="toAmount" size="small" readonly></el-input>
          <el-select
            v-model="toCurrency"
            class="conv-body-line-currency"
            size="small"
            filterable
            placeholder="请选择"
            @visible-change="onSelectVisibleChange"
          >
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="conv-exchange">
        <el-button class="conv-exchange__btn" icon="el-icon-sort" circle @click="exchange"></el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { CURRENCY } from '@/store/types';
import { getLocal } from '@/utils/storage';
import { mapActions, mapState } from 'vuex';
import { Input, Select, Option, Button } from 'element-ui';

export default {
  uses: [Button],
  components: {
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      title: '汇率转换',
      fromAmount: getLocal('fromAmount') || '100',
      fromCurrency: this.$store.state.currency.rate.fromCurrency,
      toCurrency: this.$store.state.currency.rate.toCurrency,
      selectVisible: false,
    };
  },
  computed: {
    height() {
      return this.selectVisible ? '480px' : '150px';
    },
    toAmount() {
      return Math.ceil(this.fromAmount * this.rate * 10000) / 10000;
    },
    chartUrl() {
      return this.chart.replace('chst=vkc', 'chst=cob').replace('chs=270x94', '').replace('chsc=2', '');
    },
    ...mapState('currency/list', ['list']),
    ...mapState('currency/rate', ['rate', 'chart']),
  },
  watch: {
    fromAmount() {
      this.getRate({ fromCurrency: this.fromCurrency, toCurrency: this.toCurrency });
    },
    fromCurrency() {
      this.getRate({ fromCurrency: this.fromCurrency, toCurrency: this.toCurrency });
    },
    toCurrency() {
      this.getRate({ fromCurrency: this.fromCurrency, toCurrency: this.toCurrency });
    },
  },
  async mounted() {
    const id = Symbol('Fetching currency');
    this.$showLoading({ id, text: 'Fetching currency from google...' });
    try {
      await this.getList();
      await this.getRate({ fromCurrency: this.fromCurrency, toCurrency: this.toCurrency });
      this.$hideLoading({ id });
    } catch (e) {
      this.$showLoading({ id, text: 'Fetch currency data failed!' });
    }
  },
  methods: {
    ...mapActions('currency/list', {
      getList: CURRENCY.GET_LIST,
    }),
    ...mapActions('currency/rate', {
      getRate: CURRENCY.GET_RATE,
    }),
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
    exchange() {
      const toCurrency = this.toCurrency;
      this.toCurrency = this.fromCurrency;
      this.fromCurrency = toCurrency;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/popup/index.scss';
</style>
