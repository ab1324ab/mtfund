<template>
  <div class="box" ref="box" v-loading="loading" :element-loading-background="darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'">
    <el-row>
      <el-col ref="charts" :xs="this.chartType !== 'LJSY'?16:24" style="margin-left: -10px;">
        <div class="main-echarts" ref="mainCharts"></div>
        <el-row :gutter="5" type="flex">
          <el-col :sm="16" :xs="16" style="text-align: right;">
            <el-radio-group v-model="sltTimeRange" @change="changeTimeRange">
              <el-radio-button label="y">月</el-radio-button>
              <el-radio-button label="3y">季</el-radio-button>
              <el-radio-button label="6y">半年</el-radio-button>
              <el-radio-button label="n">一年</el-radio-button>
              <el-radio-button label="3n">三年</el-radio-button>
              <el-radio-button label="5n">五年</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :sm="8" :xs="8" v-if="this.chartType !== 'LJSY'">
            <el-checkbox-group v-model="sltAmountRange" @change="changeTimeRange">
              <el-checkbox-button label="fin">定投</el-checkbox-button>
              <el-checkbox-button label="add">买入</el-checkbox-button>
              <el-checkbox-button label="dec">卖出</el-checkbox-button>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-col>
      <el-col ref="table" :xs="8" v-if="this.chartType !== 'LJSY'">
        <el-table ref="elTable" :cell-style="{'white-space': 'nowrap'}" :header-cell-style="{'white-space': 'nowrap'}" :default-sort="{prop: 'FSRQ', order: 'descending'}" :data="dataTable" :height="autoTableHeight">
          <el-table-column sortable align="center" width="30" prop="FSRQ" label="日期">
            <template slot-scope="scope">
              {{scope.row.FSRQ.substr(-5)}}
            </template>
          </el-table-column>
          <el-table-column align="center" width="40" prop="DWJZ" label="单位净值">
            <template slot-scope="scope">
              {{scope.row.DWJZ}}
              <!--              / {{scope.row.LJJZ}}-->
            </template>
          </el-table-column>
          <el-table-column align="center" width="40" prop="LJJZ" label="累计净值"></el-table-column>
          <el-table-column align="center" width="40" prop="JZZZL" label="日增涨率">
            <template slot-scope="scope">
              <span v-if="scope.row.JZZZL > 0" class="up">{{scope.row.JZZZL}}%</span>
              <span v-else class="down">{{scope.row.JZZZL}}%</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
import {
  ElCard, ElCol, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption,
  ElRadioButton, ElRadioGroup, ElRow, ElSelect, ElTable, ElTableColumn, ElTag,
  ElCheckboxGroup, ElCheckboxButton
} from '@/common/js/commons';
import "./js/customed.js";
import "./js/dark.js";
import {funCurDate} from '@/common/js/utils'

require("echarts/lib/chart/line");

require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");

