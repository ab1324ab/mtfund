<template>
  <div v-if="positionFinvestShow" class="shadow">
    <div class="reward-box" :class="darkMode ? 'container darkMode' : ''" :style="{ marginTop: top + 'px' }">
      <p style="font-weight: bold;padding: 18px 20px;">{{fund.name}} ({{fund.fundcode}})</p>
      <div>
        <div style="margin-bottom: 10px">
          <span>定投状态</span>
          <el-switch v-model="finvestObj.cvt" style="width: 180px;margin-left: 10px;" active-color="#13ce66" inactive-color="#484848" inactive-text="关闭" active-text="开启"></el-switch>
        </div>
        <div style="margin-bottom: 10px">
          <span>定投周期</span>
          <el-select style="width: 90px;margin-left: 5px;" @change="finvestWeek" v-model="finvestObj.finvestWeek" placeholder="请选择买入周期">
            <el-option label="每周" value="0"></el-option>
            <el-option label="每两周" value="1"></el-option>
            <el-option label="每月" value="2"></el-option>
            <el-option label="每日" value="3"></el-option>
          </el-select>
          <el-select style="width: 90px;margin-right: 5px;" :disabled="finvestObj.finvestWeek == 3" @change="finvestWeekDay" v-model="finvestObj.finvestDay" placeholder="请选择买入日期">
            <el-option v-for="item in dateArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 10px">
          <span>购买金额</span>
          <input class="btn num" placeholder="请输入购买金额" @input="finvestObj.addFundAmount = numberReplace(finvestObj.addFundAmount)" v-model="finvestObj.addFundAmount" type="text"/>
        </div>
        <div style="margin-bottom: 10px">
          <span>手续费率</span>
          <input class="btn num" placeholder="请输入手续费率" @input="finvestObj.addFundRate = numberReplace(finvestObj.addFundRate)" v-model="finvestObj.addFundRate" type="text"/>
        </div>
        <div style="margin-bottom: 10px;position: relative;">
          <span style="margin-right: 80px;">定投时间</span>
          <span class="nextDate">{{finvestObj.next}}</span>
          <span style="margin-right: 90px;">次数</span>
          <span class="nextDate" style="left: 270px;">{{finvestObj.count == null ? 0 : finvestObj.count}}</span>
        </div>
      </div>
      <p class="tips reward-tips">
        定投的时间越久，越能充分发挥复利的力量，所需投入的本金总额及每期投入也相对越少。
      </p>
      <div class="tab-row">
        <input class="btn success" style="cursor: pointer;" type="button" :value="'保存定投购买信息'" @click="saveFund"/>
        <input class="btn" style="cursor: pointer;" type="button" value="关闭" @click="close"/>
      </div>
    </div>
  </div>
</template>
<script>
import {formatDateTime, handleGetNextvWeek} from '@/common/js/utils'

