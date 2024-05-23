<template>
  <div
    id="app"
    class="container"
    ref="app"
    :class="[containerClass]"
    :style="[zoom, opacity]"
  >
    <div
      ref="posmask"
      style="position: fixed;top: 0;left: 0;height: 100%;width: 100%;"
    ></div>
    <div :style="grayscale">
      <div
        class="tab-row"
        v-if="isGetStorage"
        :element-loading-background="
          darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'
        "
        :style="seciList.length > 0 ? { minHeight: '55px' } : {}"
      >
        <div
          v-for="(el, index) in indFundData"
          :draggable="isEdit"
          class="tab-col indFund"
          :class="drag"
          :key="el.f12"
          @click.stop="!isEdit && indDetail(el)"
          @dragstart="handleDragStart($event, el)"
          @dragover.prevent="handleDragOver($event, el)"
          @dragenter="handleDragEnter($event, el, index)"
          @dragend="handleDragEnd($event, el)"
        >
          <el-card class="box-card" ref="exponent">
            <div slot="header" class="clearfix">
              <span style="white-space: nowrap;">{{ el.f14 }}</span>
              <input
                v-if="isEdit && BadgeContent == 3"
                @click="sltInd(el)"
                :class="el.f13 + '.' + el.f12 == RealtimeIndcode ? 'slt' : ''"
                class="btn edit"
                style="margin-left:5px"
                value="✔"
                type="button"
              />
              <el-button
                v-if="isEdit"
                style="float: right; padding: 1px 2px;"
                type="text"
                @click="dltIndFund(index)"
                >✖</el-button
              >
            </div>
            <el-row>
              <el-col :xs="8" :sm="8" ref="exponentIcon">
                <svg
                  style="height: 40px;width: 100%;"
                  t="1692266581586"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5913"
                  width="200"
                  height="200"
                >
                  <path
                    d="M422.4 550.4l-21.333333-21.333333-89.6 89.6-29.866667-29.866667L396.8 469.333333l51.2 51.2L631.466667 341.333333l179.2 179.2-29.866667 29.866667-149.333333-149.333333-183.466667 183.466666-25.6-34.133333zM213.333333 810.666667h597.333334v42.666666H170.666667V213.333333h42.666666v597.333334z"
                    fill="#444444"
                    p-id="5914"
                  ></path>
                </svg>
              </el-col>
              <el-col :xs="16" :sm="16" ref="exponentVal">
                <p :class="el.f3 >= 0 ? 'up' : 'down'">
                  {{ el.f2 }}
                </p>
                <p :class="el.f3 >= 0 ? 'up' : 'down'">
                  {{ el.f4 }}&nbsp;&nbsp;{{ el.f3 }}%
                </p>
              </el-col>
            </el-row>
          </el-card>
          <!--          <svg style="height: 17px;width: 40px;" t="1692266581586" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5913" width="200" height="200"><path d="M422.4 550.4l-21.333333-21.333333-89.6 89.6-29.866667-29.866667L396.8 469.333333l51.2 51.2L631.466667 341.333333l179.2 179.2-29.866667 29.866667-149.333333-149.333333-183.466667 183.466666-25.6-34.133333zM213.333333 810.666667h597.333334v42.666666H170.666667V213.333333h42.666666v597.333334z" fill="#444444" p-id="5914"></path></svg>-->
          <!--          <h5>-->
          <!--            {{el.f14}}-->
          <!--            <span v-if="isEdit" @click="dltIndFund(index)" class="dltBtn edit red btn">✖</span>-->
          <!--          </h5>-->

          <!--          <p :class="el.f3 >= 0 ? 'up' : 'down'">-->
          <!--            {{el.f2}}-->
          <!--            <input v-if="isEdit && BadgeContent == 3" @click="sltInd(el)" :class="el.f13 + '.' + el.f12 == RealtimeIndcode ? 'slt' : ''" class="btn edit" style="margin-left:5px" value="✔" type="button"/>-->
          <!--          </p>-->
          <!--          <p :class="el.f3 >= 0 ? 'up' : 'down'">-->
          <!--            {{el.f4}}&nbsp;&nbsp;{{el.f3}}%-->
          <!--          </p>-->
        </div>
        <div v-if="isEdit" class="tab-col showAddSeci">
          <!--          && indFundData.length < 4-->
          <el-card class="box-card" style="height: 98%;">
            <div
              v-if="!showAddSeciInput"
              class="addSeci"
              @click="() => (showAddSeciInput = true)"
            >
              <svg
                style="width: 40px;height: 40px"
                t="1692282076148"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7038"
                width="200"
                height="200"
              >
                <path
                  d="M509.8 939.7c-239.4 0-434.2-194.8-434.2-434.2S270.4 71.3 509.8 71.3 944 266.1 944 505.5 749.2 939.7 509.8 939.7z m0-832.7c-219.7 0-398.5 178.8-398.5 398.5S290.1 904 509.8 904s398.5-178.8 398.5-398.5S729.6 107 509.8 107z"
                  fill="#c0c4cc"
                  p-id="7039"
                ></path>
                <path
                  d="M492 736V275c0-1.1 0.9-2 2-2h31.7c1.1 0 2 0.9 2 2v461c0 1.1-0.9 2-2 2H494c-1.1 0-2-0.9-2-2z"
                  fill="#c0c4cc"
                  p-id="7040"
                ></path>
                <path
                  d="M279.3 487.7h461.1c1.1 0 2 0.9 2 2v31.7c0 1.1-0.9 2-2 2H279.3c-1.1 0-2-0.9-2-2v-31.7c0-1.1 0.9-2 2-2z"
                  fill="#c0c4cc"
                  p-id="7041"
                ></path>
              </svg>
            </div>
            <div v-else style="margin: 6.2px auto;">
              <div style="padding-top:2px">
                <el-select
                  size="mini"
                  :popper-append-to-body="false"
                  v-model="sltSeci"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in userSeciList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div style="margin-top:13px;text-align: center">
                <el-row type="flex" justify="center">
                  <input
                    class="btn"
                    type="button"
                    value="取消"
                    @click="() => (showAddSeciInput = false)"
                  />
                  <input
                    class="btn"
                    type="button"
                    value="确定"
                    @click="saveSeci()"
                  />
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <div v-if="isEdit" class="searchFunds" style="margin-bottom: 5px;">
        <el-card class="box-card" style="height: 100%;">
          <!--          <div slot="header" class="clearfix">-->
          <!--            <span>部分新发基金或QDII基金可以搜索到，但可能无法获取估值情况</span>-->
          <!--          </div>-->
          <div style="padding: 2px;">
            <el-row type="flex" justify="center">
              <span style="display: block;width: 140px;line-height: 28px;"
                >添加新基金：</span
              >
              <!-- <input v-model="fundcode" class="btn" type="text" placeholder="请输入基金代码" /> -->
              <el-select
                v-model="fundcode"
                multiple
                filterable
                :popper-append-to-body="false"
                remote
                size="mini"
                reserve-keyword
                @visible-change="selectChange"
                placeholder="请输入基金名称或编码搜索，部分新发基金或QDII基金可以搜索到，但可能无法获取估值情况"
                :remote-method="remoteMethod"
                :loading="loading"
                style="width:100%;"
              >
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px;margim-right:20px;padding-right:15px"
                    >{{ item.value }}</span
                  >
                </el-option>
              </el-select>
              <input
                @click="save"
                class="btn primary"
                type="button"
                style="padding: 6px 35px;margin-left: 20px"
                value="确定"
              />
            </el-row>
          </div>
          <!--          <span v-if="isEdit" class="tips center">部分新发基金或QDII基金可以搜索到，但可能无法获取估值情况</span>-->
        </el-card>
      </div>

      <el-tabs
        v-model="activeName"
        v-loading="loadingList"
        type="card"
        addable
        size="mini"
        class="active-funds-tabs"
        @tab-add="addTabPane"
        @tab-remove="removeTabPane"
      >
        <el-tab-pane label="全部基金" name="first">
          <div
            v-if="isGetStorage"
            :element-loading-background="
              darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'
            "
            class="table-row"
          >
            <!--  style="min-height:160px"-->
            <table ref="table" :class="tableHeight + ' table-container'">
              <thead>
                <tr>
                  <th class="align-left">基金名称（{{ dataList.length }}）</th>
                  <th v-if="isEdit">基金代码</th>
                  <th v-if="showGSZ && !isEdit" style="min-width: 70px;">
                    估算净值
                  </th>
                  <th v-if="isEdit && (showCostRate || showCost)">成本价格</th>
                  <th
                    v-if="
                      isEdit &&
                        (showAmount || showGains || showCost || showCostRate)
                    "
                  >
                    持有份额
                  </th>
                  <th
                    @click="sortList('amount')"
                    v-if="showAmount"
                    class="pointer"
                  >
                    持有金额
                    <span :class="sortType.amount" class="down-arrow"></span>
                  </th>
                  <th v-if="isEdit">加减仓位</th>
                  <th
                    @click="sortList('costGains')"
                    v-if="showCost"
                    class="pointer"
                  >
                    持有收益
                    <span :class="sortType.costGains" class="down-arrow"></span>
                  </th>
                  <th
                    @click="sortList('costGainsRate')"
                    v-if="!isEdit && showCostRate"
                    class="pointer"
                  >
                    持有收率
                    <span
                      :class="sortType.costGainsRate"
                      class="down-arrow"
                    ></span>
                  </th>
                  <th v-if="!isEdit" @click="sortList('gszzl')" class="pointer">
                    预估涨跌
                    <span :class="sortType.gszzl" class="down-arrow"></span>
                  </th>
                  <th
                    @click="sortList('navchgrt')"
                    v-if="!isEdit && showNavchgrt"
                    class="pointer"
                  >
                    昨日涨跌
                    <span :class="sortType.navchgrt" class="down-arrow"></span>
                  </th>
                  <th
                    @click="sortList('gains')"
                    v-if="showGains"
                    class="pointer"
                  >
                    估算收益
                    <span :class="sortType.gains" class="down-arrow"></span>
                  </th>
                  <th v-if="!isEdit" style="min-width: 60px;">更新时间</th>
                  <th v-if="isEdit && BadgeContent == 1">关注</th>
                  <th v-if="isEdit">删除</th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-if="dataList.length > 0"
                  v-for="(el, index) in dataList"
                >
                  <tr
                    :key="el.fundcode"
                    :draggable="isEdit"
                    :class="drag"
                    :style="el.trStyle"
                    @dragstart="handleDragStart($event, el)"
                    @dragover.prevent="handleDragOver($event, el)"
                    @dragenter="handleDragEnter($event, el, index)"
                    @dragend="handleDragEnd($event, el)"
                  >
                    <el-tooltip
                      :disabled="el.tips == '' || el.tips == null"
                      :effect="darkMode ? 'dark' : 'light'"
                      placement="right"
                      ><!-- placement="top-end" :content="el.tips"-->
                      <div slot="content" v-html="el.tips"></div>
                      <td
                        :class="
                          isEdit
                            ? 'fundName-noclick align-left'
                            : 'fundName align-left'
                        "
                        @click.stop="!isEdit && fundDetail(el)"
                      >
                        <!-- :title="el.name" -->
                        <span class="hasReplace-tip" v-if="el.hasReplace"
                          >✔</span
                        >{{ el.name }}
                      </td>
                    </el-tooltip>
                    <td v-if="isEdit">{{ el.fundcode }}</td>
                    <td v-if="showGSZ && !isEdit">{{ el.gsz }}</td>
                    <td v-if="isEdit && (showCostRate || showCost)">
                      <input
                        class="btn num"
                        style="cursor: auto;"
                        placeholder="持仓成本价"
                        v-model="el.cost"
                        @input="changeCost(el, index)"
                        type="text"
                      />
                    </td>
                    <td
                      v-if="
                        isEdit &&
                          (showAmount || showGains || showCost || showCostRate)
                      "
                    >
                      <input
                        class="btn num"
                        style="cursor: auto;"
                        placeholder="输入持有份额"
                        v-model="el.num"
                        @input="changeNum(el, index)"
                        type="text"
                      />
                    </td>
                    <td v-if="showAmount">
                      <!-- style="position: relative;"-->
                      <span v-if="!isEdit">
                        {{
                          parseFloat(el.amount).toLocaleString("zh", {
                            minimumFractionDigits: 2
                          })
                        }}
                      </span>
                      <input
                        v-else
                        class="btn num"
                        style="cursor: auto;"
                        placeholder="输入持有金额"
                        v-model="el.amount"
                        @input="changeAmount(el, index)"
                        type="text"
                      />
                    </td>
                    <td v-if="isEdit">
                      <div style="min-width: 66px;">
                        <el-button
                          style="padding: 0"
                          title="持有份额加仓或者卖出"
                          @click="positionIncrdec(el)"
                        >
                          <svg
                            style="height: 17px;width: 40px;"
                            t="1686330770451"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="1508"
                            width="64"
                            height="64"
                          >
                            <path
                              d="M390.948571 288.073143l100.022858 99.986286 100.022857-99.986286a27.611429 27.611429 0 0 1 40.009143 0 27.611429 27.611429 0 0 1 0 40.009143l-108.617143 108.617143v22.820571h97.206857c17.152 0 28.562286 11.446857 28.562286 28.598857 0 17.152-11.410286 28.562286-28.562286 28.562286h-97.206857v45.714286h97.206857c17.152 0 28.562286 11.446857 28.562286 28.598857 0 17.188571-11.410286 28.598857-28.562286 28.598857h-97.206857v62.866286c-5.705143 17.152-17.115429 28.562286-28.525715 28.562285-17.188571 0-28.598857-11.410286-28.598857-28.562285v-62.902858H362.349714c-17.188571 0-28.598857-11.410286-28.598857-28.525714 0-17.188571 11.446857-28.598857 28.598857-28.598857h102.838857v-45.714286H362.422857c-17.188571 0-28.598857-11.446857-28.598857-28.598857 0-17.152 11.446857-28.562286 28.598857-28.562286h102.838857v-17.188571L350.939429 328.082286a27.611429 27.611429 0 0 1 0-40.009143 27.611429 27.611429 0 0 1 40.009142 0z"
                              fill="#333333"
                              p-id="1509"
                            ></path>
                            <path
                              d="M493.824 951.113143C242.322286 951.113143 36.571429 745.325714 36.571429 493.824S242.322286 36.571429 493.824 36.571429s457.289143 205.750857 457.289143 457.252571c0 22.857143 0 45.714286-5.741714 74.313143 0 17.152-17.152 28.598857-34.267429 22.857143-17.188571 0-28.598857-17.152-22.893714-34.304 5.741714-22.857143 5.741714-40.009143 5.741714-62.866286 0-222.902857-177.188571-400.091429-400.091429-400.091429-222.939429 0-400.128 182.893714-400.128 405.833143 0 222.902857 177.188571 400.091429 400.091429 400.091429 22.857143 0 51.456 0 74.313143-5.705143 17.152-5.741714 28.598857 5.705143 34.304 22.857143 5.705143 17.152-5.705143 28.562286-22.857143 34.304h-85.76z"
                              fill="#333333"
                              p-id="1510"
                            ></path>
                            <path
                              d="M936.082286 825.161143h-285.805715c-17.115429 0-28.562286-11.446857-28.562285-28.598857 0-17.115429 11.446857-28.562286 28.562285-28.562286h285.805715c17.152 0 28.562286 11.446857 28.562285 28.562286 0 17.188571-17.115429 28.598857-28.562285 28.598857z"
                              fill="#F72F39"
                              p-id="1511"
                            ></path>
                            <path
                              d="M796.562286 964.644571c-17.115429 0-28.562286-11.410286-28.562286-28.562285v-285.805715c0-17.115429 11.446857-28.562286 28.562286-28.562285 17.188571 0 28.598857 11.446857 28.598857 28.562285v285.805715c0 11.446857-17.152 28.562286-28.598857 28.562285z"
                              fill="#F72F39"
                              p-id="1512"
                            ></path>
                          </svg>
                        </el-button>
                        <el-badge
                          type="primary"
                          :value="el.count"
                          style="vertical-align: unset;"
                          class="el-content-primary"
                        >
                          <el-button
                            style="padding: 0;margin-left: 0;"
                            title="定投份额"
                            @click="positionFinvest(el)"
                          >
                            <svg
                              style="height: 17px;width: 17px;"
                              t="1686331492654"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="1671"
                              width="64"
                              height="64"
                            >
                              <path
                                d="M493.714286 18.285714c262.582857 0 475.428571 212.845714 475.428571 475.428572a36.571429 36.571429 0 0 1-73.142857 0c0-222.171429-180.114286-402.285714-402.285714-402.285715s-402.285714 180.114286-402.285715 402.285715 180.114286 402.285714 402.285715 402.285714a36.571429 36.571429 0 0 1 0 73.142857c-262.582857 0-475.428571-212.845714-475.428572-475.428571s212.845714-475.428571 475.428572-475.428572z"
                                fill="#333333"
                                p-id="1672"
                              ></path>
                              <path
                                d="M274.285714 566.857143a36.571429 36.571429 0 0 1 0-73.142857h182.857143v-182.857143a36.571429 36.571429 0 0 1 73.142857 0v219.428571a36.571429 36.571429 0 0 1-36.571428 36.571429z"
                                fill="#E50738"
                                p-id="1673"
                              ></path>
                              <path
                                d="M617.142857 676.571429a171.446857 91.428571 0 1 0 342.893714 0 171.446857 91.428571 0 1 0-342.893714 0Z"
                                fill="#333333"
                                opacity=".397"
                                p-id="1674"
                              ></path>
                              <path
                                d="M945.737143 749.714286c9.142857 11.190857 14.262857 23.552 14.262857 36.571428 0 50.468571-76.763429 91.428571-171.446857 91.428572-94.646857 0-171.410286-40.96-171.410286-91.428572 0-13.019429 5.12-25.380571 14.262857-36.571428 26.514286 32.292571 86.893714 54.857143 157.147429 54.857143 70.253714 0 130.633143-22.528 157.110857-54.784z"
                                fill="#333333"
                                opacity=".397"
                                p-id="1675"
                              ></path>
                              <path
                                d="M945.737143 859.428571c9.142857 11.190857 14.262857 23.552 14.262857 36.571429 0 50.468571-76.763429 91.428571-171.446857 91.428571-94.646857 0-171.410286-40.96-171.410286-91.428571 0-13.019429 5.12-25.380571 14.262857-36.571429 26.514286 32.292571 86.893714 54.857143 157.147429 54.857143 70.253714 0 130.633143-22.528 157.110857-54.784z"
                                fill="#333333"
                                opacity=".397"
                                p-id="1676"
                              ></path>
                            </svg>
                          </el-button>
                        </el-badge>
                      </div>
                    </td>
                    <td
                      v-if="showCost"
                      :class="el.costGains >= 0 ? 'up' : 'down'"
                    >
                      {{
                        parseFloat(el.costGains).toLocaleString("zh", {
                          minimumFractionDigits: 2
                        })
                      }}
                    </td>
                    <td
                      v-if="!isEdit && showCostRate"
                      :class="el.costGainsRate >= 0 ? 'up' : 'down'"
                    >
                      {{ el.cost > 0 ? el.costGainsRate + "%" : "" }}
                    </td>
                    <td v-if="!isEdit" :class="el.gszzl >= 0 ? 'up' : 'down'">
                      {{ el.gszzl }}%
                    </td>
                    <td
                      v-if="!isEdit && showNavchgrt"
                      :class="el.navchgrt >= 0 ? 'up' : 'down'"
                      style="white-space: nowrap;"
                    >
                      <span>{{ el.navchgrt }}%</span>
                    </td>
                    <td v-if="showGains" :class="el.gains >= 0 ? 'up' : 'down'">
                      {{
                        parseFloat(el.gains).toLocaleString("zh", {
                          minimumFractionDigits: 2
                        })
                      }}
                    </td>
                    <td v-if="!isEdit">
                      {{
                        el.gztime == null
                          ? null
                          : el.hasReplace
                          ? el.gztime.substr(5, 5)
                          : el.gztime.substr(10)
                      }}
                    </td>
                    <td v-if="isEdit && BadgeContent == 1">
                      <input
                        @click="slt(el.fundcode)"
                        :class="el.fundcode == RealtimeFundcode ? 'slt' : ''"
                        class="btn edit"
                        value="✔"
                        type="button"
                      />
                    </td>
                    <td v-if="isEdit">
                      <input
                        @click="dlt(el.fundcode)"
                        class="btn red edit"
                        value="x"
                        type="button"
                      /><!--✖-->
                    </td>
                  </tr>
                </template>
                <template v-if="dataList.length <= 0">
                  <tr>
                    <td
                      ref="tableColspanAll"
                      style="text-align: center;color: #909399;"
                    >
                      <small>无基金数据</small>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-for="item in groupingMap"
          :key="item.name"
          :name="item.name"
          :closable="item.closable"
        >
          <span slot="label">
            {{ item.label }}
            <span @click="editTabPane(item)">
              <el-icon class="el-icon-edit edit-tabs"></el-icon>
            </span>
          </span>
          <div
            v-if="isGetStorage"
            :element-loading-background="
              darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'
            "
            class="table-row"
          >
            <!--  style="min-height:160px"-->
            <table :class="tableHeight + ' table-container'">
              <thead>
                <tr>
                  <th class="align-left">
                    基金名称（{{ item.value.length }}）
                  </th>
                  <th v-if="isEdit">基金代码</th>
                  <th v-if="showGSZ && !isEdit" style="min-width: 70px;">
                    估算净值
                  </th>
                  <th v-if="isEdit && (showCostRate || showCost)">成本价格</th>
                  <th
                    v-if="
                      isEdit &&
                        (showAmount || showGains || showCost || showCostRate)
                    "
                  >
                    持有份额
                  </th>
                  <th
                    @click="sortList('amount')"
                    v-if="showAmount"
                    class="pointer"
                  >
                    持有金额
                    <span :class="sortType.amount" class="down-arrow"></span>
                  </th>
                  <th v-if="isEdit">加减仓位</th>
                  <th
                    @click="sortList('costGains')"
                    v-if="showCost"
                    class="pointer"
                  >
                    持有收益
                    <span :class="sortType.costGains" class="down-arrow"></span>
                  </th>
                  <th
                    @click="sortList('costGainsRate')"
                    v-if="!isEdit && showCostRate"
                    class="pointer"
                  >
                    持有收率
                    <span
                      :class="sortType.costGainsRate"
                      class="down-arrow"
                    ></span>
                  </th>
                  <th v-if="!isEdit" @click="sortList('gszzl')" class="pointer">
                    预估涨跌
                    <span :class="sortType.gszzl" class="down-arrow"></span>
                  </th>
                  <th
                    @click="sortList('navchgrt')"
                    v-if="!isEdit && showNavchgrt"
                    class="pointer"
                  >
                    昨日涨跌
                    <span :class="sortType.navchgrt" class="down-arrow"></span>
                  </th>
                  <th
                    @click="sortList('gains')"
                    v-if="showGains"
                    class="pointer"
                  >
                    估算收益
                    <span :class="sortType.gains" class="down-arrow"></span>
                  </th>
                  <th v-if="!isEdit" style="min-width: 60px;">更新时间</th>
                  <th v-if="isEdit && BadgeContent == 1">关注</th>
                  <th v-if="isEdit">删除</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(el, index) in item.value">
                  <tr
                    :key="el.fundcode"
                    :draggable="isEdit"
                    :class="drag"
                    :style="el.trStyle"
                    @dragstart="handleDragStart($event, el)"
                    @dragover.prevent="handleDragOver($event, el)"
                    @dragenter="handleDragEnter($event, el, index)"
                    @dragend="handleDragEnd($event, el)"
                  >
                    <el-tooltip
                      :disabled="el.tips == '' || el.tips == null"
                      :effect="darkMode ? 'dark' : 'light'"
                      placement="right"
                      ><!-- placement="top-end" :content="el.tips"-->
                      <div slot="content" v-html="el.tips"></div>
                      <td
                        :class="
                          isEdit
                            ? 'fundName-noclick align-left'
                            : 'fundName align-left'
                        "
                        @click.stop="!isEdit && fundDetail(el)"
                      >
                        <!-- :title="el.name" -->
                        <span class="hasReplace-tip" v-if="el.hasReplace"
                          >✔</span
                        >{{ el.name }}
                      </td>
                    </el-tooltip>
                    <td v-if="isEdit">{{ el.fundcode }}</td>
                    <td v-if="showGSZ && !isEdit">{{ el.gsz }}</td>
                    <td v-if="isEdit && (showCostRate || showCost)">
                      <input
                        class="btn num"
                        style="cursor: auto;"
                        placeholder="持仓成本价"
                        v-model="el.cost"
                        @input="changeCost(el, index)"
                        type="text"
                      />
                    </td>
                    <td
                      v-if="
                        isEdit &&
                          (showAmount || showGains || showCost || showCostRate)
                      "
                    >
                      <input
                        class="btn num"
                        style="cursor: auto;"
                        placeholder="输入持有份额"
                        v-model="el.num"
                        @input="changeNum(el, index)"
                        type="text"
                      />
                    </td>
                    <td v-if="showAmount">
                      <!-- style="position: relative;"-->
                      <span v-if="!isEdit">
                        {{
                          parseFloat(el.amount).toLocaleString("zh", {
                            minimumFractionDigits: 2
                          })
                        }}
                      </span>
                      <input
                        v-else
                        class="btn num"
                        style="cursor: auto;"
                        placeholder="输入持有金额"
                        v-model="el.amount"
                        @input="changeAmount(el, index)"
                        type="text"
                      />
                    </td>
                    <td v-if="isEdit">
                      <div style="min-width: 66px;">
                        <el-button
                          style="padding: 0"
                          title="持有份额加仓或者卖出"
                          @click="positionIncrdec(el)"
                        >
                          <svg
                            style="height: 17px;width: 40px;"
                            t="1686330770451"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="1508"
                            width="64"
                            height="64"
                          >
                            <path
                              d="M390.948571 288.073143l100.022858 99.986286 100.022857-99.986286a27.611429 27.611429 0 0 1 40.009143 0 27.611429 27.611429 0 0 1 0 40.009143l-108.617143 108.617143v22.820571h97.206857c17.152 0 28.562286 11.446857 28.562286 28.598857 0 17.152-11.410286 28.562286-28.562286 28.562286h-97.206857v45.714286h97.206857c17.152 0 28.562286 11.446857 28.562286 28.598857 0 17.188571-11.410286 28.598857-28.562286 28.598857h-97.206857v62.866286c-5.705143 17.152-17.115429 28.562286-28.525715 28.562285-17.188571 0-28.598857-11.410286-28.598857-28.562285v-62.902858H362.349714c-17.188571 0-28.598857-11.410286-28.598857-28.525714 0-17.188571 11.446857-28.598857 28.598857-28.598857h102.838857v-45.714286H362.422857c-17.188571 0-28.598857-11.446857-28.598857-28.598857 0-17.152 11.446857-28.562286 28.598857-28.562286h102.838857v-17.188571L350.939429 328.082286a27.611429 27.611429 0 0 1 0-40.009143 27.611429 27.611429 0 0 1 40.009142 0z"
                              fill="#333333"
                              p-id="1509"
                            ></path>
                            <path
                              d="M493.824 951.113143C242.322286 951.113143 36.571429 745.325714 36.571429 493.824S242.322286 36.571429 493.824 36.571429s457.289143 205.750857 457.289143 457.252571c0 22.857143 0 45.714286-5.741714 74.313143 0 17.152-17.152 28.598857-34.267429 22.857143-17.188571 0-28.598857-17.152-22.893714-34.304 5.741714-22.857143 5.741714-40.009143 5.741714-62.866286 0-222.902857-177.188571-400.091429-400.091429-400.091429-222.939429 0-400.128 182.893714-400.128 405.833143 0 222.902857 177.188571 400.091429 400.091429 400.091429 22.857143 0 51.456 0 74.313143-5.705143 17.152-5.741714 28.598857 5.705143 34.304 22.857143 5.705143 17.152-5.705143 28.562286-22.857143 34.304h-85.76z"
                              fill="#333333"
                              p-id="1510"
                            ></path>
                            <path
                              d="M936.082286 825.161143h-285.805715c-17.115429 0-28.562286-11.446857-28.562285-28.598857 0-17.115429 11.446857-28.562286 28.562285-28.562286h285.805715c17.152 0 28.562286 11.446857 28.562285 28.562286 0 17.188571-17.115429 28.598857-28.562285 28.598857z"
                              fill="#F72F39"
                              p-id="1511"
                            ></path>
                            <path
                              d="M796.562286 964.644571c-17.115429 0-28.562286-11.410286-28.562286-28.562285v-285.805715c0-17.115429 11.446857-28.562286 28.562286-28.562285 17.188571 0 28.598857 11.446857 28.598857 28.562285v285.805715c0 11.446857-17.152 28.562286-28.598857 28.562285z"
                              fill="#F72F39"
                              p-id="1512"
                            ></path>
                          </svg>
                        </el-button>
                        <el-badge
                          type="primary"
                          :value="el.count"
                          style="vertical-align: unset;"
                          class="el-content-primary"
                        >
                          <el-button
                            style="padding: 0;margin-left: 0;"
                            title="定投份额"
                            @click="positionFinvest(el)"
                          >
                            <svg
                              style="height: 17px;width: 17px;"
                              t="1686331492654"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="1671"
                              width="64"
                              height="64"
                            >
                              <path
                                d="M493.714286 18.285714c262.582857 0 475.428571 212.845714 475.428571 475.428572a36.571429 36.571429 0 0 1-73.142857 0c0-222.171429-180.114286-402.285714-402.285714-402.285715s-402.285714 180.114286-402.285715 402.285715 180.114286 402.285714 402.285715 402.285714a36.571429 36.571429 0 0 1 0 73.142857c-262.582857 0-475.428571-212.845714-475.428572-475.428571s212.845714-475.428571 475.428572-475.428572z"
                                fill="#333333"
                                p-id="1672"
                              ></path>
                              <path
                                d="M274.285714 566.857143a36.571429 36.571429 0 0 1 0-73.142857h182.857143v-182.857143a36.571429 36.571429 0 0 1 73.142857 0v219.428571a36.571429 36.571429 0 0 1-36.571428 36.571429z"
                                fill="#E50738"
                                p-id="1673"
                              ></path>
                              <path
                                d="M617.142857 676.571429a171.446857 91.428571 0 1 0 342.893714 0 171.446857 91.428571 0 1 0-342.893714 0Z"
                                fill="#333333"
                                opacity=".397"
                                p-id="1674"
                              ></path>
                              <path
                                d="M945.737143 749.714286c9.142857 11.190857 14.262857 23.552 14.262857 36.571428 0 50.468571-76.763429 91.428571-171.446857 91.428572-94.646857 0-171.410286-40.96-171.410286-91.428572 0-13.019429 5.12-25.380571 14.262857-36.571428 26.514286 32.292571 86.893714 54.857143 157.147429 54.857143 70.253714 0 130.633143-22.528 157.110857-54.784z"
                                fill="#333333"
                                opacity=".397"
                                p-id="1675"
                              ></path>
                              <path
                                d="M945.737143 859.428571c9.142857 11.190857 14.262857 23.552 14.262857 36.571429 0 50.468571-76.763429 91.428571-171.446857 91.428571-94.646857 0-171.410286-40.96-171.410286-91.428571 0-13.019429 5.12-25.380571 14.262857-36.571429 26.514286 32.292571 86.893714 54.857143 157.147429 54.857143 70.253714 0 130.633143-22.528 157.110857-54.784z"
                                fill="#333333"
                                opacity=".397"
                                p-id="1676"
                              ></path>
                            </svg>
                          </el-button>
                        </el-badge>
                      </div>
                    </td>
                    <td
                      v-if="showCost"
                      :class="el.costGains >= 0 ? 'up' : 'down'"
                    >
                      {{
                        parseFloat(el.costGains).toLocaleString("zh", {
                          minimumFractionDigits: 2
                        })
                      }}
                    </td>
                    <td
                      v-if="!isEdit && showCostRate"
                      :class="el.costGainsRate >= 0 ? 'up' : 'down'"
                    >
                      {{ el.cost > 0 ? el.costGainsRate + "%" : "" }}
                    </td>
                    <td v-if="!isEdit" :class="el.gszzl >= 0 ? 'up' : 'down'">
                      {{ el.gszzl }}%
                    </td>
                    <td
                      v-if="!isEdit && showNavchgrt"
                      :class="el.navchgrt >= 0 ? 'up' : 'down'"
                      style="white-space: nowrap;"
                    >
                      <span>{{ el.navchgrt }}%</span>
                    </td>
                    <td v-if="showGains" :class="el.gains >= 0 ? 'up' : 'down'">
                      {{
                        parseFloat(el.gains).toLocaleString("zh", {
                          minimumFractionDigits: 2
                        })
                      }}
                    </td>
                    <td v-if="!isEdit">
                      {{
                        el.gztime == null
                          ? null
                          : el.hasReplace
                          ? el.gztime.substr(5, 5)
                          : el.gztime.substr(10)
                      }}
                    </td>
                    <td v-if="isEdit && BadgeContent == 1">
                      <input
                        @click="slt(el.fundcode)"
                        :class="el.fundcode == RealtimeFundcode ? 'slt' : ''"
                        class="btn edit"
                        value="✔"
                        type="button"
                      />
                    </td>
                    <td v-if="isEdit">
                      <input
                        @click="dltGroupFund(el.fundcode, item.name)"
                        class="btn red edit"
                        value="x"
                        type="button"
                      /><!--✖-->
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div
      ref="menuDrag"
      draggable="true"
      @dragend="dragEnd"
      :style="grayscale"
      style="position: fixed;bottom: 35px;right: 50px;"
    >
      <div ref="input-row" class="input-row">
        <!--        <p v-if="isEdit" class="tips" style="margin-top: 10px;margin-left: 3px;">特别关注功能介绍：指定一个基金，在程序图标中以角标的形式实时更新，请在设置中选择角标类型与内容。</p>-->
        <div
          v-show="isEdit"
          class="gear-input-row"
          ref="gearDarkChange"
          style="position: absolute;right: 100px;bottom: -110px;"
          @animationend="handleAnimationEnd"
        >
          <el-card style="padding: 10px 5px 15px;overflow: hidden;">
            <el-row type="flex">
              <el-col :xs="8" :sm="8">
                <el-switch
                  v-model="darkMode"
                  class="switch"
                  @change="changeDarkMode"
                  active-color="#484848"
                  inactive-color="#13ce66"
                  inactive-text="亮色"
                  active-text="暗色"
                ></el-switch>
              </el-col>
              <el-col :xs="16" :sm="16">
                <el-row type="flex">
                  <span class="slider-title">灰度：</span>
                  <el-slider
                    vertical
                    height="100px"
                    class="slider"
                    v-model="grayscaleValue"
                    @change="changeGrayscaleValue"
                    :format-tooltip="formatTooltip"
                  ></el-slider>
                  <span class="slider-title">透明：</span>
                  <el-slider
                    vertical
                    height="100px"
                    class="slider"
                    :max="90"
                    v-model="opacityValue"
                    @change="changeOpacityValue"
                    :format-tooltip="formatTooltip"
                  ></el-slider>
                </el-row>
              </el-col>
            </el-row>
            <!-- <input v-model="containerWidth" type="number" />
            <input v-model="containerHeight" type="number" /> -->
          </el-card>
        </div>
        <el-row type="flex">
          <input
            style="display: none;"
            ref="closedMarketButton"
            class="btn btn-drag"
            v-if="!isDuringDate"
            type="button"
            value="大盘休市"
            @animationend="handleAnimationEnd"
          />
          <input
            style="display: none;"
            ref="isLiveUpdateButton"
            class="btn btn-drag"
            v-if="isDuringDate"
            type="button"
            :value="isLiveUpdate ? '暂停更新' : '实时更新'"
            :title="
              isLiveUpdate
                ? '正在实时更新，点击暂停'
                : '已暂停，点击切换为实时更新'
            "
            @click="changeLiveUpdate"
            @animationend="handleAnimationEnd"
          />
          <div
            style="display: none;"
            class="refresh btn-drag"
            ref="displayRefresh"
            :class="{ isRefresh: isRefresh }"
            title="手动刷新数据"
            @click="refresh"
          >
            <i class="el-icon-refresh"></i>
          </div>
        </el-row>
        <input
          style="display: none;"
          ref="earningsDetailButton"
          class="btn btn-drag"
          type="button"
          value="更新日志"
          @click="openEarningsDetail"
          @animationend="handleAnimationEnd"
        />
        <input
          style="display: none;"
          ref="marketButton"
          class="btn btn-drag"
          type="button"
          @click="market"
          value="行情中心"
          @animationend="handleAnimationEnd"
        />
        <input
          style="display: none;"
          ref="isEditButton"
          class="btn btn-drag"
          type="button"
          :value="isEdit ? '完成编辑' : '编辑基金'"
          @click="isEdit = !isEdit"
          @animationend="handleAnimationEnd"
        />
        <input
          style="display: none;"
          ref="optionButton"
          class="btn btn-drag"
          type="button"
          value="插件设置"
          @click="option"
          @animationend="handleAnimationEnd"
        />
        <!--      <input class="btn primary" type="button" title="φ(>ω<*)" value="打赏" @click="reward"/>-->
      </div>
      <div
        class="input-row"
        ref="incomeCostGains"
        style="left: -45px;top: -45px;"
        v-if="showCost || showGains"
      >
        <el-row>
          <el-badge
            v-if="showGains"
            :value="isNaN(allGains[1]) ? '' : allGains[1] + '%'"
            :type="allGains[0] >= 0 ? 'danger' : 'success'"
            :class="
              allGains[0] >= 0 ? 'el-content-danger' : 'el-content-success'
            "
          >
            <el-tag
              :type="allGains[0] >= 0 ? 'danger' : 'success'"
              :title="
                allGains[0] >= 0
                  ? 'd=====(￣▽￣*)b 赞一个'
                  : '∑(っ°Д°;)っ 大事不好啦'
              "
            >
              日收益:
              <span style="vertical-align: middle;">
                {{
                  parseFloat(allGains[0]).toLocaleString("zh", {
                    minimumFractionDigits: 2
                  })
                }}
              </span>
            </el-tag>
          </el-badge>
          <!--        <input v-if="showCost" class="btn" :class="allCostGains[0] >= 0 ? 'btn-up' : 'btn-down'" type="button"-->
          <!--               :title="allCostGains[0] >= 0 ? 'd=====(￣▽￣*)b 赞一个': '∑(っ°Д°;)っ 大事不好啦'"-->
          <!--               :value="'持有收益：' + parseFloat(allCostGains[0]).toLocaleString('zh', {minimumFractionDigits: 2, }) -->
          <!--                (isNaN(allCostGains[1]) ? '' : '（' + allCostGains[1] + '%）')"/>-->
          <el-badge
            v-if="showCost"
            :value="isNaN(allCostGains[1]) ? '' : allCostGains[1] + '%'"
            :type="allCostGains[0] >= 0 ? 'danger' : 'success'"
            :class="
              allCostGains[0] >= 0 ? 'el-content-danger' : 'el-content-success'
            "
          >
            <el-tag
              :type="allCostGains[0] >= 0 ? 'danger' : 'success'"
              :title="
                allCostGains[0] >= 0
                  ? 'd=====(￣▽￣*)b 赞一个'
                  : '∑(っ°Д°;)っ 大事不好啦'
              "
            >
              总收益:
              <span style="vertical-align: middle;">
                {{
                  parseFloat(allCostGains[0]).toLocaleString("zh", {
                    minimumFractionDigits: 2
                  })
                }}
              </span>
            </el-tag>
          </el-badge>
        </el-row>
      </div>
      <div class="menu-drag" ref="menuDragIconRotate" @click="showmenu">
        <svg
          style="width: 50px;height: 50px;"
          t="1692611594555"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1608"
          width="200"
          height="200"
        >
          <path
            d="M840.3 132.7H591.1c-27.3 0-49.5 22.2-49.5 49.5v249.2c0 27.3 22.2 49.5 49.5 49.5h249.2c27.3 0 49.5-22.2 49.5-49.5V182.2c0-27.3-22.2-49.5-49.5-49.5zM589 182.2c0-1.2 0.9-2.1 2.1-2.1h249.2c1.2 0 2.1 0.9 2.1 2.1v249.2c0 1.2-0.9 2.1-2.1 2.1H591.1c-1.2 0-2.1-0.9-2.1-2.1V182.2zM840.3 536.7H591.1c-27.3 0-49.5 22.2-49.5 49.5v249.2c0 27.3 22.2 49.5 49.5 49.5h249.2c27.3 0 49.5-22.2 49.5-49.5V586.2c0-27.3-22.2-49.5-49.5-49.5zM589 586.2c0-1.2 0.9-2.1 2.1-2.1h249.2c1.2 0 2.1 0.9 2.1 2.1v249.2c0 1.2-0.9 2.1-2.1 2.1H591.1c-1.2 0-2.1-0.9-2.1-2.1V586.2zM435.3 536.7H186.1c-27.3 0-49.5 22.2-49.5 49.5v249.2c0 27.3 22.2 49.5 49.5 49.5h249.2c27.3 0 49.5-22.2 49.5-49.5V586.2c0-27.3-22.2-49.5-49.5-49.5zM184 586.2c0-1.2 0.9-2.1 2.1-2.1h249.2c1.2 0 2.1 0.9 2.1 2.1v249.2c0 1.2-0.9 2.1-2.1 2.1H186.1c-1.2 0-2.1-0.9-2.1-2.1V586.2z"
            fill="#8a8a8a"
            p-id="1609"
          ></path>
          <path
            d="M418.6 171.1c-31.5-24.1-69.1-36.9-108.8-36.9-37 0-72.5 11.2-102.7 32.4-29.5 20.7-51.9 49.4-64.7 82.9-0.7 1.7-1.1 3.5-1.4 5.4-13 37.7-13.2 79.2-0.3 116.9 0.3 1.3 0.6 2.6 1.1 3.9 16.1 43.2 49.2 79.4 90.8 99.4 1 0.6 1.9 1.1 2.8 1.5 23.6 10.8 48.7 16.3 74.6 16.3 10.2 0 20.4-0.9 30.5-2.6 36.7-6.3 70-23.5 96.4-49.8 33.8-33.8 52.4-78.8 52.4-126.7 0-47.9-18.6-92.9-52.4-126.7-5.7-5.7-11.9-11.1-18.3-16z m20.7 141.2c0.3 34.7-13.1 67.5-37.6 92.2-24.5 24.7-57.1 38.3-91.8 38.3-49.6 0-95.4-29-116.9-73.9-0.3-0.8-0.6-1.6-0.9-2.3-21.7-48.6-11.1-106.5 26.3-144.2 42.4-42.7 110.2-50.3 161.1-18.1 37.1 24 59.4 64.3 59.8 108z"
            fill="#8a8a8a"
            p-id="1610"
          ></path>
        </svg>
      </div>
    </div>
    <market
      ref="marketShadow"
      :style="grayscale"
      :darkMode="darkMode"
      @close="closeCharts"
    ></market>
    <ind-detail
      ref="indDetail"
      :style="grayscale"
      @close="closeCharts"
      :darkMode="darkMode"
    ></ind-detail>
    <fund-detail
      ref="fundDetail"
      :style="grayscale"
      @close="closeCharts"
      :fund="sltFund"
      :darkMode="darkMode"
    ></fund-detail>
    <!--    <reward :style="grayscale" @close="rewardShadow = false" ref="reward"></reward>-->
    <incrdec
      ref="positionIncrdec"
      :style="grayscale"
      :darkMode="darkMode"
      @passtofather="pidecfun"
      @close="positionIncrdecShow = false"
      :fund="pisFund"
    ></incrdec>
    <finvest
      ref="positionFinvest"
      :style="grayscale"
      :darkMode="darkMode"
      @passtofather="pidecfun"
      @close="positionFinvestShow = false"
      :fund="pisFund"
    ></finvest>
    <earnings-detail
      ref="earningsDetail"
      :style="grayscale"
      @close="closeEarningsDetail"
      :darkMode="darkMode"
      :top="30"
    ></earnings-detail>
    <groupings
      ref="groupings"
      :style="grayscale"
      @close="closeGroupings"
      @refresh="refresh"
      :darkMode="darkMode"
      :dataList="dataList"
      :top="30"
    ></groupings>

    <change-log
      ref="changelog"
      :style="grayscale"
      @close="closeChangelog"
      :darkMode="darkMode"
      :top="30"
    ></change-log>
  </div>
