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
            :key="subSection.name"
            class="ml-4"
            link
            nav
            :title="subSection.name"
            :to="subSection.makeUrl(currentId)"
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
          :key="section.name"
          link
          nav
          :title="section.name"
          :to="section.makeUrl(currentId)"
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

import store from "@/store"

const SECTIONS = [
  {
    name: "Sites",
    group: "/sites",
    sections: [
      {
        name: "Summary",
        icon: "mdi-note-text-outline",
        makeUrl: (id) => `/sites/${id}#summary`,
      },
      {
        name: "Location",
        icon: "mdi-map-check",
        makeUrl: (id) => `/sites/${id}#location`,
      },
      {
        name: "Dates & Condition",
        icon: "mdi-calendar-range",
        makeUrl: (id) => `/sites/${id}#dates-and-condition`,
      },
      {
        name: "Themes & Function",
        icon: "mdi-shape",
        makeUrl: (id) => `/sites/${id}#themes-and-function`,
      },
      {
        name: "Associations",
        icon: "mdi-account-group",
        makeUrl: (id) => `/sites/${id}#associations`,
      },
      {
        name: "Legal & Zoning",
        icon: "mdi-script-text-outline",
        makeUrl: (id) => `/sites/${id}#legal-and-zoning`,
      },
      {
        name: "Photos (combined)",
        icon: "mdi-image",
        makeUrl: (id) => `/sites/${id}#photos`,
      },
      {
        name: "Management",
        icon: "mdi-hammer-wrench",
        makeUrl: (id) => `/sites/${id}#management`,
      },
      {
        name: "Description",
        icon: "mdi-alphabetical",
        makeUrl: (id) => `/sites/${id}#description`,
      },
    ],
  },
]

export default {
  name: "AppSidebar",
  data() {
    return {
      currentId: 0,
    }
  },
  computed: {
    ...mapGetters(["showAppSidebar"]),
    sections: () => SECTIONS,
  },
  watch: {
    "$route.path"(value) {
      this.setShowAppSidebar(value)
    },
  },
  async mounted() {
    await this.setShowAppSidebar(this.$route.path)
    this.currentId = this.$route.params.id
  },
  methods: {
    setShowAppSidebar(path) {
      if (path.startsWith("/sites/")) {
        return store.dispatch("setShowAppSidebar", true)
      }

      return store.dispatch("setShowAppSidebar", false)
    },
  },
}
</script>
