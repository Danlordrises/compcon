<template>
  <div
    :class="this.$vuetify.breakpoint.smAndDown ? 'pt-1' : `px-2 pt-2 pb-1 ml-n3 clipped${size}`"
    :style="`width: max-content; background-color: ${getColor()};`"
  >
    <span
      :class="`${this.$vuetify.breakpoint.smAndDown ? 'px-2' : 'pl-5 pr-5 pb-1'} ctitle${size} ${
        dark ? 'white--text' : 'stark--text'
      }`"
    >
      <slot />
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import GetColorMixin from '@/mixins/getColor'

@Component({ name: 'cc-title' })
export default class CCTitle extends Mixins(GetColorMixin) {
  @Prop({ type: Boolean, required: false })
  readonly large?: boolean

  @Prop({ type: Boolean, required: false })
  readonly small?: boolean

  @Prop({ type: Boolean, required: false, default: true })
  readonly dark: boolean

  @Prop({ type: String, required: false, default: 'primary' })
  readonly color: string

  get size() {
    if (this.$vuetify.breakpoint.smAndDown) return '-small'
    return this.large ? '-large' : this.small ? '-small' : ''
  }
}
</script>

<style scoped>
.ctitle-small {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 16pt;
  line-height: 15pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}

.ctitle {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 30pt;
  line-height: 25pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}

.ctitle-large {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 50pt;
  line-height: 38pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}
</style>
