<template>
  <cc-solo-dialog
    id="image-selector-dialog"
    ref="dialog"
    fullscreen
    no-confirm
    title="Select Image"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <div class="heading h3 ml-n2">AVAILABLE IMAGES</div>
          <mech-image-selector
            v-if="type === 'mech'"
            :mech="item"
            @set-img="selectedImage = $event"
          />
          <pilot-image-selector
            v-if="type === 'pilot'"
            :pilot="item"
            @set-img="selectedImage = $event"
          />
          <v-divider class="mx-3" />
          <div class="heading h3 ml-n2">UPLOAD IMAGE</div>
          <v-file-input
            ref="fileInput"
            class="px-6 mt-2"
            accept="image/*"
            dense
            outlined
            placeholder="Select Image"
            prepend-icon="mdi-file-upload-outline"
            :disabled="loading"
            @change="onChange"
          />
          <div>
            <i>10MB maximum file size. PNG files over 5MB will be converted to JPEGs.</i>
          </div>
        </v-col>
        <v-col>
          <div class="text-center">
            <v-img
              :src="displayImage"
              contain
              max-width="500px"
              max-height="500px"
              class="ml-auto mr-auto"
              :style="`image-rendering: ${isPixel ? 'pixelated' : 'crisp-edges'};`"
            />
            <cc-btn
              color="secondary"
              :disabled="!selectedImage && (!imageData || loading)"
              @click="saveImage()"
            >
              <template v-if="!loading">
                Set Image
              </template>
              <template v-else>
                <v-progress-circular size="25" width="3" indeterminate />
              </template>
            </cc-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import path from 'path'
import imgur from '../../../io/apis/imgur'
import MechImageSelector from './components/_MechImageSelector.vue'
import PilotImageSelector from './components/_PilotImageSelector.vue'

export default Vue.extend({
  name: 'web-image-selector',
  components: { MechImageSelector, PilotImageSelector },
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selectedImage: null,
    imageData: null,
    loading: false,
  }),
  computed: {
    displayImage() {
      if (this.selectedImage) return this.selectedImage
      if (this.imageData) return `data:image/png;base64,${this.imageData}`
      else if (this.item.Portrait) return this.item.Portrait
      else return 'https://via.placeholder.com/550'
    },
    isPixel() {
      return this.selectedImage && path.basename(this.selectedImage).includes('_pixel')
    },
  },
  methods: {
    onChange(file: File | null) {
      if (!file) {
        this.imageData = null
        return
      }
      this.selectedImage = null
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () => {
          // get base64 without url headers for imgur
          this.imageData = btoa(reader.result as string)
        },
        false
      )
      reader.readAsBinaryString(file)
    },
    async saveImage() {
      if (this.selectedImage && this.validURL(this.selectedImage)) {
        this.item.SetCloudImage(this.selectedImage)
        this.close()
      } else if (this.selectedImage) {
        this.item.SetCloudImage(null)
        this.item.SetLocalImage(path.basename(this.selectedImage))
        this.close()
      } else {
        this.loading = true
        this.selectedImage = null
        const link = await imgur.uploadImage(this.imageData)
        try {
          this.item.SetCloudImage(link)
          this.$emit('notify', 'Cloud Upload Successful')
        } catch (err) {
          this.$emit('notify', `Error Uploading to Cloud:<br>${err.message}`)
        }
        this.close()
        this.$refs.fileInput.value = null
        this.loading = false
        this.imageData = null
      }
    },
    // Pulled from Stackoverflow: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    validURL(str: string): boolean {
      const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(str);
    },
    open() {
      this.$refs.dialog.show()
    },
    close() {
      this.$refs.dialog.hide()
    },
  },
})
</script>