export default {
  components: {
    ElRow, ElCol, ElFormItem, ElForm, ElSelect, ElInput,
    ElOption, ElInputNumber, ElTable, ElTableColumn,
    ElCard, ElRadioGroup, ElRadioButton, ElTag, ElCheckboxGroup, ElCheckboxButton
  },
  name: "chatrs",
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
    fund: {
      type: Object,
      required: true,
    },
    chartType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartEL: null,
      myChart: null,
      minVal: null,
      maxVal: null,
      interVal: null,
      sltTimeRange: "y",
      sltAmountRange: ['add', 'dec'],
      chartTypeList: {
        DWJZ: {
          name: "单位净值",
        },
        LJJZ: {
          name: "累计净值",
        },
      },
      option: {},
      loading: false,
      dataTable: [],
      averageMa4: {},
      monitorFund4: {},
    };
  },
  watch: {},
  computed: {
    defaultColor() {
      return this.darkMode ? "rgba(255,255,255,0.6)" : "#ccc";
    },
    autoTableHeight() {
      let boxWidth = document.body.clientWidth;
      if (this.chartType !== 'LJSY' && boxWidth < 550)
        return 140;
      else
        return 255;
    }
  },
  mounted() {
    this.autoWidth();
    this.init();
  },
  beforeDestroy() {
    this.myChart?.clear();
  },
  methods: {
    init() {
      this.chartEL = this.$refs.mainCharts;
      this.myChart = echarts.init(this.chartEL, this.darkMode ? "dark" : "customed");
      this.option = {
        tooltip: {
          trigger: "axis",
          formatter: (p) => {
            return `时间：${p[0].name}<br />${this.chartTypeList[this.chartType].name}：${p[0].value}`;
          },
        },
        grid: {
          top: 30,
          bottom: 30,
          left: 60
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {},
        },
        yAxis: [
          {
            type: "value",
            scale: true,
            axisLabel: {
              color: this.defaultColor,
              formatter: (val) => {
                if (this.chartType === "LJSY") {
                  return val.toFixed(1) + "%";
                } else {
                  return val.toFixed(3);
                }
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: this.defaultColor,
              },
            },
            data: [],
          },
          {
            type: "value",
            scale: true,
            show: false,//this.chartType != "LJSY"
          }
        ],
        series: [
          {
            type: "line",
            data: [],
          },
        ],
      };
      chrome.storage.local.get(["monitorFund4", "averageMa4"], res => {
        this.averageMa4 = res.averageMa4 ? res.averageMa4 : {};
        this.monitorFund4 = res.monitorFund4 ? res.monitorFund4 : {};
        this.getData();
      });
    },
    autoWidth() {
      let boxWidth = this.$refs.box.clientWidth;
      if (this.chartType !== 'LJSY') {
        this.$refs.elTable.$el.style.height = '255px';
        if (boxWidth < 450) {
          this.$refs.charts.$el.style.width = '100%';
          this.$refs.table.$el.style.width = '100%';
          this.$refs.elTable.$el.style.height = '140px';
        }
      }
    },
    changeTimeRange(val) {
      this.getData();
    },
    handle_num_range(data) {
      var _aa = Math.max.apply(null, data);
      var _bb = Math.min.apply(null, data);
      return [_aa, _bb];
    },
    getData() {
      this.loading = true;
      if (this.chartType === "LJSY") {
        let url = `https://fundmobapi.eastmoney.com/FundMApi/FundYieldDiagramNew.ashx?FCODE=${this.fund.fundcode}&RANGE=${this.sltTimeRange}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=${new Date().getTime()}`;
        this.$axios.get(url).then((res) => {
          this.loading = false;
          var dataList = null;
          this.dataTable = dataList = res.data.Datas;
          if (dataList) {
            this.option.legend = {show: true,};
            this.option.tooltip.formatter = (p) => {
              return '' + `${p[0].name}` + '<hr size=1 style="margin: 3px 0">' +
                  '<a style="float: left;width: 60px;text-align: left">' + `${p[0].seriesName}` + '</a><a style="float: right;width: 60px">' + `${p[0].value}` + '</a><br/>' +
                  '<a style="float: left;width: 60px;text-align: left">' + `${p[1].seriesName}` + '</a><a style="float: right;width: 60px">' + `${p[1].value}` + '</a><br/>';
            };
            this.option.series = [
              {
                type: "line",
                name: "涨幅",
                data: dataList.map((item) => +item.YIELD),
              },
              {
                type: "line",
                name: res.data.Expansion.INDEXNAME,
                data: dataList.map((item) => +item.INDEXYIED),
              },
            ];
            this.option.xAxis.data = dataList.map((item) => item.PDATE);
            this.myChart.setOption(this.option);
          }
        });
      } else {
        let url = `https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx?FCODE=${this.fund.fundcode}&RANGE=${this.sltTimeRange}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=${new Date().getTime()}`;
        this.$axios.get(url).then((res) => {
          chrome.storage.local.get(['positionArr2'], (les) => {
            chrome.runtime.sendMessage({type: "DuringWeekHolidayDate"}, (response) => {
              this.loading = false;
              let dataList = null;
              let _this = this;
              this.dataTable = dataList = res.data.Datas;
              let gztimeDate = this.fund.gztime == null ? this.fund.jzrq : this.fund.gztime.substr(0, 10);
              let averageMa4 = this.averageMa4[this.fund.fundcode];
              let ma5average = [], ma10average = [], ma20average = [];
              let ma5arr = averageMa4.ma5arr, ma10arr = averageMa4.ma10arr, ma20arr = averageMa4.ma20arr;
              if (!(funCurDate() <= new Date().setHours(9, 30, 0)) && !response.farewell) {
                let gsz = parseFloat(this.fund.gsz);
                if (gztimeDate !== ma5arr[0].date) {
                  let ma5day = (this.monitorFund4[this.fund.fundcode].slice(0, 4).reduce((prev, cur) => prev + parseFloat(cur.DWJZ), 0) + gsz) / 5;
                  let ma10day = (this.monitorFund4[this.fund.fundcode].slice(0, 9).reduce((prev, cur) => prev + parseFloat(cur.DWJZ), 0) + gsz) / 10;
                  let ma20day = (this.monitorFund4[this.fund.fundcode].slice(0, 19).reduce((prev, cur) => prev + parseFloat(cur.DWJZ), 0) + gsz) / 20;
                  ma5arr.unshift({average: ma5day.toFixed(4), date: gztimeDate});
                  ma10arr.unshift({average: ma10day.toFixed(4), date: gztimeDate});
                  ma20arr.unshift({average: ma20day.toFixed(4), date: gztimeDate});
                }
                if (gztimeDate !== dataList[dataList.length - 1].FSRQ) {
                  let monitorFund4 = this.monitorFund4[this.fund.fundcode][0];
                  let differ = gsz - parseFloat(monitorFund4.DWJZ);
                  let data = {FSRQ: gztimeDate, DWJZ: gsz, LJJZ: (parseFloat(monitorFund4.LJJZ) + differ).toFixed(4), JZZZL: this.fund.gszzl,};
                  dataList.push(data);
                }
              }
              ma5average = ma5arr.slice(0, dataList.length).reverse();
              ma10average = ma10arr.slice(0, dataList.length).reverse();
              ma20average = ma20arr.slice(0, dataList.length).reverse();
              let fundList = [];
              let markPointData = [];
              let markPointData1 = [];
              if (les.positionArr2 != null) {
                fundList = les.positionArr2[this.fund.fundcode] != null ? les.positionArr2[this.fund.fundcode] : [];
                if (fundList.length !== 0)
                  for (let i = 0; i < dataList.length; i++) {
                    let jc = fundList.filter(item => item.date === dataList[i].FSRQ);
                    if (jc.length !== 0) {
                      let color = "", textValue = "";
                      for (let j = 0; j < jc.length; j++) {
                        if (jc[j].type === 'finfund' && this.sltAmountRange.indexOf('fin') !== -1) {
                          color = "#4285f4";
                          textValue = "定";
                        }
                        if (jc[j].type === 'addfund' && this.sltAmountRange.indexOf('add') !== -1) {
                          color = "#4eb61b";
                          textValue = "买";
                        }
                        if (jc[j].type === 'decfund' && this.sltAmountRange.indexOf('dec') !== -1) {
                          color = "#F56C6C";
                          textValue = "卖";
                        }
                      }
                      if (color !== "" && textValue !== "") {
                        let data = {
                          name: '',
                          coord: [i, dataList[i].DWJZ],
                          value: textValue,
                          itemStyle: {color: color,}, label: {color: color,},
                        };
                        let data1 = {
                          name: '',
                          coord: [i, dataList[i].LJJZ],
                          value: textValue,
                          itemStyle: {color: color,}, label: {color: color,},
                        };
                        markPointData.push(data);
                        markPointData1.push(data1);
                      }
                    }
                  }
              }
              this.option.series = [
                {
                  type: "line",
                  name: "单位净值",
                  data: dataList.map((item) => +item.DWJZ),
                  lineStyle: {width: 3},
                  markPoint: {
                    data: markPointData,
                    symbolSize: 8,
                    symbol: 'circle',
                    label: {offset: [0, -15]}
                  }
                },
                {
                  type: "line",
                  name: "累计净值",
                  data: dataList.map((item) => +item.LJJZ),
                  yAxisIndex: dataList[0].DWJZ === dataList[0].LJJZ ? 0 : 1,
                  lineStyle: {width: 3,},
                  markPoint: {
                    data: markPointData1,
                    symbolSize: 8,
                    symbol: 'circle',
                    label: {offset: [0, -15]}
                  }
                },
              ];
              this.option.legend = {
                show: true,
              };
              if (this.sltTimeRange === 'y' || this.sltTimeRange === '3y' || this.sltTimeRange === 'n' || this.sltTimeRange === '6y') {
                let mp5 = {
                  type: "line",
                  name: "MA5",
                  data: ma5average.map((item) => +item.average),
                  lineStyle: {width: 1, color: 'rgba(94,137,255)'},
                  itemStyle: {opacity: 0, color: '#5e89ff'},
                  endLabel: {
                    show: true, distance: 1, formatter: function (e) {
                      return e.data;
                    }
                  },
                };
                let mp10 = {
                  type: "line",
                  name: "MA10",
                  show: true,
                  data: ma10average.map((item) => +item.average),
                  lineStyle: {width: 1, color: 'rgba(230,178,63)'},
                  itemStyle: {opacity: 0, color: '#e6b23f'},
                  endLabel: {
                    show: true, distance: 1, formatter: function (e) {
                      return e.data;
                    }
                  },
                }
                let mp20 = {
                  type: "line",
                  name: "MA20",
                  data: ma20average.map((item) => +item.average),
                  lineStyle: {width: 1, color: 'rgba(255,83,255)'},
                  itemStyle: {opacity: 0, color: '#ff53ff'},
                  endLabel: {
                    show: true, distance: 1, formatter: function (e) {
                      return e.data;
                    }
                  },
                }
                this.option.series.push(mp5);
                this.option.series.push(mp10);
                this.option.series.push(mp20);
                this.option.legend.data = [{name: '单位净值'}, {name: '累计净值'}, {name: 'MA5'}, {name: 'MA10'}, {name: 'MA20'}];
                this.option.legend.selected = {MA5: true, MA10: true, MA20: true};
              } else {
                this.option.legend.data = [{name: '单位净值'}, {name: '累计净值'}];
                this.option.legend.selected = {MA5: false, MA10: false, MA20: false};
              }
              this.option.tooltip = {
                trigger: "axis",
                padding: 5,
                formatter: function (p) {
                  let jc = fundList.filter(item => item.date === dataList[p[0].dataIndex].FSRQ);
                  let tooltip = '' + `${p[0].name}` + '<hr size=1 style="margin: 3px 0">' +
                      '<a style="float: left;width: 60px;text-align: left">单位净值</a><a style="float: right;width: 60px">' + `${p[0].value}` + '</a><br/>' +
                      '<a style="float: left;width: 60px;text-align: left">累计净值</a><a style="float: right;width: 60px">' + `${p[1].value}` + '</a><br/>' +
                      '<a style="float: left;width: 60px;text-align: left">日增长率</a><a style="float: right;width: 60px">' + `${dataList[p[0].dataIndex].JZZZL}%` + '</a><br/>';
                  if (jc.length !== 0) for (let i = 0; i < jc.length; i++) {
                    let textValue = "";
                    if (jc[i].type === 'finfund' && _this.sltAmountRange.indexOf('fin') !== -1) textValue = "定投";
                    if (jc[i].type === 'addfund' && _this.sltAmountRange.indexOf('add') !== -1) textValue = "买入";
                    if (jc[i].type === 'decfund' && _this.sltAmountRange.indexOf('dec') !== -1) textValue = "卖出";
                    if (textValue !== "")
                      tooltip += '<a style="float: left;width: 60px;text-align: left">' + textValue + '</a><a style="float: right;width: 60px">' + jc[i].amount + '</a><br/>';
                  }
                  return tooltip;
                }
              }
              this.option.xAxis.data = dataList.map((item) => item.FSRQ);
              this.myChart.setOption(this.option);
            });
          });
        })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
}

.main-echarts {
  width: 100%;
  height: 232px;
}

.up {
  color: #f56c6c;
  font-weight: bold;
}

.down {
  color: #4eb61b;
  font-weight: bold;
}

/deep/ .el-table th.el-table__cell > .cell {
  padding-left: 0;
  padding-right: 0;
}

/deep/ .el-table .cell {
  padding-left: 0;
  padding-right: 0;
}

/deep/ .el-table .caret-wrapper {
  display: none;
}

/deep/ .el-table--mini .el-table__cell {
  padding: 2px 0;
}

/deep/ .el-table table {
  width: 100% !important;
}

/deep/ .el-table .cell {
  white-space: nowrap;
}

/deep/ .el-checkbox-button--mini {
  .el-checkbox-button__inner {
    padding: 4px 7px;
  }
}

/deep/ .el-radio-button--mini {
  .el-radio-button__inner {
    padding: 4px 7px;
  }
}
</style>
