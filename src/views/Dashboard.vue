<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-card shadow="hover" class="mgb20" style="height: 350px">
          <div class="user-info">
            <img src="../assets/img/img.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.userToday }}</div>
                  <div>今日新增用户数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.rechargeToday }}</div>
                  <div>今日充值金额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.rechargeNumberToday }}</div>
                  <div>今日充值人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.withdrawToday }}</div>
                  <div>今日提现金额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.userYesterday }}</div>
                  <div>昨日新增用户数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.rechargeYesterday }}</div>
                  <div>昨日充值金额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.rechargeNumberYesterday }}</div>
                  <div>昨日充值人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.withdrawYesterday }}</div>
                  <div>昨日提现金额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.userAll }}</div>
                  <div>用户总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.rechargeAll }}</div>
                  <div>总充值金额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.rechargeNumberAll }}</div>
                  <div>总充值人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-top: 10px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ data.withdrawAll }}</div>
                  <div>总提现金额</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Schart from "vue-schart";
import { reactive } from "vue";
import { Server } from "../api/admin";

export default {
  name: "dashboard",
  components: { Schart },
  setup() {
    const ser = new Server();
    const name = localStorage.getItem("ms_username");
    const role = name === "admin" ? "超级管理员" : "普通用户";
    const data = reactive({
      userToday: 0,
      userAll: 0,
      rechargeToday: 0,
      rechargeAll: 0,
      withdrawToday: 0,
      withdrawAll: 0,
    });
    const getData = () => {
      ser.count().then((res) => {
        console.log(res);
        Object.keys(res.data).forEach((item) => {
          data[item] = res.data[item];
        });
      });
    };
    getData();
    return {
      name,
      role,
      data,
    };
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
