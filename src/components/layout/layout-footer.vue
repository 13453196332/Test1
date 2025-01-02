<template>
  <!-- <div id="layout-footer">
    <div class="footer-main">
      <div class="footer-item" v-if="socials.length">
        <div v-for="item in socials" :key="item.id">
          <a target="_blank" class="out-link" :href="item.href"
            ><i class="iconfont" :class="item.icon"></i>{{ item.title }}</a
          >
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import sectionTitle from "@/components/section-title";
import wxlogin from "vue-wxlogin";
import { login, sendSms } from "@/api/login";
import { mapMutations } from "vuex";
export default {
  name: "layout-footer",
  data() {
    return {
      socials: [],
      dialogVisible: false,
      dialogVisible2: false,
      labelPosition: "top",
      form: {
        username: undefined,
        password: undefined,
        phone: undefined,
        smsCode: undefined,
      },
      countdown: 60,
      timer: "",
      isShowGetCode: true,
    };
  },
  components: {
    sectionTitle,
    wxlogin,
  },
  computed: {
    runTimeInterval() {
      return this.$store.state.runTimeInterval;
    },
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    login() {
      if (!this.checkParams()) {
        this.$message({
          showClose: true,
          message: "请确认信息是否填写",
          type: "warning",
        });
        return;
      }
      login(this.form.username, this.form.password, this.form.smsCode, this.form.phone)
        .then((res) => {
          if (res.code == 20000 && res.data != null) {
            this.$message({
              showClose: true,
              message: "恭喜登录成功",
              type: "success",
            });
            localStorage.setItem("token", res.data);
            this.dialogVisible = false;
            location.reload();
            this.$router.push("/admin/empty");
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err,
            type: "warning",
          });
        });
    },
    getSocial() {
      this.$store.dispatch("getSocials").then((data) => {
        this.socials = data;
      });
    },
    toAdmin() {
      var token = localStorage.getItem("token");
      if (token) {
        this.$router.push("/admin/empty");
      } else {
        this.dialogVisible = true;
      }
    },
    getIdentifyCode() {
      if (!this.form.phone) {
        this.$message({
          showClose: true,
          message: "请填写手机号码",
          type: "warning",
        });
        return;
      }
      if (!/^1[1-9]\d{9}$/.test(this.form.phone)) {
        this.$message({
          showClose: true,
          message: "请填写合法的手机号码",
          type: "warning",
        });
        return;
      }
      sendSms(this.form.phone).then((res) => {
        this.countDown();
        this.isShowGetCode = false;
        this.$message({
          showClose: false,
          message: res.message,
          type: "info",
        });
      });
    },
    countDown() {
      const self = this;
      this.timer = setInterval(() => {
        self.countdown--;
        if (self.countdown === 0) {
          clearInterval(self.timer);
          self.countdown = 60;
          self.isShowGetCode = true;
        }
      }, 1000);
    },
    checkParams() {
      if (
        !this.form.username ||
        !this.form.password ||
        !this.form.smsCode ||
        !this.form.phone
      ) {
        return false;
      }
      return true;
    },
  },
  created() {
    this.getSocial();
    this.$store.dispatch("initComputeTime");
  },
};
</script>

<style scoped lang="less">
#layout-footer {
  padding: 2%;
  border-top: 1px solid #f7f7f7;
  font-size: 13px;
  color: #9c9c9c;
  a.out-link:hover {
    color: #ff6d6d;
  }
  .footer-main {
    max-width: 800px;
    margin: 0 auto 20px auto;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    .footer-item {
      flex: 1;
      & > div:not(:last-child) {
        margin-bottom: 10px;
      }
      i {
        margin-right: 10px;
      }
    }
  }
  .copyright {
    text-align: center;
  }
}
/*****/
@media (max-width: 800px) {
  #layout-footer {
    .footer-main .footer-item:nth-child(3) {
      flex: 2;
    }
  }
}
@media (max-width: 600px) {
  #layout-footer {
    .footer-main {
      display: block;
      .footer-item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        & > div {
          margin-bottom: 10px;
        }
      }
    }
  }
}
/*****/
</style>
