<template>
  <v-app>
    <v-navigation-drawer app clipped v-model="navdraw">
      <v-list>
        <v-list-item v-for="item in drawerItems" :key="item.title" :to="item.link" link>
          <v-list-item-icon v-if="item.icon">
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar clipped-left app color="primary" hide-on-scroll>
      <v-app-bar-nav-icon @click="navdraw = !navdraw"></v-app-bar-nav-icon>
      <v-spacer v-if="this.$vuetify.breakpoint.smAndDown"></v-spacer>
      <router-link to="/">
        <v-toolbar-title class="title">UNSRINLP</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn icon @click="switchTheme">
        <v-icon>{{ (this.$vuetify.theme.dark)? 'mdi-lightbulb-outline' : 'mdi-lightbulb-on-outline' }}</v-icon>
      </v-btn>
      <v-btn text to="/api" v-if="this.$vuetify.breakpoint.mdAndUp">API</v-btn>
      <v-btn text to="/api" v-if="this.$vuetify.breakpoint.mdAndUp">Documentation</v-btn>
      <v-btn text to="/api" v-if="this.$vuetify.breakpoint.mdAndUp">FAQ</v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      navdraw: this.$vuetify.breakpoint.smAndDown ? false : true,
      drawerItems: [
        {
          title: "Tokenizer",
          link: "/app/tokenizer",
          icon: null
        },
        {
          title: "Stemmer",
          link: "/app/stemmer",
          icon: null
        },
        {
          title: "Text Summarizer",
          link: "/app/summarizer",
          icon: null
        }
      ]
    };
  },
  methods: {
    switchTheme() {
      let theme = this.$cookies.get("theme") == "light" ? "dark" : "light";
      this.$cookies.set("theme", theme);
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  },
  beforeMount() {
    if (!this.$cookies.isKey("theme")) {
      this.$cookies.set("theme", "light");
    }
    let theme = this.$cookies.get("theme");
    this.$vuetify.theme.dark = theme == "dark" ? true : false;
  },
  mounted() {
    console.log(this);
  }
};
</script>

<style>
#app {
  font-family: "Montserrat", sans-serif;
}
.v-toolbar__content a {
  color: inherit !important;
  text-decoration: none !important;
}
</style>