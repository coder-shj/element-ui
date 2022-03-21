<template>
  <div>
    <span class="total">用户来源</span>
    <div id="main" style="width:80%;height:500px;margin-top:100px;margin-left:50px"></div>
  </div>
</template>

<script>
// npm install echarts@4.9.0 --save
import ECharts from 'echarts'
export default {
  name: 'reports',
  data() {
    return {
      option:{}
    }
  },
  mounted(){
    var myChart = ECharts.init(document.getElementById('main'));
    this.$http.get('reports/type/1').then(res=>{
      if(res.data.meta.status!==200) return this.$message.error('获取报表失败')
      this.option=res.data.data;
      // 使用指定的配置项和数据显示图表
      myChart.setOption(this.option);
    })
  }
}
</script>

<style>
.total{
  font-size: 25px;
  float: left;
  margin-left: 100px;
}
</style>