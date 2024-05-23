<template>
  <div v-if="positionIncrdecShow" class="shadow">
    <el-card
      class="reward-box"
      :class="darkMode ? 'container darkMode' : ''"
      :style="{ marginTop: top + 'px' }"
    >
      <div slot="header" style="text-align: center;">
        <span style="font-weight: bold;"
          >{{ fund.name }} ({{ fund.fundcode }})</span
        >
        <input
          class="btn"
          style="cursor: pointer;float: right;padding: 2px 5px;"
          type="button"
          value="x"
          @click="close"
        />
      </div>
      <el-row>
        <el-form
          ref="form"
          :inline="true"
          :model="incrdecObj"
          label-width="40px"
        >
          <el-col :sm="6" :xs="6">
            <el-radio-group size="mini" v-model="incrdecObj.checked">
              <el-radio-button label="addfund">加仓</el-radio-button>
              <el-radio-button label="decfund">卖出</el-radio-button>
            </el-radio-group>
          </el-col>
          <span v-show="incrdecObj.checked == 'addfund'">
            <el-col :sm="6" :xs="6">
              <el-form-item label="日期">
                <el-select
                  size="mini"
                  style="width: 100px;"
                  v-model="incrdecObj.addFundDate"
                  placeholder="请选择买入日期"
                >
                  <el-option
                    v-for="item in dateArr"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="6" :xs="6">
              <el-form-item label="金额">
                <el-input-number
                  size="mini"
                  style="width: 100px;text-align: left;"
                  v-model="incrdecObj.addFundAmount"
                  :controls="false"
                  :precision="2"
                  :step="0.1"
                  :max="999999999"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :sm="6" :xs="6">
              <el-form-item label="费率">
                <el-input
                  style="width: 100px;"
                  v-model="incrdecObj.addFundRate"
                ></el-input>
              </el-form-item>
            </el-col>
          </span>
          <span v-show="incrdecObj.checked == 'decfund'">
            <el-col :sm="6" :xs="6">
              <el-form-item label="份额">
                <el-input-number
                  style="width: 100px;"
                  v-model="incrdecObj.decFundShare"
                  :controls="false"
                  :placeholder="'最大卖出份额:' + fund.num"
                  :precision="2"
                  :step="0.1"
                  :max="parseFloat(fund.num)"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="12">
              <el-form-item label="">
                <small style="color: rgba(0, 0, 0, 0.6);">{{
                  "最大卖出份额:" + fund.num
                }}</small>
              </el-form-item>
            </el-col>
          </span>
        </el-form>
      </el-row>
      <el-table
        show-summary
        :summary-method="summaries"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :data="tableData"
        :height="tableHeight"
        style="width: 100%;margin-bottom: 20px"
      >
        <el-table-column
          sortable
          prop="date"
          label="买卖日期"
        ></el-table-column>
        <el-table-column prop="amount" label="买卖金额"></el-table-column>
        <el-table-column prop="quota" label="买卖份额"></el-table-column>
        <el-table-column prop="rates" label="手续费额">
          <template slot-scope="scope">
            {{
              (
                (scope.row.amount * numberReplace(scope.row.rates)) /
                100
              ).toFixed(2)
            }}
            <el-tag style="position: absolute;margin-left: 5px">{{
              scope.row.rates == "" ? "0.00%" : scope.row.rates
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="equity" label="基金净值"></el-table-column>
        <el-table-column
          width="60"
          prop="type"
          label="类型"
          :filters="columnTypeFilters"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.type === 'addfund'"
              type="success"
              disable-transitions
              >买入</el-tag
            >
            <el-tag
              v-if="scope.row.type === 'decfund'"
              type="danger"
              disable-transitions
              >卖出</el-tag
            >
            <el-tag v-if="scope.row.type === 'finfund'" disable-transitions
              >定投</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column width="60" prop="equity" label="">
          <template slot-scope="scope">
            <input
              class="btn"
              style="cursor: pointer;padding: 2px 5px;"
              type="button"
              value="x"
              @click="removePosArr(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--      <small style="margin: 0 10px;color: rgba(0,0,0,0.6)"> 基金持有期是指卖出和买入期间间隔的自然日，节假日和周末都算在内，一般是按照申购确认日到赎回确认日的周期来算的。 </small>-->
      <div class="tab-row">
        <input
          class="btn success"
          style="cursor: pointer;"
          type="button"
          :value="
            '保存' +
              (incrdecObj.checked == 'addfund' ? '买入' : '卖出') +
              '信息'
          "
          @click="saveFund"
        />
        <input
          class="btn"
          style="cursor: pointer;"
          type="button"
          value="关闭"
          @click="close"
        />
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  ElCard,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag
} from "@/common/js/commons";

export default {
  components: {
    ElRow,
    ElCol,
    ElFormItem,
    ElForm,
    ElSelect,
    ElInput,
    ElOption,
    ElInputNumber,
    ElTable,
    ElTableColumn,
    ElCard,
    ElRadioGroup,
    ElRadioButton,
    ElTag
  },
  props: {
    top: {
      type: Number,
      default: 0
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      positionIncrdecShow: false,
      // checked: "addfund",
      fund: {},
      infoData: {},
      dateArr: [],
      incrdecObj: {
        checked: "addfund",
        addFundDate: null,
        addFundAmount: null,
        addFundRate: null,
        decFundShare: null
      },
      tableData: [],
      tableHeight: 120,
      columnTypeFilters: [
        { text: "买入", value: "addfund" },
        { text: "卖出", value: "decfund" },
        { text: "定投", value: "finfund" }
      ]
    };
  },
  mounted() {
    var dateTime = new Date();
    for (let i = 0; i < 30; ) {
      var date = new Date(dateTime);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      // var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      // var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      // return Y + M + D +" "+h + m + s;
      this.dateArr.push(Y + M + D);
      i++;
      dateTime = date.setDate(date.getDate() + i);
    }
  },
  computed: {},
  methods: {
    init(val) {
      this.fund = val;
      let url = `https://fundmobapi.eastmoney.com/FundMApi/FundBaseTypeInformation.ashx?FCODE=${
        this.fund.fundcode
      }&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=${new Date().getTime()}`;
      this.$axios.get(url).then(res => {
        this.loading = false;
        this.infoData = res.data.Datas;
        this.incrdecObj.addFundRate =
          this.infoData.RATE === "" ? "0.00%" : this.infoData.RATE;
      });
      this.positionIncrdecShow = true;
      this.incrdecObj.addFundDate = this.dateArr[0];
      this.incrdecObj.addFundAmount = null;
      this.incrdecObj.decFundShare = null;
      this.tableHeight = parseInt(document.body.clientHeight / 3 - 78 + "");
      chrome.storage.local.get(["positionArr2"], res => {
        var fundList = [];
        if (res.positionArr2 == null)
          chrome.storage.local.set({ positionArr2: {} });
        else {
          fundList = res.positionArr2[this.fund.fundcode];
          if (fundList == null) fundList = [];
        }
        this.tableData = fundList;
      });
    },
    saveFund() {
      var obj = {
        date: this.incrdecObj.addFundDate,
        type: this.incrdecObj.checked,
        equity: this.fund.dwjz
      };
      if (
        this.incrdecObj.checked === "addfund" &&
        this.incrdecObj.addFundAmount !== null &&
        this.incrdecObj.addFundAmount !== ""
      ) {
        var rate = 0; // this.numberReplace(this.incrdecObj.addFundRate);
        var amount = this.incrdecObj.addFundAmount * rate;
        var addAmount = parseFloat(this.incrdecObj.addFundAmount) - amount;
        this.fund.amount =
          (parseFloat(this.fund.amount) + addAmount).toFixed(2) + "";
        obj.amount = addAmount.toFixed(2);
        obj.quota = (addAmount / this.fund.dwjz).toFixed(2);
        obj.rates = this.incrdecObj.addFundRate;
      } else if (
        this.incrdecObj.checked === "decfund" &&
        this.incrdecObj.decFundShare !== null &&
        this.incrdecObj.decFundShare !== ""
      ) {
        var decNum = this.numberReplace(this.incrdecObj.decFundShare);
        this.fund.num = (parseFloat(this.fund.num) - decNum).toFixed(2) + "";
        obj.amount = (decNum * this.fund.dwjz).toFixed(2);
        obj.quota = decNum.toFixed(2);
        obj.rates = "0.00%";
      }
      this.$emit("passtofather", this.fund, this.incrdecObj.checked);
      this.tableData.push(obj);
      chrome.storage.local.get(["positionArr2"], res => {
        res.positionArr2[this.fund.fundcode] = this.tableData;
        chrome.storage.local.set({ positionArr2: res.positionArr2 });
      });
      this.$message({
        message:
          "保存" +
          (this.incrdecObj.checked === "addfund" ? "买入" : "卖出") +
          "信息成功",
        type: "success",
        center: true
      });
      // this.close();
    },
    removePosArr(val) {
      chrome.storage.local.get(["positionArr2"], res => {
        var index = this.tableData.indexOf(val);
        this.tableData.splice(index, 1);
        res.positionArr2[this.fund.fundcode] = this.tableData;
        chrome.storage.local.set({ positionArr2: res.positionArr2 });
        var checked = "addfund";
        if (val.type === "addfund" || val.type === "finfund") {
          var amount = (
            parseFloat(this.fund.amount) - parseFloat(val.amount)
          ).toFixed(2);
          this.fund.amount = amount < 0 ? "0" : amount + "";
        } else if (val.type === "decfund") {
          this.fund.num =
            (parseFloat(this.fund.num) + parseFloat(val.quota)).toFixed(2) + "";
          checked = "decfund";
        }
        this.$emit("passtofather", this.fund, checked);
      });
    },
    close() {
      this.positionIncrdecShow = false;
      this.$emit("close", false);
    },
    numberReplace(value) {
      if (value == null || value === "" || typeof value == "number")
        return value;
      value = value.replace(/[^\d.]/g, ""); //字符不能是字母
      value = value.replace(/^\./g, ""); //第一个字符不能是.
      value = value.replace(/\.{2,}/g, "."); // 不能连续输入.
      value = value.replace(/(\.\d+)\./g, "$1"); // .后面不能再输入.
      value = value.replace(/(-)\./g, "$1"); // -后面不能输入.
      value = value.replace(/\-{2,}/g, "-"); // -只能保留一个
      value = value.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
      value = value.replace(/-(0){2,}/g, "$1"); // 不能出现-00,-001,-0001类似
      value = value.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
      value = value.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      value = value.replace(/(\d{15})\d*/, "$1"); // 最多保留15位整数
      value = value.replace(/(\.\d{4})\d*/, "$1"); // 最多保留2位小数
      return parseFloat(value);
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    summaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 4 || index === 6) {
          sums[index] = "N/A";
          return;
        }
        var values = data.map(item => Number(item[column.property]));
        if (index === 3) {
          values = data.map(item =>
            Number(
              (item["amount"] * this.numberReplace(item[column.property])) / 100
            )
          );
        }
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) return prev + curr;
            else return prev;
          }, 0);
          sums[index] = parseFloat(sums[index]).toFixed(2) + "";
        } else {
          sums[index] = "N/A";
        }
      });
      return sums;
    }
  }
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
  //width: 450px;
  margin: 0 auto;
  //text-align: center;
  line-height: 1;
  vertical-align: middle;
  //font-size: 0;
}

