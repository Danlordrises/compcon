<template>
  <cc-stepper-content
    :complete="canContinue"
    :mandatory="!quickstart"
    exit="pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Pilot Talents&emsp;</cc-title>
    <div v-show="$vuetify.breakpoint.mdAndUp">
      <h2 class="heading">
        UAD IDENT Service
        <cc-slashes />
        &nbsp;RM-4c Pilot Self Assessment (2/3)
      </h2>
      <div style="position: absolute; right: 16px; top: 16px">
        <cc-tooltip simple content="Feature In Development">
          <v-btn small outlined disabled>Suggest Talents</v-btn>
        </cc-tooltip>
      </div>
      <v-container class="flavor-text" style="font-size: 14px">
        <div class="mt-n2">
          The RM-4b PILOT SELF ASSESSMENT (Talents) audit catalogs an individual pilot's
          self-reported combat operation aptitudes and confers requisition privileges for simulator
          time, holofield and cortical sensorium training materials, battlefield telemetry data at
          classifications below GREY SIERRA SHARP, and (in specific cases) GMS MM-pattern materiel
          licenses. Additional resources may be made available at your request in the course of
          field operations.
        </div>
        <v-alert type="warning" color="accent" outlined class="mt-2" dense prominent>
          <b>Select three (3) Pilot Talents.</b>
          <br />
          <div class="overline" style="line-height: 13px">
            By submitting this form you attest that your responses are truthful and accurate to the
            best of your knowledge. Knowingly providing false or or incomplete information is
            punishable under DoJ/HR AR 303-J.
          </div>
        </v-alert>
      </v-container>
    </div>
    <cc-talent-selector level-up :pilot="pilot" />
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'talents-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    quickstart: { type: Boolean },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.IsMissingTalents
    },
  },
})
</script>
