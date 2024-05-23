<template>
  <div v-if="groupingShow" class="shadow">
    <el-dialog
      title="新建基金分组"
      :custom-class="darkMode ? 'groupingDia darkMode' : 'groupingDia'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :close-on-press-escape="false"
      :modal="false"
      :visible.sync="groupingShow"
      :top="0 + 'px'"
      width="100%"
      center
    >
      <div style="margin: 0 auto;width: 90%;">
        <el-form
          ref="form"
          :inline="false"
          :label-position="'top'"
          :model="groupingObj"
        >
          <el-form-item label="分组名称" class="inline_item">
            <el-input
              style="width: 150px;"
              v-model="groupingObj.label"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择基金">
            <el-transfer
              filterable
              :titles="['全部基金', groupingObj.label]"
              :filter-method="filterMethod"
              filter-placeholder="请输入基金名称"
              v-model="groupingObj.value"
              :data="groupingData"
            ></el-transfer>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="groupCreate">确 定</el-button>
        <el-button @click="close(false)">取 消</el-button>
      </span>
    </el-dialog>
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
  ElTag,
  ElTransfer,
  ElCheckboxGroup,
  ElCheckbox
} from "@/common/js/commons";
import { uuid } from "@/common/js/utils";

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
    ElTag,
    ElTransfer,
    ElCheckboxGroup,
    ElCheckbox
  },

  props: {
    top: {
      type: Number,
      default: 0
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      groupingShow: false,
      groupingArr2: [],
      groupingObj: {
        label: "新建分组1",
        name: "",
        value: []
      },
      groupingData: []
    };
  },
  mounted() {},
  methods: {
    init(val) {
      this.groupingShow = true;
      this.groupingObj.name = uuid(8, 62);
      this.groupingObj.value = [];
      this.generateData();
      chrome.storage.sync.get(["groupingArr2"], res => {
        this.groupingArr2 = res.groupingArr2 ? res.groupingArr2 : {};
        if (val != null) this.groupingObj = this.groupingArr2[val.name];
      });
    },
    generateData() {
      let data = [];
      for (let i = 0; i < this.dataList.length; i++) {
        let dataList = this.dataList[i];
        data.push({
          key: dataList.fundcode,
          label: dataList.name,
          disabled: false
        });
      }
      this.groupingData = data;
    },
    groupCreate() {
      if (this.groupingObj.value.length === 0) {
        if (this.groupingArr2[this.groupingObj.name] != null)
          delete this.groupingArr2[this.groupingObj.name];
      } else this.groupingArr2[this.groupingObj.name] = this.groupingObj;
      chrome.storage.sync.set({ groupingArr2: this.groupingArr2 });
      this.$emit("refresh", false);
      this.close(this.groupingObj.value.length === 0);
    },
    close(val) {
      this.$emit("close", val);
      this.groupingShow = false;
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1;
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

.el-dialog__wrapper {
  margin: 20px 40px;
}

.groupingDia {
  /deep/ &.el-dialog {
    margin-bottom: 15px;
    border-radius: 15px;
  }

  /deep/ &.el-dialog--center .el-dialog__header {
    border-bottom: 1px solid #eee;
    padding: 15px 20px 10px;
  }

  /deep/ &.el-dialog--center .el-dialog__footer {
    border-top: 1px solid #eee;
    padding: 10px 20px 10px;
  }

  /deep/ &.el-dialog--center .el-dialog__body {
    padding: 10px 12px;
  }
}

/deep/ .el-button + .el-button,
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}

/deep/ .el-checkbox__label {
  font-size: 12px !important;
}

.el-transfer {
  display: flex;
  align-items: center;

  /deep/ .el-transfer-panel {
    width: 100%;

    .el-transfer-panel__header {
      height: 30px;
      line-height: 30px;

      .el-checkbox {
        line-height: 30px;
      }
    }
  }

  /deep/ .el-transfer__buttons {
    padding: 0 10px;
    display: inline-grid;
  }

  /deep/ .el-transfer-panel__filter {
    margin: 5px 10px;

    .el-input__inner {
      border-radius: 5px;
      height: 25px;
    }

    .el-input__prefix,
    .el-input__suffix {
      top: -2px;
    }
  }
}

.inline_item {
  display: flex;
  margin-bottom: 0 !important;

  /deep/ .el-form-item__label {
    margin-right: 10px;
  }
}

.groupingDia.darkMode {
  /deep/ &.el-dialog {
    background-color: #373737;

    .el-dialog__header .el-dialog__title {
      color: rgba($color: #ffffff, $alpha: 0.6);
    }

    .el-dialog__body {
      color: rgba($color: #ffffff, $alpha: 0.6);
    }

    .el-form-item__label {
      color: rgba($color: #ffffff, $alpha: 0.6);
    }

    .el-transfer-panel {
      background-color: #373737;
    }

    .el-transfer-panel__header {
      background-color: #606266;

      .el-checkbox__label {
        color: rgba($color: #ffffff, $alpha: 0.6);
      }
    }

    .el-checkbox__inner {
      border: 1px solid rgba(220, 223, 230, 0.6);
      background-color: rgba(220, 223, 230, 0.1);
    }

    .el-transfer-panel__item.el-checkbox {
      color: #c0c4cc;
    }

    .el-transfer-panel__item:hover {
      color: rgba($color: #409eff, $alpha: 0.6);
    }

    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #606266;
    }

    .el-button {
      color: rgba(0, 0, 0, 0.6);
      background-color: rgba($color: #fff, $alpha: 0.6);
      border-color: rgba($color: #dcdfe6, $alpha: 0.6);
    }

    .el-button--primary {
      color: rgba(255, 255, 255, 0.6);
      background-color: rgba($color: #409eff, $alpha: 0.6);
      border-color: rgba($color: #409eff, $alpha: 0.6);
    }

    .el-button--primary.is-disabled,
    .el-button--primary.is-disabled:active,
    .el-button--primary.is-disabled:focus,
    .el-button--primary.is-disabled:hover {
      color: rgba(255, 255, 255, 0.6);
      background-color: rgba($color: #a0cfff, $alpha: 0.6);
      border-color: rgba($color: #a0cfff, $alpha: 0.6);
    }
  }

  .el-card {
    background-color: #373737;
    color: rgba($color: #ffffff, $alpha: 0.6);
  }

  .el-button--primary {
    border: 1px solid rgba($color: #409eff, $alpha: 0.6);
    background-color: rgba($color: #409eff, $alpha: 0.6);
    color: rgba($color: #ffffff, $alpha: 0.6);
  }
}
</style>