.tab-row {
  //padding: 12px 0;
  text-align: right;
  margin-top: 15px;
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

/deep/ .el-table--mini .el-table__cell {
  padding: 2px 0;
}

/deep/ .el-card__body {
  padding: 15px 15px;
}
.el-table /deep/ .cell {
  white-space: nowrap;
}

// 暗色模式
.container.darkMode {
  .reward-box {
    background-color: #373737;
    color: rgba(255, 255, 255, 0.6);

    button.checked {
      background-color: rgba(64, 157, 255, 0.6);
    }

    button {
      background: #c0c4cc;
    }
  }

  small {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .btn {
    background-color: rgba(255, 255, 255, 0.16);
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }

  /deep/ th {
    background-color: #373737;
    color: rgba(255, 255, 255, 0.6);
  }

  /deep/ td {
    background-color: #373737;
    color: rgba(255, 255, 255, 0.6);
  }

  /deep/ .el-table tr {
    background-color: #373737;
  }

  /deep/ tbody {
    background-color: #373737;
  }

  /deep/
    .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell {
    background-color: rgba(0, 0, 0, 0.1);
  }

  /deep/ .el-table {
    background-color: #373737;
  }

  /deep/ .el-table__empty-block {
    background-color: #373737;
  }

  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: rgba(64, 157, 255, 0.6);
  }

  /deep/ .el-radio-button__inner {
    background: #fff0;
    color: #fff;
  }

  /deep/ .el-tag {
    background-color: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
}
</style>