export default {
  props: {
    top: {
      type: Number,
      default: 0,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      positionFinvestShow: false,
      finvestObj: {
        finvestWeek: null,
        finvestDay: null,
        addFundAmount: null,
        addFundRate: null,
        cvt: false,
        next: '',
        // checked: 'addfund',
        // decFundShare: null,
      },
      fund: {},
      infoData: {},
      dateArr: [],
      weekday: [
        {label: '周一', value: '0'},
        {label: '周二', value: '1'},
        {label: '周三', value: '2'},
        {label: '周四', value: '3'},
        {label: '周五', value: '4'},
      ],
      monthday: [
        {label: '1日', value: '0'},
        {label: '2日', value: '1'},
        {label: '3日', value: '2'},
        {label: '4日', value: '3'},
        {label: '5日', value: '4'},
        {label: '6日', value: '5'},
        {label: '7日', value: '6'},
        {label: '8日', value: '7'},
        {label: '9日', value: '8'},
        {label: '10日', value: '9'},
        {label: '11日', value: '10'},
        {label: '12日', value: '11'},
        {label: '13日', value: '12'},
        {label: '14日', value: '13'},
        {label: '15日', value: '14'},
        {label: '16日', value: '15'},
        {label: '17日', value: '16'},
        {label: '18日', value: '17'},
        {label: '19日', value: '18'},
        {label: '20日', value: '19'},
        {label: '21日', value: '20'},
        {label: '22日', value: '21'},
        {label: '23日', value: '22'},
        {label: '24日', value: '23'},
        {label: '25日', value: '24'},
        {label: '26日', value: '25'},
        {label: '27日', value: '26'},
        {label: '28日', value: '27'},
      ],
      fundListM: [],
    };
  },
  mounted() {
    chrome.storage.sync.get(['fundListM'], (res) => {
      this.fundListM = res.fundListM;
    });
  },
  methods: {
    init(val) {
      this.fund = val;
      let url = `https://fundmobapi.eastmoney.com/FundMApi/FundBaseTypeInformation.ashx?FCODE=${this.fund.fundcode}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=${new Date().getTime()}`;
      this.$axios.get(url).then((res) => {
        this.loading = false;
        this.infoData = res.data.Datas;
        this.finvestObj.addFundRate = this.infoData.RATE;
      });
      this.positionFinvestShow = true;
      this.finvestObj.finvestWeek = null;
      this.finvestObj.finvestDay = null;
      this.finvestObj.addFundAmount = null;
      this.finvestObj.next = null;
      this.finvestObj.count = null;
      this.finvestObj.cvt = false;
      for (let fundm of this.fundListM) {
        if (fundm.code === this.fund.fundcode && fundm.fvest != null) {
          this.finvestObj.cvt = fundm.fvest.cvt;
          this.finvestObj.next = fundm.fvest.next;
          this.finvestObj.finvestWeek = fundm.fvest.finvestWeek;
          this.finvestObj.finvestDay = fundm.fvest.finvestDay;
          this.finvestObj.addFundAmount = fundm.fvest.addFundAmount;
          this.finvestObj.count = fundm.fvest.count;
          break;
        }
      }
    },
    saveFund() {
      for (let fundm of this.fundListM) {
        if (fundm.code === this.fund.fundcode) {
          fundm.fvest = {
            'cvt': this.finvestObj.cvt,
            'next': this.finvestObj.next,
            'finvestWeek': this.finvestObj.finvestWeek,
            'finvestDay': this.finvestObj.finvestDay,
            'addFundAmount': this.finvestObj.addFundAmount,
            'count': this.finvestObj.count,
            'rates': this.finvestObj.addFundRate
          }
          chrome.storage.sync.set({fundListM: this.fundListM,});
        }
      }
      this.$message({
        message: '保存定投购买信息成功',
        type: "success",
        center: true,
      });
      this.close();
    },
    close() {
      this.positionFinvestShow = false;
      this.$emit("close", false);
    },
    finvestWeek(val) {
      if (val == 3) {
        var nowDate = new Date();
        let mtday = nowDate.setDate(nowDate.getDate() + 1);//添加天数
        this.finvestObj.next = formatDateTime(new Date(mtday), 'yyyy-MM-dd');
      } else if (val == 0 || val == 1) {
        this.dateArr = this.weekday;
      } else if (val == 2)
        this.dateArr = this.monthday;
      this.finvestObj.finvestDay = null
    },
    finvestWeekDay() {
      var nowDate = new Date();
      let val = this.finvestObj.finvestWeek;
      let week = new Date(handleGetNextvWeek()[0]);
      if (val == 3) {
      } else if (val == 0) {
        let weedDay = week.setDate(week.getDate() + parseInt(this.finvestObj.finvestDay));
        this.finvestObj.next = formatDateTime(new Date(weedDay), 'yyyy-MM-dd');
      } else if (val == 1) {
        let weedDay = week.setDate(week.getDate() + 7 + parseInt(this.finvestObj.finvestDay));
        this.finvestObj.next = formatDateTime(new Date(weedDay), 'yyyy-MM-dd');
      } else if (val == 2) {
        let month = new Date(nowDate.setDate(1))
        var monthNoeDayDate = new Date(month.setMonth(month.getMonth() + 1));
        var monthDay = monthNoeDayDate.setDate(monthNoeDayDate.getDate() + parseInt(this.finvestObj.finvestDay));
        this.finvestObj.next = formatDateTime(new Date(monthDay), 'yyyy-MM-dd');
      }
    },
    numberReplace(value) {
      if (value == null || value === "" || typeof(value) == 'number') return value;
      value = value.replace(/[^\d.]/g, '');  //字符不能是字母
      value = value.replace(/^\./g, '');  //第一个字符不能是.
      value = value.replace(/\.{2,}/g, '.') // 不能连续输入.
      value = value.replace(/(\.\d+)\./g, '$1') // .后面不能再输入.
      value = value.replace(/(-)\./g, '$1') // -后面不能输入.
      value = value.replace(/\-{2,}/g, '-') // -只能保留一个
      value = value.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
      value = value.replace(/-(0){2,}/g, "$1") // 不能出现-00,-001,-0001类似
      value = value.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
      value = value.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      value = value.replace(/(\d{15})\d*/, '$1') // 最多保留15位整数
      value = value.replace(/(\.\d{4})\d*/, '$1')// 最多保留2位小数
      return parseFloat(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.shadow {
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 20px 40px;
  z-index: 1001;
  box-sizing: border-box;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
}

.reward-box {
  background: #ffffff;
  border-radius: 15px;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  text-align: center;
  line-height: 1;
  vertical-align: middle;
  //font-size: 0;
}

.reward-box p {
  border-bottom: 1px solid #e4e7ed;
  padding: 21px;
}

.tab-row {
  padding: 12px 0;
}

.tips {
  font-size: 12px;
  margin: 0;
  color: #aaaaaa;
  line-height: 1.4;
  padding: 5px 15px;
}

.reward-tips {
  padding: 0 50px;
  margin-top: 5px;
}

.btn {
  display: inline-block;
  line-height: 1;
  //cursor: pointer;
  background: #fff;
  //padding: 5px 6px;
  padding: 6px 15px;
  border-radius: 3px;
  font-size: 12px;
  color: #000000;
  margin: 0 5px;
  outline: none;
  border: 1px solid #dcdfe6;
}

.success {
  color: #4eb61b !important;
  border-color: #4eb61b !important;
}

.nextDate {
  //width: 65px;
  position: absolute;
  left: 160px;
  color: #909399;
  font-weight: bold;
}

// 暗色模式
.container.darkMode {

  .reward-box {
    background-color: #373737;
    button.checked{
      background-color: rgba(64, 158, 255, 0.6);
    }
    button{
      background: #c0c4cc;
    }
    /deep/ .el-switch.is-checked .el-switch__core{
      border-color: rgba(19, 206, 102,0.6) !important;
      background-color: rgba(19, 206, 102,0.6) !important;
    }
  }

  .btn {
    background-color: rgba(255, 255, 255, 0.16);
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }

}
</style>
