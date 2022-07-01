<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-redpacket_fill"></i> 支持作者
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <h2>
        该框架基于前端作者的
        <a href="lin-xin.gitee.io/example/work/">vue-manage-system</a>
        开发，如果你觉得该框架对你有帮助，那就请他们喝杯饮料吧！
      </h2>
      <div class="plugins-tips">前端框架作者微信号：linxin_20</div>
      <div>
        <img src="https://lin-xin.gitee.io/images/weixin.jpg" width="200" />
      </div>

      <div class="plugins-tips">后端框架作者微信号：krally</div>
      <div>
        <img src="../assets/img/weixin.png" width="200" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "donate",
};
</script>

<style>
h2 {
  margin-bottom: 20px;
}
</style>