<template lang="html">
  <div class="">
    <el-input
      type="password"
      v-model="password"
      auto-complete="off"
      v-popover:popover
      >
    </el-input>
    <el-popover
      ref="popover"
      placement="right"
      width="400"
      v-model="visible"
      >
      <h2>强度：{{strengthClasses[score].strength}}</h2>
      <el-progress :percentage="strengthClasses[score].percentage" :color="progressColor[score]"></el-progress>
      <p>请至少输入 6 个字符。请不要使用容易被猜到的密码。</p>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import passwordStrength from 'zxcvbn'

@Component
export default class Password extends Vue {
  // @Prop() value: string
  password: string = ''
  visible: boolean = false
  score: number = 0
  progressColor: any = [
    '#f56c6c',
    '#f56c6c',
    '#e6a23c',
    '#67c23a',
    '#67c23a'
  ]
  strengthClasses: any = [
    {
      strength: 'very-weak',
      percentage: 20
    },
    {
      strength: 'weak',
      percentage: 40
    },
    {
      strength: 'medium',
      percentage: 60
    },
    {
      strength: 'good',
      percentage: 80
    },
    {
      strength: 'great',
      percentage: 100
    }
  ]
  @Watch('password', { immediate: true, deep: true })
  onPasswordChanged(val: string, oldVal: string) {
    const obj = passwordStrength(val)
    this.score = obj.score
    this.$emit('listenToChildEvent', val)
  }
}
</script>

<style lang="css" scoped>

</style>
