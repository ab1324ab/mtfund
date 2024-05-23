<template>
  <div v-if="centerDialogVisible" class="shadow">
    <el-dialog
      title="收益明细"
      :custom-class="darkMode ? 'changelog darkMode' : 'changelog'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :close-on-press-escape="false"
      :modal="false"
      :visible.sync="centerDialogVisible"
      :top="top + 'px'"
      width="90%"
      center
    >
      <div v-if="netError" class="btn-row">
        网络不好？
        <el-button type="primary" @click="goGitee">去官网查看</el-button>
      </div>
      <div
        class="content"
        v-show="!netError"
        v-loading="loading"
        :element-loading-background="
          darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'
        "
      >
        <p v-if="changelog.tip">{{ changelog.tip }}</p>
        <div v-if="changelog.htmlTip" v-html="changelog.htmlTip"></div>
        <ul>
          <li v-for="el in changelog.list" :key="el.version">
            <h5>
              v{{ el.version }}
              <span class="btn red" v-if="localVersion == el.version"
                >当前版本</span
              >
              <span class="btn primary" v-if="el.type == 2">重要更新</span>
            </h5>
            <ul>
              <li
                :class="i.type == 2 ? 'major' : ''"
                v-for="(i, ind) in el.content"
                :key="ind"
              >
                {{ i.content }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var json = require("./changeLog.json");
const { version } = require("../../package.json");

export default {
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
      updateurl: {
        github: "",
        gitee: ""
      },
      centerDialogVisible: false,
      qrcode: false,
      changelog: {},
      loading: true,
      netError: false,
      localVersion: version
    };
  },
  mounted() {},
  methods: {
    goGitee() {
      window.open("");
    },
    getChangelog() {
      this.loading = false;
      this.qrlink = json.qrcode;
      this.changelog = json;
    },
    init() {
      this.centerDialogVisible = true;
      this.getChangelog();
    },
    close() {
      this.centerDialogVisible = false;
      this.$emit("close", false);
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
.changelog {
  /deep/ &.el-dialog {
    max-width: 450px;
    margin-bottom: 15px;
    border-radius: 15px;
  }

  .btn-row {
    text-align: center;
    padding: 30px 0;
  }

  .content {
    height: 400px;

    p {
      text-align: center;
      margin: 0;
      padding: 2px 0;
    }

    overflow-y: auto;

    ul {
      padding-left: 22px;
      margin: 5px 0;

      li {
        padding: 3px 0;

        .major {
          font-weight: bold;
        }

        h5 {
          margin: 10px 0;
          font-size: 15px;
          font-weight: bold;
        }
      }
    }

    .btn {
      display: inline-block;
      line-height: 1;
      background: #fff;
      padding: 4px 6px;
      border-radius: 3px;
      font-size: 12px;
      color: #000000;
      margin: 0 3px;
      outline: none;
      border: 1px solid #dcdfe6;
    }

    .primary {
      color: #409eff;
      border-color: #409eff;
    }
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

.changelog.darkMode {
  /deep/ &.el-dialog {
    background-color: #373737;

    .el-dialog__header .el-dialog__title {
      color: rgba($color: #ffffff, $alpha: 0.6);
    }

    .el-dialog__body {
      color: rgba($color: #ffffff, $alpha: 0.6);
    }
  }

  .btn {
    background-color: rgba($color: #ffffff, $alpha: 0.16);
    color: rgba($color: #ffffff, $alpha: 0.6);
    border: 1px solid rgba($color: #ffffff, $alpha: 0.6);
  }

  .btn.red {
    border: 1px solid rgba($color: #f56c6c, $alpha: 0.6);
    background-color: rgba($color: #f56c6c, $alpha: 0.6);
  }

  .primary {
    border: 1px solid rgba($color: #409eff, $alpha: 0.6);
    background-color: rgba($color: #409eff, $alpha: 0.6);
  }

  .el-button--primary {
    border: 1px solid rgba($color: #409eff, $alpha: 0.6);
    background-color: rgba($color: #409eff, $alpha: 0.6);
    color: rgba($color: #ffffff, $alpha: 0.6);
  }
}
</style>
