<template>
  <div class="popup" :style="{ height }">
    <template v-if="mounted">
      <div class="popup-header">
        <div class="popup-title">{{ title }}</div>
        <div class="popup-author">&copy; 一名宅</div>
      </div>
      <div class="popup-body conv">
        <div class="conv-image" @click="open">
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
              :filter-method="onSelectFilterChange"
              @visible-change="onSelectVisibleChange"
            >
              <el-option
                v-for="item in filterList"
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
              :filter-method="onSelectFilterChange"
              @visible-change="onSelectVisibleChange"
            >
              <el-option
                v-for="item in filterList"
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
      <div class="popup-footer">
        <div class="conv-time">汇率更新时间：{{ humanTime }}</div>
        <div class="conv-recent-list">
          <div v-for="(item, i) in recentList" :key="i" class="conv-recent-item" @click="use(item)">
            {{ item.fromCode }}→{{ item.toCode }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment';
import escape from 'lodash/escape';
import escapeRegExp from 'lodash/escapeRegExp';
import { mapActions, mapState, mapGetters } from 'vuex';
import { Input, Select, Option, Button } from 'element-ui';
import { CURRENCY } from '@/store/types';
import { getLocal } from '@/utils/storage';
import { popupWindow, getSelection } from '@/utils/chrome-ext';
import currencyCodes from '@/assets/currency-codes';

export default {
  uses: [Button],
  components: {
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      mounted: false,
      filter: '',
      title: '汇率转换',
      fromAmount: getLocal('fromAmount') || '100',
      fromCurrency: this.$store.state.currency.rate.from,
      toCurrency: this.$store.state.currency.rate.to,
      selectVisible: false,
    };
  },
  computed: {
    height() {
      return this.selectVisible ? '480px' : '155px';
    },
    toAmount() {
      return Math.ceil(this.fromAmount * this.rate * 10000) / 10000;
    },
    chartUrl() {
      return this.chart.replace('chst=vkc', 'chst=cob').replace('chs=270x94', '').replace('chsc=2', '');
    },
    humanTime() {
      return moment(this.time).format('MM/DD HH:mm:ss');
    },
    recentList() {
      return this.recent.filter(c => c.fromCode && c.toCode).reverse().filter((_, i) => i <= 5);
    },
    filterList() {
      if (this.filter) {
        const filter = this.filter.split('').map(s => escapeRegExp(s)).join('.*');
        const re = new RegExp(filter, 'iu');
        const list = this.list.filter((item) => {
          if (re.exec(item.value)) {
            return true;
          }
          const code = currencyCodes[item.value.toUpperCase()];
          if (code && re.exec(code)) {
            return true;
          }
          return false;
        });
        return list;
      }
      return this.list;
    },
    ...mapGetters('currency/list', ['list']),
    ...mapState('currency/list', ['recent']),
    ...mapState('currency/rate', ['rate', 'chart', 'time']),
  },
  watch: {
    fromAmount() {
      this.getRate({ from: this.fromCurrency, to: this.toCurrency });
    },
    fromCurrency() {
      this.getRate({ from: this.fromCurrency, to: this.toCurrency });
    },
    toCurrency() {
      this.getRate({ from: this.fromCurrency, to: this.toCurrency });
    },
  },
  mounted() {
    getSelection().then((selection) => {
      const amount = parseFloat(selection);
      if (amount) {
        this.fromAmount = amount;
      }
    });
    const id = Symbol('Fetching currency');
    this.$showLoading({ id, text: 'Fetching currency from google...' });
    this.getList()
      .then(() => this.getRate({ from: this.fromCurrency, to: this.toCurrency }))
      .then(() => {
        this.$hideLoading({ id });
      })
      .catch(() => {
        this.$showToast({ id, text: 'Fetch currency data failed!' });
      });
    window.addEventListener('resize', this.startRender);
    this.timerRender = window.setTimeout(this.startRender, 50);
  },
  methods: {
    ...mapActions('currency/list', {
      getList: CURRENCY.GET_LIST,
    }),
    ...mapActions('currency/rate', {
      getRate: CURRENCY.GET_RATE,
    }),
    startRender() {
      if (this.timerRender) {
        clearTimeout(this.timerRender);
        delete this.timerRender;
      }
      this.mounted = true;
      window.removeEventListener('resize', this.onMounted);
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
      this.filter = '';
    },
    onSelectFilterChange(filter) {
      this.filter = filter;
    },
    use(item) {
      this.fromCurrency = item.from;
      this.toCurrency = item.to;
    },
    exchange() {
      const toCurrency = this.toCurrency;
      this.toCurrency = this.fromCurrency;
      this.fromCurrency = toCurrency;
    },
    open() {
      const from = escape(this.fromCurrency);
      const to = escape(this.toCurrency);
      popupWindow(`https://www.google.com/search?q=${this.fromAmount}+${from}+${to}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/popup/index.scss';
</style>