</template>

<script>
// import reward from "../common/reward";
import incrdec from "../common/positionIncrdec";
import finvest from "../common/positionFinvest";
import indDetail from "../common/indDetail";
import fundDetail from "../common/fundDetail";
import changeLog from "../common/changeLog";
import earningsDetail from "../common/earningsDetail";
import market from "../common/market";
import groupings from "../common/groupings";
import { formatDateTime, funCurDate } from "@/common/js/utils";

const { version } = require("../../package.json");
//防抖
let timeout = null;

function debounce(fn, wait = 700) {
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(fn, wait);
}

export default {
  components: {
    // reward,
    incrdec,
    finvest,
    fundDetail,
    indDetail,
    changeLog,
    market,
    groupings,
    earningsDetail
  },
  data() {
    return {
      isEdit: false,
      fundcode: "",
      isAdd: false,
      indFundData: [],
      isLiveUpdate: false,
      isDuringDate: false,
      RealtimeFundcode: null,
      RealtimeIndcode: null,
      dataList: [],
      tabPaneDataArray: [],
      dataListDft: [],
      groupingMap: {},
      groupingMapDft: {},
      myVar: null,
      myVar1: null,
      // rewardShadow: false,
      positionIncrdecShow: false,
      positionFinvestShow: false,
      checked: "wepay",
      showGains: false,
      showAmount: false,
      showCost: false,
      showCostRate: false,
      showNavchgrt: false,
      showGSZ: false,
      fundList: [],
      fundListM: [],
      pisFund: {},
      sortType: {
        gszzl: "none",
        amount: "none",
        gains: "none",
        costGains: "none",
        costGainsRate: "none",
        navchgrt: "none"
      },
      sortTypeObj: {
        name: null,
        value: null
      },
      searchOptions: [],
      value: [],
      list: [],
      loading: false,
      dragging: null,
      showAddSeciInput: false,
      seciList: ["1.000001", "1.000300", "0.399006"],
      allSeciList: [
        {
          value: "1.000001",
          label: "上证指数"
        },
        {
          value: "1.000300",
          label: "沪深300"
        },
        {
          value: "0.399001",
          label: "深证成指"
        },
        {
          value: "1.000688",
          label: "科创50"
        },
        {
          value: "0.399006",
          label: "创业板指"
        },
        {
          value: "0.399005",
          label: "中小板指"
        },
        {
          value: "100.HSI",
          label: "恒生指数"
        },
        {
          value: "100.DJIA",
          label: "道琼斯"
        },
        {
          value: "100.NDX",
          label: "纳斯达克"
        },
        {
          value: "100.SPX",
          label: "标普500"
        }
      ],
      sltSeci: "",
      darkMode: false,
      normalFontSize: false,
      diyContainer: false,
      containerWidth: 790,
      containerHeight: 590,
      detailShadow: false,
      changelogShadow: false,
      groupingShow: false,
      earningsDetailShow: false,
      sltFund: {},
      sltIndCode: "",
      localVersion: version,
      BadgeContent: 1,
      showBadge: 1,
      userId: null,
      loadingInd: false,
      loadingList: true,
      isGetStorage: false,
      zoom: {
        zoom: 1
      },
      grayscale: {},
      grayscaleValue: 100,
      opacity: {},
      opacityValue: 0,
      isRefresh: false,
      marketShadow: false,
      monitorFund4: {},
      averageMa4: {},
      equityUp: {
        show: false,
        numeric: null
      },
      equityDown: {
        show: false,
        numeric: null
      },
      amplitudeUp: {
        show: false,
        numeric: null
      },
      amplitudeDown: {
        show: false,
        numeric: null
      },
      peakedTips: false,
      finallyTips: false,
      day5AverageUp: false,
      day5AverageDown: false,
      day10AverageUp: false,
      day10AverageDown: false,
      day20AverageUp: false,
      day20AverageDown: false,
      averageCrossover: false,
      groupingArr2: [],
      menuDragX: 0,
      menuDragY: 0,
      activeName: "first"
    };
  },
  mounted() {
    this.$nextTick(function() {
      setTimeout(() => {
        let aa = window.screen.width;
        let bb = this.$refs.app.clientWidth;
        if (aa < bb) {
          this.zoom = {
            zoom: aa / bb
          };
        }
      }, 10);
      this.init();
    });
  },
  computed: {
    allGains() {
      let allGains = 0;
      let allNum = 0;
      let groupingMap = this.groupingMap[this.activeName];
      let dataList =
        this.activeName !== "first" && groupingMap != null
          ? groupingMap.value
          : this.dataList;
      dataList.forEach(val => {
        allGains += parseFloat(val.gains);
        allNum += parseFloat(val.amount);
      });
      allGains = allGains.toFixed(2);
      let allGainsRate = ((allGains * 100) / allNum).toFixed(2);
      return [allGains, allGainsRate];
    },
    allCostGains() {
      let allCostGains = 0;
      let allNum = 0;
      let groupingMap = this.groupingMap[this.activeName];
      let dataList =
        this.activeName !== "first" && groupingMap != null
          ? groupingMap.value
          : this.dataList;
      dataList.forEach(val => {
        allCostGains += parseFloat(val.costGains);
        allNum += parseFloat(val.amount);
      });
      allCostGains = allCostGains.toFixed(2);
      let allCostGainsRate = (
        (allCostGains * 100) /
        (allNum - allCostGains)
      ).toFixed(2);
      return [allCostGains, allCostGainsRate];
    },
    containerClass() {
      let className = "";
      if (this.normalFontSize) {
        className += "normalFontSize ";
      }
      if (this.darkMode) {
        className += "darkMode ";
      }
      if (
        this.changelogShadow ||
        this.groupingShow ||
        this.earningsDetailShow
      ) {
        className += "changelog-container";
      }
      if (this.positionIncrdecShow || this.positionFinvestShow) {
        className += "change-incrdec-finvest-container";
      }
      // else if (this.rewardShadow) {
      //   className += "more-height";
      // }
      else if (this.detailShadow) {
        className += "detail-container";
      } else if (this.isEdit) {
        className += "more-width";
      }
      let tablist = [
        this.showAmount,
        this.showGains,
        this.showCost,
        this.showCostRate,
        this.showNavchgrt,
        this.showGSZ
      ];
      let num = 0;
      tablist.forEach(val => {
        if (val) num++;
      });
      className += " num-width-" + num;

      return className;
    },
    userSeciList() {
      return this.allSeciList.filter(val => {
        return this.seciList.indexOf(val.value) == -1;
      });
    },
    tableHeight() {
      if (this.isEdit) {
        return "table-more-height";
      }
    },
    drag() {
      if (this.isEdit) {
        return "table-drag";
      } else {
        return "";
      }
    }
  },
  watch: {
    //编辑状态停止更新
    isEdit(val) {
      if (val) {
        clearInterval(this.myVar);
        clearInterval(this.myVar1);
        this.dataList = [...this.dataListDft];
        for (const key in this.sortType) {
          if (this.sortType.hasOwnProperty(key)) {
            this.sortType[key] = "none";
          }
        }
      } else {
        this.checkInterval();
      }
      this.$nextTick(function() {
        this.exponent();
      });
    }
  },
  methods: {
    refresh() {
      this.init();
      this.isRefresh = true;
      setTimeout(() => {
        this.isRefresh = false;
      }, 1500);
    },
    formatTooltip(val) {
      return val + "%";
    },
    changeGrayscaleValue(val) {
      this.grayscale = {
        filter: "grayscale(" + val / 100 + ")"
      };
      chrome.storage.sync.set({
        grayscaleValue: this.grayscaleValue
      });
    },
    changeOpacityValue(val) {
      this.opacity = {
        opacity: 1 - val / 100
      };
      chrome.storage.sync.set({
        opacityValue: this.opacityValue
      });
    },
    init() {
      chrome.storage.sync.get(
        [
          "RealtimeFundcode",
          "RealtimeIndcode",
          "fundListM",
          "showAmount",
          "showGains",
          "fundList",
          "seciList",
          "darkMode",
          "normalFontSize",
          "isLiveUpdate",
          "showCost",
          "showCostRate",
          "showNavchgrt",
          "showGSZ",
          "version",
          "showBadge",
          "BadgeContent",
          "userId",
          "grayscaleValue",
          "opacityValue",
          "sortTypeObj",
          "equityUp",
          "equityDown",
          "amplitudeUp",
          "amplitudeDown",
          "peakedTips",
          "finallyTips",
          "day5AverageUp",
          "day5AverageDown",
          "day10AverageUp",
          "day10AverageDown",
          "day20AverageUp",
          "day20AverageDown",
          "averageCrossover",
          "groupingArr2"
        ],
        res => {
          chrome.storage.local.get(["monitorFund4", "averageMa4"], les => {
            this.fundList = res.fundList ? res.fundList : this.fundList;
            if (res.fundListM) {
              this.fundListM = res.fundListM;
            } else {
              for (const fund of this.fundList) {
                let val = { code: fund, num: 0 };
                this.fundListM.push(val);
              }
              chrome.storage.sync.set({
                fundListM: this.fundListM
              });
            }
            if (res.userId) {
              this.userId = res.userId;
            } else {
              this.userId = this.getGuid();
              chrome.storage.sync.set({
                userId: this.userId
              });
            }
            this.darkMode = res.darkMode ? res.darkMode : false;
            this.normalFontSize = res.normalFontSize
              ? res.normalFontSize
              : false;
            this.seciList = res.seciList ? res.seciList : this.seciList;
            this.showAmount = res.showAmount ? res.showAmount : false;
            this.showGains = res.showGains ? res.showGains : false;
            this.RealtimeFundcode = res.RealtimeFundcode;
            this.RealtimeIndcode = res.RealtimeIndcode;
            this.isLiveUpdate = res.isLiveUpdate ? res.isLiveUpdate : false;
            this.showCost = res.showCost ? res.showCost : false;
            this.showCostRate = res.showCostRate ? res.showCostRate : false;
            this.showNavchgrt = res.showNavchgrt ? res.showNavchgrt : false;
            this.showGSZ = res.showGSZ ? res.showGSZ : false;
            this.BadgeContent = res.BadgeContent ? res.BadgeContent : 1;
            this.showBadge = res.showBadge ? res.showBadge : 1;
            this.grayscaleValue = res.grayscaleValue ? res.grayscaleValue : 0;
            this.opacityValue = res.opacityValue ? res.opacityValue : 0;
            this.sortTypeObj = res.sortTypeObj ? res.sortTypeObj : {};
            this.equityUp = res.equityUp ? res.equityUp : {};
            this.equityDown = res.equityDown ? res.equityDown : {};
            this.amplitudeUp = res.amplitudeUp ? res.amplitudeUp : {};
            this.amplitudeDown = res.amplitudeDown ? res.amplitudeDown : {};
            this.peakedTips = res.peakedTips ? res.peakedTips : false;
            this.finallyTips = res.finallyTips ? res.finallyTips : false;
            this.day5AverageUp = res.day5AverageUp ? res.day5AverageUp : false;
            this.day5AverageDown = res.day5AverageDown
              ? res.day5AverageDown
              : false;
            this.day10AverageUp = res.day10AverageUp
              ? res.day10AverageUp
              : false;
            this.day10AverageDown = res.day10AverageDown
              ? res.day10AverageDown
              : false;
            this.day20AverageUp = res.day20AverageUp
              ? res.day20AverageUp
              : false;
            this.day20AverageDown = res.day20AverageDown
              ? res.day20AverageDown
              : false;
            this.averageCrossover = res.averageCrossover
              ? res.averageCrossover
              : false;
            this.groupingArr2 = res.groupingArr2 ? res.groupingArr2 : {};
            this.monitorFund4 = les.monitorFund4 ? les.monitorFund4 : {};
            this.averageMa4 = les.averageMa4 ? les.averageMa4 : {};
            if (this.seciList.length > 0) {
              this.loadingInd = true;
            }
            this.grayscale = {
              filter: "grayscale(" + this.grayscaleValue / 100 + ")"
            };
            this.opacity = {
              opacity: 1 - this.opacityValue / 100
            };

            this.isGetStorage = true;
            this.getIndFundData();
            this.getData();
            this.checkInterval(true);
            this.tableColspan(); // '无数据'表格,列占全行
            let ver = res.version ? res.version : "1.0.0";
            if (ver !== this.localVersion) {
              this.changelog();
            }
          });
        }
      );
    },
    getGuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    indDetail(val) {
      // this.sltIndCode = val.f13 + "." + val.f12;
      this.detailShadow = true;
      this.$refs.indDetail.init(val);
    },
    fundDetail(val) {
      this.sltFund = val;
      this.detailShadow = true;
      this.$refs.fundDetail.init();
    },
    closeCharts() {
      this.detailShadow = false;
    },
    market() {
      this.detailShadow = true;
      this.$refs.marketShadow.init();
    },
    checkInterval(isFirst) {
      clearInterval(this.myVar);
      clearInterval(this.myVar1);
      chrome.runtime.sendMessage({ type: "DuringDate" }, response => {
        this.isDuringDate = response.farewell;
        if (this.isLiveUpdate && this.isDuringDate) {
          if (!isFirst) {
            this.getIndFundData();
            this.getData();
          }
          this.myVar = setInterval(() => {
            this.getIndFundData();
          }, 5 * 1000);
          this.myVar1 = setInterval(() => {
            this.getData();
          }, 60 * 1000);
        } else {
          clearInterval(this.myVar);
          clearInterval(this.myVar1);
        }
      });
    },
    selectChange() {
      this.searchOptions = [];
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let url =
          "https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?&m=9&key=" +
          query +
          "&_=" +
          new Date().getTime();
        this.$axios.get(url).then(res => {
          this.searchOptions = res.data.Datas.filter(val => {
            let hasCode = this.fundListM.some((currentValue, index, array) => {
              return currentValue.code == val.CODE;
            });
            return !hasCode;
          }).map(val => {
            return { value: val.CODE, label: val.NAME };
          });
          this.loading = false;
        });
      } else {
        this.searchOptions = [];
      }
    },
    option() {
      chrome.tabs.create({ url: "/options/options.html" });
    },
    // reward() { this.rewardShadow = true; this.$refs.reward.init();  },
    positionIncrdec(val) {
      this.pisFund = val;
      this.$refs.positionIncrdec.init(val);
      this.positionIncrdecShow = true;
    },
    positionFinvest(val) {
      this.pisFund = val;
      this.$refs.positionFinvest.init(val);
      this.positionFinvestShow = true;
    },
    pidecfun(val, checked) {
      if (checked === "addfund") this.changeAmount(val, 0);
      if (checked === "decfund") this.changeNum(val, 0);
    },
    changelog() {
      this.changelogShadow = true;
      this.$refs.changelog.init();
    },
    closeChangelog() {
      this.changelogShadow = false;
      chrome.storage.sync.set({
        version: this.localVersion
      });
    },
    sortList(type) {
      for (const key in this.sortType) {
        if (this.sortType.hasOwnProperty(key)) {
          if (key !== type) {
            this.sortType[key] = "none";
          }
        }
      }
      this.sortType[type] =
        this.sortType[type] === "desc"
          ? "asc"
          : this.sortType[type] === "asc"
          ? "none"
          : "desc";
      if (this.sortType[type] === "none") {
        this.dataList = [...this.dataListDft];
        this.groupingMap = { ...this.groupingMapDft };
      } else {
        this.dataList = this.dataList.sort(
          this.compare(type, this.sortType[type])
        );
        for (let grouping in this.groupingMap) {
          this.groupingMap[grouping].value = this.groupingMap[
            grouping
          ].value.sort(this.compare(type, this.sortType[type]));
        }
      }
      this.sortTypeObj = {
        name: type,
        type: this.sortType[type]
      };
      chrome.storage.sync.set({ sortTypeObj: this.sortTypeObj });
    },
    compare(property, type) {
      return function(obj1, obj2) {
        var val1 = obj1[property];
        var val2 = obj2[property];
        if (type == "asc") {
          return val1 - val2;
        } else {
          return val2 - val1;
        }
      };
    },
    changeDarkMode() {
      chrome.storage.sync.set({
        darkMode: this.darkMode
      });
    },
    changeLiveUpdate() {
      chrome.storage.sync.set({ isLiveUpdate: !this.isLiveUpdate }, () => {
        this.isLiveUpdate = !this.isLiveUpdate;
        this.checkInterval();
      });
    },
    saveSeci() {
      this.seciList.push(this.sltSeci);
      chrome.storage.sync.set({ seciList: this.seciList }, () => {
        this.sltSeci = "";
        this.getIndFundData();
      });
    },
    dltIndFund(ind) {
      this.seciList.splice(ind, 1);
      chrome.storage.sync.set({ seciList: this.seciList }, () => {
        this.getIndFundData();
      });
    },
    getIndFundData() {
      let seciListStr = this.seciList.join(",");
      let url =
        "https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f13,f14&secids=" +
        seciListStr +
        "&_=" +
        new Date().getTime();
      this.$axios.get(url).then(res => {
        this.loadingInd = false;
        this.indFundData = res.data.data.diff;
        this.$nextTick(function() {
          this.exponent();
        });
      });
    },
    getData(type) {
      let _this = this;
      let fundlist = this.fundListM.map(val => val.code).join(",");
      let url =
        "https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=200&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=" +
        this.userId +
        "&Fcodes=" +
        fundlist;
      // this.$axios.get(url).then((res) => {
      this.loadingList = true;
      this.$axios
        .post("https://api.fund.eastmoney.com/favor/GetFundsInfo", {
          fcodes: fundlist
        })
        .then(res => {
          chrome.runtime.sendMessage(
            { type: "DuringWeekHolidayDate" },
            response => {
              let datares = res.data;
              let data = res.data.Data.KFS;
              this.dataList = [];
              let dataList = [];
              this.groupingMap = {};
              let groupingMap = {};
              if (data == null) return;
              let datestr = formatDateTime(
                new Date(Number(res.data.Expansion.bjTime) * 1000),
                "yyyy-MM-dd hh:mm"
              );
              data.forEach(val => {
                if (
                  this.fundListM.filter(item => item.code === val.FCODE)
                    .length === 0
                )
                  return;
                let monitorFund = _this.monitorFund4[val.FCODE];
                let averageMa = _this.averageMa4[val.FCODE];
                let data = {
                  fundcode: val.FCODE,
                  name: val.SHORTNAME,
                  jzrq: val.FSRQ,
                  dwjz: isNaN(val.DWJZ) ? null : val.DWJZ,
                  gsz: isNaN(val.gsz) ? null : val.gsz,
                  gszzl: isNaN(val.gszzl) ? 0 : val.gszzl,
                  navchgrt:
                    monitorFund != null ? monitorFund[0].JZZZL : val.RZDF,
                  gztime: datestr,
                  ftype: val.FTYPE
                };
                if (data.ftype === "QDII" && data.gszzl === "")
                  data.navchgrt = monitorFund[1].JZZZL;
                if (
                  //(data.gsz === "--" && data.gszzl === "--" && data.gztime === "--") ||
                  // (data.gsz === null && data.gszzl === null && data.gztime === null ||
                  (data.gsz === "" && data.gszzl === "") ||
                  data.jzrq === data.gztime.substr(0, 10) ||
                  funCurDate() <= new Date().setHours(9, 30, 0) ||
                  response.farewell
                ) {
                  data.gsz = data.dwjz;
                  data.gszzl = val.RZDF;
                  data.hasReplace = true;
                }
                let slt = this.fundListM.filter(
                  item => item.code === data.fundcode
                )[0];
                data.num = slt == null ? 0 : slt.num;
                data.cost = slt == null ? 0 : slt.cost;
                data.amount = this.calculateMoney(data);
                data.gains = this.calculate(data, data.hasReplace);
                data.costGains = this.calculateCost(data);
                data.costGainsRate = this.calculateCostRate(data);
                if (slt != null && slt.fvest != null && slt.fvest.cvt) {
                  // 定投角标
                  data.count = slt.fvest.count == null ? 0 : slt.fvest.count;
                }
                if (data.fundcode === this.RealtimeFundcode)
                  if (this.showBadge === 1)
                    if (this.BadgeContent === 1) {
                      chrome.runtime.sendMessage({
                        type: "refreshBadge",
                        data: data
                      });
                    }
                if (monitorFund != null && averageMa != null) {
                  monitorFund = monitorFund.slice(0, 21);
                  var rgbaList = [];
                  if (this.equityUp.show) {
                    var checkup = true;
                    var upfund = monitorFund.filter(item => {
                      if (item.JZZZL >= 0 && checkup) return true;
                      else return (checkup = false);
                    });
                    var upGszzl = upfund.reduce(
                      (prev, cur) => prev + parseFloat(cur.JZZZL),
                      0
                    );
                    // console.info("上涨" + upfund.length + "日，共上涨 " + upGszzl.toFixed(2) + " " + data.name);
                    if (upfund.length >= this.equityUp.numeric)
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(245, 108, 108, 0.3)",
                        "该基金已经连续上涨 " +
                          upfund.length +
                          " 日，共上涨 " +
                          upGszzl.toFixed(2) +
                          " %"
                      );
                  }
                  if (this.equityDown.show) {
                    var checkdown = true;
                    var downfund = monitorFund.filter(item => {
                      if (item.JZZZL < 0 && checkdown) return true;
                      else return (checkdown = false);
                    });
                    var downGszzl = downfund.reduce(
                      (prev, cur) => prev + parseFloat(cur.JZZZL),
                      0
                    );
                    // console.info("下跌" + upfund.length + "日，共下跌 " + upGszzl.toFixed(2) + " " + data.name);
                    if (downfund.length >= this.equityDown.numeric)
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(78, 182, 27, 0.3)",
                        "该基金已经连续下跌 " +
                          downfund.length +
                          " 日，共下跌 " +
                          downGszzl.toFixed(2) +
                          " %"
                      );
                  }
                  let minFundVal = Math.min.apply(
                    Math,
                    monitorFund.map(item => item.DWJZ)
                  );
                  let maxFundVal = Math.max.apply(
                    Math,
                    monitorFund.map(item => item.DWJZ)
                  );
                  if (this.amplitudeUp.show && minFundVal != null) {
                    var upche = (
                      ((parseFloat(data.gsz) - minFundVal) /
                        parseFloat(data.gsz)) *
                      100
                    ).toFixed(2);
                    // console.info(parseFloat(data.gsz) + " - " + minFundVal + " = " + ((parseFloat(data.gsz) - minFundVal) / parseFloat(data.gsz)).toFixed(4) + " - " + data.name + "     " + upche);
                    if (upche >= this.amplitudeUp.numeric)
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(245, 108, 108, 0.5)",
                        "累计涨幅 " +
                          upche +
                          " %，超过设定" +
                          this.amplitudeUp.numeric +
                          " %"
                      );
                  }
                  if (this.amplitudeDown.show && maxFundVal != null) {
                    var downche = (
                      ((parseFloat(data.gsz) - maxFundVal) /
                        parseFloat(data.gsz)) *
                      100
                    ).toFixed(2);
                    // console.info(parseFloat(data.gsz) + " - " + maxFundVal + " = " + ((parseFloat(data.gsz) - maxFundVal) / parseFloat(data.gsz)).toFixed(4) + " - " + data.name + "     " + downche);
                    if (-this.amplitudeDown.numeric > downche)
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(78, 182, 27, 0.5)",
                        "累计跌幅 " +
                          downche +
                          " %，跌出设定" +
                          this.amplitudeDown.numeric +
                          " %"
                      );
                  }
                  let ma5day,
                    ma10day,
                    ma20day,
                    ma5averageEnd,
                    ma10averageEnd,
                    ma20averageEnd;
                  averageMa.ma5arr = averageMa.ma5arr.slice(0, 21);
                  averageMa.ma10arr = averageMa.ma10arr.slice(0, 21);
                  averageMa.ma20arr = averageMa.ma20arr.slice(0, 21);
                  ma5averageEnd = ma5day = averageMa.ma5arr[0].average;
                  ma10averageEnd = ma10day = averageMa.ma10arr[0].average;
                  ma20averageEnd = ma20day = averageMa.ma20arr[0].average;
                  let averMsg = data.gszzl < 0 ? "下跌跌出" : "上涨超过";
                  //console.info("ma5day=" + ma5day.toFixed(4) + " ma10day=" + ma10day.toFixed(4) + " ma20day=" + ma20day.toFixed(4));
                  if (
                    this.day5AverageUp &&
                    data.dwjz < ma5day &&
                    ma5day < data.gsz
                  )
                    this.monitorRemindMessage(
                      data,
                      rgbaList,
                      "rgba(94,137,255,0.5)",
                      "今日" + averMsg + "05日平均线"
                    );
                  if (
                    this.day5AverageDown &&
                    data.dwjz > ma5day &&
                    ma5day > data.gsz
                  )
                    this.monitorRemindMessage(
                      data,
                      rgbaList,
                      "rgba(94,137,255,0.5)",
                      "今日" + averMsg + "05日平均线"
                    );
                  if (
                    this.day10AverageUp &&
                    data.dwjz < ma10day &&
                    ma10day < data.gsz
                  )
                    this.monitorRemindMessage(
                      data,
                      rgbaList,
                      "rgba(230,178,63,0.5)",
                      "今日" + averMsg + "10日平均线"
                    );
                  if (
                    this.day10AverageDown &&
                    data.dwjz > ma10day &&
                    ma10day > data.gsz
                  )
                    this.monitorRemindMessage(
                      data,
                      rgbaList,
                      "rgba(230,178,63,0.5)",
                      "今日" + averMsg + "10日平均线"
                    );
                  if (
                    this.day20AverageUp &&
                    data.dwjz < ma20day &&
                    ma20day < data.gsz
                  )
                    this.monitorRemindMessage(
                      data,
                      rgbaList,
                      "rgba(255,83,255,0.5)",
                      "今日" + averMsg + "20日平均线"
                    );
                  if (
                    this.day20AverageDown &&
                    data.dwjz > ma20day &&
                    ma20day > data.gsz
                  )
                    this.monitorRemindMessage(
                      data,
                      rgbaList,
                      "rgba(255,83,255,0.5)",
                      "今日" + averMsg + "20日平均线"
                    );
                  if (this.averageCrossover && data.gztime != null) {
                    let ma5averageStart = averageMa.ma5arr[1].average;
                    let ma10averageStart = averageMa.ma10arr[1].average;
                    let ma20averageStart = averageMa.ma20arr[1].average;
                    if (
                      (ma5averageStart <= ma10averageStart &&
                        ma10averageEnd <= ma5averageEnd) ||
                      (ma5averageStart >= ma10averageStart &&
                        ma10averageEnd >= ma5averageEnd)
                    )
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(167, 176, 206,0.5)",
                        "日平均线相交 5日X10日"
                      );
                    if (
                      (ma5averageStart <= ma20averageStart &&
                        ma20averageEnd <= ma5averageEnd) ||
                      (ma5averageStart >= ma20averageStart &&
                        ma20averageEnd >= ma5averageEnd)
                    )
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(174 ,152, 255, 0.5)",
                        "日平均线相交 5日X20日"
                      ); //基金5日平均线和20日平均线相交
                    if (
                      (ma10averageStart <= ma20averageStart &&
                        ma20averageEnd <= ma10averageEnd) ||
                      (ma10averageStart >= ma20averageStart &&
                        ma20averageEnd >= ma10averageEnd)
                    )
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(242 ,172, 158,0.5)",
                        "日平均线相交 10日X20日"
                      );
                  }
                  let highestObj = {},
                    lowestObj = {};
                  for (let i = 1; i < monitorFund.length; i++)
                    if (monitorFund[i].DWJZ >= data.dwjz)
                      if (monitorFund[i].JZZZL > 0) {
                        highestObj = monitorFund[i];
                        break;
                      }
                  for (let i = 1; i < monitorFund.length; i++)
                    if (monitorFund[i].DWJZ <= data.dwjz)
                      if (monitorFund[i].JZZZL < 0) {
                        lowestObj = monitorFund[i];
                        break;
                      }
                  if (this.peakedTips) {
                    let str = "";
                    if (highestObj.DWJZ == null && data.gszzl <= 0.5)
                      str += "昨日高点，今日涨跌幅度过低，"; // 昨天为最高点,今天滞涨
                    if (
                      highestObj.DWJZ != null &&
                      (
                        (parseFloat(highestObj.DWJZ) +
                          parseFloat(lowestObj.DWJZ)) /
                        2
                      ).toFixed(4) <= data.gsz &&
                      data.gszzl <= 0.5 &&
                      data.gszzl >= -0.5
                    )
                      str += "超过最高点最低点的平均值，今日涨跌幅度过低，";
                    if (str !== "")
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(78, 182,27,0.6)",
                        str.slice(0, -1)
                      );
                  }
                  if (this.finallyTips) {
                    let str = "";
                    if (
                      lowestObj.DWJZ == null &&
                      data.navchgrt <= -2.0 &&
                      data.gszzl <= 0.5 &&
                      data.gszzl >= -0.5
                    )
                      str += "昨日暴跌，今日下跌幅度小，"; // 昨天暴跌,今天未持续
                    let mindown =
                      monitorFund
                        .slice(0, 2)
                        .reduce(
                          (prev, cur) => prev + parseFloat(cur.JZZZL),
                          0
                        ) + parseFloat(data.gszzl);
                    if (
                      lowestObj.DWJZ == null &&
                      1.5 >= mindown &&
                      mindown >= -1.5
                    )
                      str +=
                        "连续多日小幅度下跌，今日" +
                        (data.gszzl < 0 ? "下跌" : "上涨") +
                        "，"; // 连续多日小幅度下跌
                    let minimum =
                      lowestObj.DWJZ == null
                        ? monitorFund[0].DWJZ
                        : lowestObj.DWJZ;
                    let median = (
                      (parseFloat(highestObj.DWJZ) + parseFloat(minimum)) /
                      2
                    ).toFixed(4);
                    let scale = ((median - data.gsz) / median) * 100;
                    if (
                      (scale < 0 && scale >= -0.5) ||
                      (scale > 0 && scale <= 0.5)
                    )
                      str += "即将接近最高点最低点的平均值，";
                    if (str !== "")
                      this.monitorRemindMessage(
                        data,
                        rgbaList,
                        "rgba(242,172,158,0.6)",
                        str.slice(0, -1)
                      );
                  }
                }
                dataList.push(data);
                for (let key in this.groupingArr2) {
                  let val = this.groupingArr2[key];
                  if (val.value.includes(data.fundcode)) {
                    let grouping = groupingMap[val.name];
                    if (grouping == null)
                      groupingMap[val.name] = {
                        name: val.name,
                        label: val.label,
                        closable: true,
                        value: [data]
                      };
                    else grouping.value.push(data);
                  }
                }
              });
              if (this.showBadge === 1)
                if (this.BadgeContent === 2) {
                  chrome.runtime.sendMessage({
                    type: "refreshBadgeAllGains",
                    data: datares
                  });
                }
              this.dataListDft = [...dataList];
              this.groupingMapDft = { ...groupingMap };
              if (type === "add") {
                this.dataList = dataList;
                this.groupingMap = groupingMap;
              } else if (this.sortTypeObj.type !== "none") {
                this.sortType[this.sortTypeObj.name] = this.sortTypeObj.type;
                this.dataList = dataList.sort(
                  this.compare(this.sortTypeObj.name, this.sortTypeObj.type)
                );
                for (let grouping in groupingMap) {
                  groupingMap[grouping].value = groupingMap[
                    grouping
                  ].value.sort(
                    this.compare(this.sortTypeObj.name, this.sortTypeObj.type)
                  );
                }
                this.groupingMap = groupingMap;
              } else {
                this.dataList = dataList;
                this.groupingMap = groupingMap;
              }
            }
          );
        })
        .catch(error => {
          console.info(11);
          console.info(error);
          this.loadingList = false;
        })
        .finally(e => {
          this.loadingList = false;
        });
    },
    monitorRemindMessage(data, rgbaList, color, tips) {
      rgbaList.push(color);
      let scale = 20,
        style = "",
        str = "";
      if (data.gszzl < 0)
        style =
          "background: rgba(78,182,27,0.2);background: linear-gradient(90deg, rgba(78,182,27,0.1) " +
          scale +
          "%, rgba(78,182,27,0.1)" +
          (scale + 2) +
          "%,";
      else
        style =
          "background: rgba(245,108,108,0.2);background: linear-gradient(90deg, rgba(245,108,108,0.1) " +
          scale +
          "%, rgba(245,108,108,0.1)" +
          (scale + 2) +
          "%,";
      for (let i = 0; i < rgbaList.length; i++)
        str +=
          rgbaList[i] +
          " " +
          (scale + 2 + i) +
          "%," +
          rgbaList[i] +
          " " +
          (scale + 2 + i + 1) +
          "%,";
      if (data.gszzl < 0)
        str =
          style +
          str +
          "rgba(78,182,27,0.2) " +
          (scale + 2 + rgbaList.length) +
          "%) !important;";
      else
        str =
          style +
          str +
          "rgba(245,108,108,0.2) " +
          (scale + 2 + rgbaList.length) +
          "%) !important;";
      data.trStyle = str;
      if (data.tips == null || data.tips === "") data.tips = tips;
      else data.tips += "<br/>" + tips;
    },
    changeNum(item, ind) {
      debounce(() => {
        for (let fund of this.fundListM) {
          if (fund.code == item.fundcode) {
            fund.num = this.numberReplace(item.num);
            item.num = this.numberReplace(item.num);
          }
        }
        chrome.storage.sync.set({ fundListM: this.fundListM }, () => {
          item.amount = this.calculateMoney(item);
          item.gains = this.calculate(item, item.hasReplace);
          item.costGains = this.calculateCost(item);
          chrome.runtime.sendMessage({ type: "refresh" });
        });
      });
    },
    changeAmount(item, ind) {
      debounce(() => {
        for (let fund of this.fundListM) {
          if (fund.code == item.fundcode) {
            fund.num = this.calculateNum(item);
          }
        }
        chrome.storage.sync.set({ fundListM: this.fundListM }, () => {
          item.num = this.calculateNum(item);
          item.gains = this.calculate(item, item.hasReplace);
          item.costGains = this.calculateCost(item);
          chrome.runtime.sendMessage({ type: "refresh" });
        });
      });
    },
    changeCost(item, ind) {
      debounce(() => {
        for (let fund of this.fundListM) {
          if (fund.code == item.fundcode)
            fund.cost = item.cost = this.numberReplace(item.cost);
        }
        chrome.storage.sync.set({ fundListM: this.fundListM }, () => {
          item.costGains = this.calculateCost(item);
          item.costGainsRate = this.calculateCostRate(item);
        });
      });
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
    calculateMoney(val) {
      let sum = (val.dwjz * val.num).toFixed(2);
      return sum;
    },
    calculateNum(val) {
      return (val.amount / val.dwjz).toFixed(2); // 金额除以单位净值等于持有份额
    },
    calculate(val, hasReplace) {
      var sum = 0;
      let num = val.num ? val.num : 0;
      if (hasReplace) {
        sum = ((val.dwjz - val.dwjz / (1 + val.gszzl * 0.01)) * num).toFixed(2);
      } else {
        if (val.gsz) {
          sum = ((val.gsz - val.dwjz) * num).toFixed(2);
        }
      }
      return sum;
    },
    calculateCost(val) {
      if (val.cost) {
        let sum = ((val.dwjz - val.cost) * val.num).toFixed(2);
        return sum;
      } else {
        return 0;
      }
    },
    calculateCostRate(val) {
      if (val.cost && val.cost != 0) {
        let sum = (((val.dwjz - val.cost) / val.cost) * 100).toFixed(2);
        return sum;
      } else {
        return 0;
      }
    },
    save() {
      this.fundcode.forEach(code => {
        let val = {
          code: code,
          num: 0
        };
        this.fundListM.push(val);
      });
      chrome.storage.sync.set({ fundListM: this.fundListM }, () => {
        this.fundcode = [];
        this.getData("add");
        chrome.runtime.sendMessage({ type: "refresh" });
      });
    },
    sltInd(val) {
      let code = val.f13 + "." + val.f12;
      if (code == this.RealtimeIndcode) {
        chrome.storage.sync.set({ RealtimeIndcode: null }, () => {
          this.RealtimeIndcode = null;
          chrome.runtime.sendMessage({ type: "endInterval" });
        });
      } else {
        chrome.storage.sync.set({ RealtimeIndcode: code }, () => {
          this.RealtimeIndcode = code;
          chrome.runtime.sendMessage({ type: "refresh" });
        });
      }
    },
    slt(id) {
      if (id == this.RealtimeFundcode) {
        chrome.storage.sync.set({ RealtimeFundcode: null }, () => {
          this.RealtimeFundcode = null;
          chrome.runtime.sendMessage({ type: "endInterval" });
        });
      } else {
        chrome.storage.sync.set({ RealtimeFundcode: id }, () => {
          this.RealtimeFundcode = id;
          chrome.runtime.sendMessage({ type: "refresh" });
        });
      }
    },
    dlt(id) {
      this.fundListM = this.fundListM.filter(function(ele) {
        return ele.code != id;
      });

      if (id == this.RealtimeFundcode) {
        chrome.storage.sync.set({ RealtimeFundcode: null }, () => {
          this.RealtimeFundcode = null;
          if (this.BadgeContent == 1) {
            chrome.runtime.sendMessage({ type: "endInterval" });
          }
        });
      }
      chrome.storage.sync.set({ fundListM: this.fundListM }, () => {
        this.dataList = this.dataList.filter(function(ele) {
          return ele.fundcode != id;
        });
        if (this.BadgeContent == 2) {
          chrome.runtime.sendMessage({ type: "refresh" });
        }
      });
    },
    dltGroupFund(id, name) {
      let groupingArr = this.groupingArr2[name];
      if (groupingArr != null) {
        groupingArr.value = groupingArr.value.filter(item => item !== id);
        this.groupingArr2[name] = groupingArr;
        chrome.storage.sync.set({ groupingArr2: this.groupingArr2 }, () => {
          this.refresh();
        });
      }
    },
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = "move";
    },
    handleDragEnd(e, item) {
      this.dragging = null;
      if (item.fundcode) {
        chrome.storage.sync.set({ fundListM: this.fundListM }, () => {});
      } else if (item.f12) {
        chrome.storage.sync.set({ seciList: this.seciList }, () => {});
      }
    },
    handleDragEnter(e, item, index) {
      // 基金排序
      if (this.dragging && this.dragging.fundcode && item.fundcode) {
        e.dataTransfer.effectAllowed = "move";
        if (item.fundcode === this.dragging.fundcode) {
          return;
        }
        const newItems = [...this.fundListM];
        const src = newItems.findIndex(n => n.code == this.dragging.fundcode);
        const dst = newItems.findIndex(n => n.code == item.fundcode);
        // // 替换
        newItems.splice(dst, 0, ...newItems.splice(src, 1));

        this.fundListM = newItems;

        //数据列表也同步更新
        const newDataItems = [...this.dataList];
        const dataSrc = newDataItems.findIndex(
          n => n.fundcode == this.dragging.fundcode
        );
        const dataDst = newDataItems.findIndex(
          n => n.fundcode == item.fundcode
        );
        newDataItems.splice(dataDst, 0, ...newDataItems.splice(dataSrc, 1));
        this.dataList = newDataItems;
      } else if (this.dragging && this.dragging.f12 && item.f12) {
        e.dataTransfer.effectAllowed = "move";
        if (item.f12 === this.dragging.f12) {
          return;
        }
        const newIndItems = [...this.seciList];
        const indSrc = newIndItems.findIndex(
          n => n.split(".")[1] == this.dragging.f12
        );
        const indDst = newIndItems.findIndex(n => n.split(".")[1] == item.f12);
        newIndItems.splice(indDst, 0, ...newIndItems.splice(indSrc, 1));
        this.seciList = newIndItems;

        const newIndDataItems = [...this.indFundData];
        const indDataSrc = newIndDataItems.findIndex(
          n => n.f12 == this.dragging.f12
        );
        const indDataDst = newIndDataItems.findIndex(n => n.f12 == item.f12);
        newIndDataItems.splice(
          indDataDst,
          0,
          ...newIndDataItems.splice(indDataSrc, 1)
        );
        this.indFundData = newIndDataItems;
      }
    },
    exponent: function() {
      this.$nextTick(function() {
        let exponent = this.$refs.exponent;
        let offsetWidth = exponent[0].$el.offsetWidth;
        let exponentIcon = this.$refs.exponentIcon;
        let exponentVal = this.$refs.exponentVal;
        if (offsetWidth < 120) {
          for (let i = 0; i < exponentIcon.length; i++) {
            exponentIcon[i].$el.style.display = "none";
            exponentVal[i].$el.style.width = "100%";
          }
        } else {
          for (let i = 0; i < exponentIcon.length; i++) {
            exponentIcon[i].$el.style.display = "block";
            exponentVal[i].$el.style.width = "";
          }
        }
      });
    },
    dragEnd(e) {
      this.$refs.menuDrag.style.bottom =
        this.$refs.posmask.clientHeight - e.clientY - 30 + "px";
      this.$refs.menuDrag.style.right =
        this.$refs.posmask.clientWidth - e.clientX - 30 + "px";
    },
    showmenu() {
      let inputRowDisplay = this.$refs.optionButton.style.display;
      if (inputRowDisplay === "none") {
        this.$refs.displayRefresh.style.display = "block";
      } else if (inputRowDisplay === "block") {
        this.$refs.displayRefresh.style.display = "none";
      }
      if (this.isEdit)
        this.optionMenuClassName(
          inputRowDisplay === "none",
          this.$refs.gearDarkChange,
          "gear-dark-change"
        );
      this.optionMenuClassName(
        inputRowDisplay === "none",
        this.$refs.menuDragIconRotate,
        "menu-drag-icon-rotate"
      );
      if (this.showCost || this.showGains)
        this.optionMenuClassName(
          inputRowDisplay === "none",
          this.$refs.incomeCostGains,
          "income-cost-gains"
        );
      this.optionMenuClassName(
        inputRowDisplay === "none",
        this.$refs.optionButton,
        "menu-option"
      );
      this.optionMenuClassName(
        inputRowDisplay === "none",
        this.$refs.isEditButton,
        "is-edit"
      );
      this.optionMenuClassName(
        inputRowDisplay === "none",
        this.$refs.earningsDetailButton,
        "change-log"
      );
      this.optionMenuClassName(
        inputRowDisplay === "none",
        this.$refs.marketButton,
        "market"
      );
      if (!this.isDuringDate) {
        this.optionMenuClassName(
          inputRowDisplay === "none",
          this.$refs.closedMarketButton,
          "closed-market"
        );
      } else {
        this.optionMenuClassName(
          inputRowDisplay === "none",
          this.$refs.isLiveUpdateButton,
          "closed-market"
        );
      }
    },
    optionMenuClassName(display, el, className) {
      let elClassname = el.className;
      if (display) {
        if (elClassname.indexOf("close-" + className) >= 1)
          elClassname = elClassname.replace(
            "close-" + className,
            "open-" + className
          );
        else elClassname = elClassname + " " + "open-" + className;
        el.className = elClassname;
        el.style.display = "block";
      } else {
        if (elClassname.indexOf("open-" + className) >= 1)
          elClassname = elClassname.replace(
            "open-" + className,
            "close-" + className
          );
        else elClassname = elClassname + " " + "close-" + className;
        el.className = elClassname;
      }
    },
    handleAnimationEnd(e) {
      if (e.animationName.indexOf("close-") > -1)
        e.target.style.display = "none";
    },
    addTabPane() {
      this.groupingShow = true;
      this.$refs.groupings.init();
    },
    removeTabPane(name) {
      let groupingArr2 = this.groupingArr2[name];
      this.$confirm(
        "此操作将删除 '" + groupingArr2.label + "' 分组, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: (this.darkMode ? "darkMode " : "") + "grouping-model",
          type: "warning"
        }
      )
        .then(() => {
          if (this.groupingArr2[name] != null) {
            delete this.groupingArr2[name];
            chrome.storage.sync.set({ groupingArr2: this.groupingArr2 }, () => {
              this.refresh();
              this.activeName = "first";
            });
          }
        })
        .catch(() => {
          console.info(this.groupingArr2[name]);
          // this.$message({type: 'info', message: '已取消删除'});
        });
    },
    editTabPane(val) {
      this.groupingShow = true;
      this.$refs.groupings.init(val);
    },
    closeGroupings(val) {
      if (val) this.activeName = "first";
      this.groupingShow = false;
    },
    openEarningsDetail() {
      this.earningsDetailShow = true;
      this.$refs.earningsDetail.init();
    },
    closeEarningsDetail() {
      // if (val) this.activeName = 'first';
      this.earningsDetailShow = false;
    },
    tableColspan() {
      this.$nextTick(function() {
        let childElementCount = this.$refs.table.rows[0].childElementCount;
        if (this.$refs.tableColspanAll !== null)
          this.$refs.tableColspanAll.colSpan = childElementCount;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  /* min-width: 400px; */
  /* min-height: 150px; */
  /* overflow-y: auto; */
  padding: 10px 7px;
  box-sizing: border-box;
  /* position: relative; */
  /* font-size: 12px; */
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.refresh {
  /* right: 10px; */
  /* width: 18px; */
  /* bottom: 12px; */
  /* cursor: pointer; */
  /* height: 23.6px; */
  /* float: right; */
  /* line-height: 23px; */
  cursor: pointer;
  position: absolute;
  background-color: white;
  border-radius: 25px;
  padding: 2px;
  border: 1px solid #dcdfe6;
  left: 10px;

  i {
    color: #409eff;
    font-size: 18px;
    /* font-weight: unset; */
  }
}

.more-height {
  /* min-height: 450px; */
}

.more-width {
  /* min-width: 785px; */
}

.changelog-container {
  min-height: 575px;
  min-width: 550px;
}

.change-incrdec-finvest-container {
  min-height: 450px;
}

.table-more-height {
  /* min-height: 160px; */
}

.table-drag {
  cursor: move;
}

.table-row {
  table-layout: fixed;
  width: 100%;
  /* max-height: 715px;*/
  /* overflow-y: auto; */
  /* margin-bottom: 10px;*/
}

.hasReplace {
  background-color: #409eff;
}

.hasReplace-tip {
  display: inline-block;
  padding: 0 2px;
  margin-right: 2px;
  border-radius: 2px;
  line-height: 12px;
  color: #409eff;
  border: 1px solid #409eff;
}

.hasReplace-tipvan {
  position: absolute;
  top: -2px;
  right: -8px;
  padding: 1px 1px;
  background-color: white;
  color: #409eff;
  border-radius: 10px;
  cursor: default;
}

table {
  margin: 0 auto;
  width: 100%;
  border-collapse: collapse;
  text-align: right;
}

.align-left {
  text-align: left;
}

.center {
  text-align: center;
}

table th {
  padding: 10px 3px 10px;
  background-color: white;
  white-space: nowrap;
}

table td {
  padding: 6px 3px 5px;
}

thead tr {
  box-shadow: 0px 4px 4px 0px #c0c4cc;
  border-top-left-radius: 5px;
  /* border-top: 1px solid #c0c4cc; */
  border-top-right-radius: 5px;
  position: sticky;
  z-index: 1;
  top: 0;
}

.up {
  color: #f56c6c;
  font-weight: bold;
}

.down {
  color: #4eb61b;
  font-weight: bold;
}

tbody tr:hover {
  background: #f5fafe;
}

.btn {
  display: inline-block;
  line-height: 1;
  cursor: pointer;
  background: #fff;
  padding: 5px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #000000;
  margin: 0 3px;
  outline: none;
  border: 1px solid #dcdfe6;
}

.btn.edit {
  padding: 2px 5px;
  margin: 0;
}

.btn.red {
  color: #f56c6c;
}

.btn.num {
  width: 60px;
  padding: 3px 6px;
}

.btn-up {
  color: #f56c6c;
  border-color: #f56c6c;
  font-weight: bold;
}

.btn-down {
  color: #4eb61b;
  border-color: #4eb61b;
  font-weight: bold;
}

.slt {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.input-row {
  /* text-align: center; */
  /* margin-top: 10px; */
  /* margin-bottom: 10px; */
  position: absolute;
  top: -25px;

  .btn {
    position: absolute;
  }
}

.gear-input-row {
  .slider-title {
    margin-left: 5px;
    width: 10px;
    margin-right: 5px;
  }

  .slider {
    /deep/ .el-slider__runway {
      margin: 0 5px;
    }
  }

  .switch {
    display: block;

    /deep/ .el-switch__label--left {
      margin-right: 0;
      margin-bottom: 10px;
    }

    /deep/ .el-switch__label--right {
      margin-left: 0;
      margin-top: 10px;
    }

    /deep/ .el-switch__core {
      transform: rotate(90deg);
      left: -1px;
    }
  }
}

.tab-col {
  flex: 1;
  margin: 0 2.5px;
  /* min-width: 130px; */
  /* text-align: center; */
  /* border-right: 1px solid #c0c4cc; */
  /* border-left: 1px solid #c0c4cc; */
  /* border-top: 1px solid #ebeef5; */
  /* border-bottom: 1px solid #f5f7fa; */
  /* box-shadow: 0 0 10px 0 #c0c4cc; */
  /* border-radius: 5px; */

  h5 {
    margin: 4px 0;
    font-size: 12px;

    .dltBtn {
      margin-left: 3px;
    }
  }

  p {
    margin: 4px 0;
    min-width: 86px;
  }

  .addSeci {
    //margin: 18.3px 0;
    text-align: center;
    /* width: 40px; */
    /* height: 39px; */
    cursor: pointer;
    margin-top: 20px;
    /* line-height: 40px; */
    /* border: 1px solid #dcdfe6; */
    /* border-radius: 50%;*/
  }
}

.gear-input-row,
.searchFunds,
.showAddSeci,
.indFund {
  cursor: pointer;

  /deep/ .el-card {
    overflow: unset;
    /* height: 100%; */
  }

  /deep/ .el-card__header {
    padding: 10px 12px;
  }

  /deep/ .el-card__body {
    padding: 5px 5px;
    /* height: 100%; */
    text-align: center;
  }
}

.tab-row:after,
.tab-row:before {
  display: table;
  content: "";
}

.tab-row:after {
  clear: both;
}

.tab-row {
  padding: 5px 3px;
  display: flex;
  margin: 0 -5px;
  flex-wrap: wrap;
}

.primary {
  color: #409eff;
  border-color: #409eff;
}

.tips {
  font-size: 12px;
  margin: 0;
  color: #aaaaaa;
  line-height: 1.4;
  /* padding: 5px 15px; */
}

.fundName {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

.fundName-noclick {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fundName:hover {
  color: #409eff;
}

.down-arrow {
  display: inline-block;
  position: relative;
  width: 8px;
  height: 0;
}

.down-arrow::after {
  display: inline-block;
  content: " ";
  height: 6px;
  width: 6px;
  border-width: 0 1px 1px 0;
  border-color: #666;
  border-style: solid;
  transform-origin: center;
  transition: all 0.3s;
  position: absolute;
  right: 0;
}

.down-arrow.desc::after {
  transform-origin: center;
  transform: rotate(45deg);
  top: -10px;
}

.down-arrow.asc::after {
  transform-origin: center;
  transform: rotate(-135deg);
  top: -6px;
}

.down-arrow.none {
  display: none;
}

.pointer {
  cursor: pointer;
  user-select: none;
  min-width: 60px;
}

.detail-container {
  min-height: 450px;
  min-width: 610px;
}

.detailTable {
  th,
  td {
    p {
      margin: 2px 0;
      color: rgba($color: #000000, $alpha: 0.6);
    }
  }
}

/deep/ .el-switch__label > span {
  font-size: 12px !important;
}

.menu-drag {
  width: 50px;
  height: 50px;

  background-color: white;
  border-radius: 50%;
  border: 1px solid #c0c4cc;
  box-shadow: 0 0 2px 0 #c0c4cc;
  padding: 5px;
  transform: rotate(180deg);
}

/deep/ .el-badge__content {
  height: 10px;
  line-height: 11px;
  padding: 2px 4px;
  background-color: #fff;
}

.el-content-primary {
  /deep/ .el-badge__content--primary {
    color: #409eff;
    border: 1px solid #409eff;
  }
}

.el-content-success {
  /deep/ .el-badge__content--success {
    color: #67c23a;
    border: 1px solid #67c23a;
  }

  /deep/ .el-tag--success {
    border: 1px solid #67c23a;
    background-color: white;
    font-weight: bold;
    height: 22px;
  }
}

.el-content-danger {
  /deep/ .el-badge__content--danger {
    color: #f56c6c;
    border: 1px solid #f56c6c;
  }

  /deep/ .el-tag--danger {
    border: 1px solid #f56c6c;
    background-color: white;
    font-weight: bold;
    height: 22px;
  }
}

.table-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.active-funds-tabs {
  /deep/ .el-tabs__content {
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
  }

  /deep/ .el-tabs__item {
    height: 30px;
    line-height: 30px;
    font-size: 10px;
    padding: 0 10px;
  }

  /deep/ .el-tabs__nav-next,
  /deep/ .el-tabs__nav-prev {
    line-height: 30px;
  }

  /deep/ .el-tabs__header {
    margin: 0;
  }

  /deep/ .el-tabs__content {
    overflow: unset;
  }

  /deep/ .el-tabs__new-tab {
    height: 20px;
    width: 20px;
    line-height: 20px;
    margin: 5px 0 0 10px;
  }
}

.el-tabs--card
  > .el-tabs__header
  .el-tabs__item.is-active.is-closable
  .edit-tabs {
  width: 14px;
}

.el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover .edit-tabs {
  width: 14px;
}

.el-tabs__item .edit-tabs:hover {
  background-color: #c0c4cc;
  color: #fff;
}

.edit-tabs {
  position: relative;
  font-size: 12px;
  width: 0;
  height: 14px;
  vertical-align: middle;
  line-height: 15px;
  overflow: hidden;
  top: -1px;
  right: -2px;
  -webkit-transform-origin: 100% 50%;
  transform-origin: 100% 50%;
  border-radius: 50%;
  text-align: center;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  margin-left: 5px;
}

@import "css/keyframes.scss";
@import "css/normalFontSize.scss";
@import "css/darkMode.scss";
</style>
