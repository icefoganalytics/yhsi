<template>
  <v-navigation-drawer
    v-show="showAppSidebar"
    permanent
    :app="showAppSidebar"
    clipped
    color="#f1f1f1"
  >
    <v-list dense nav style="" class="mt-4">
      <template v-for="section in sections">
        <v-list-group
          v-if="section.sections"
          :key="section.name"
          :group="section.group"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ section.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="subSection in section.sections"
            class="ml-4"
            link
            nav
            :title="subSection.name"
            :to="subSection.makeUrl(currentId)"
            :key="subSection.name"
          >
            <v-list-item-icon>
              <v-icon>{{ subSection.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ subSection.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-else
          link
          nav
          :title="section.name"
          :to="section.makeUrl(currentId)"
          :key="section.name"
        >
          <v-list-item-icon>
            <v-icon>{{ section.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ section.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex"

import * as config from "@/config"
import store from "@/store"

export default {
  name: "AppSidebar",
  computed: {
    ...mapGetters(["showAppSidebar"]),
  },
  data() {
    return {
      hasSidebarClosable: config.hasSidebarClosable,
      sections: config.sections,
      currentId: 0,
    }
  },
  async mounted() {
    await store.dispatch("checkAuthentication")
    await this.setShowAppSidebar(this.$route.path)
    this.currentId = this.$route.params.id
  },
  watch: {
    "$route.path"(value) {
      this.setShowAppSidebar(value)
    },
  },
  methods: {
    setShowAppSidebar(path) {
      console.log("path", path)
      if (path.startsWith("/sites/")) {
        return store.dispatch("setShowAppSidebar", true)
      }

      return store.dispatch("setShowAppSidebar", false)
    },
  },
}
</script>
