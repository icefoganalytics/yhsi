<template>
  <v-card>
    <div
      class="center-children"
      style="height: 450px"
    >
      <v-img
        height="200"
        width="200"
        :src="addPhotoImageUrl"
        :lazy-src="addPhotoImageUrl"
      ></v-img>
    </div>

    <v-divider></v-divider>

    <v-row>
      <v-col cols="12">
        <p class="text-center font-weight-bold pt-3">
          Once you upload your new item data you will be able to attach photos
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import addPhotoImageUrl from "@/assets/add_photo.png"

export default {
  name: "EmptyPhotosCard",
  data: () => ({
    addPhotoImageUrl,
  }),
}
</script>

<style scoped>
.center-children {
  display: grid;
  place-items: center;
}
</style>
