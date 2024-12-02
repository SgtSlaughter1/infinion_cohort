<template>
  <v-card>
    <v-layout>
      <v-app-bar>
        <!-- Navigation Icon to toggle sidebar -->
        <v-app-bar-nav-icon variant="text" @click.stop="sidebarMenu = !sidebarMenu"></v-app-bar-nav-icon>

        <!-- Search Field -->
        <v-text-field v-model="searchQuery" placeholder="Search for campaign..." density="compact" variant="solo"
          append-inner-icon="mdi-magnify" single-line hide-details :style="searchFieldStyle"></v-text-field>

        <v-spacer></v-spacer>

        <!-- Bell Icon -->
        <v-btn icon variant="text">
          <v-icon class="icon-notify">mdi-bell-outline</v-icon>
        </v-btn>

        <!-- Logo and Text -->
        <img src="/image/image 16 (2).png" alt="image logo" class="photo" />
        <div class="bigtech">
          Big Tech
          <img src="/image/mdi_chevron-down (1).png" alt="chevron icon" />
        </div>

        <!-- Dots Vertical Menu with Dropdown -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props">
              <v-icon class="three-dots">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <!-- Dropdown Items -->
            <v-list-item>
              <v-icon left>mdi-bell-outline</v-icon>
              <!-- <v-list-item-title>Notifications</v-list-item-title> -->
            </v-list-item>
            <v-list-item>
              <img src="/image/image 16 (2).png" alt="logo" class="photo-dropdown" />
              <!-- <v-list-item-title>Logo</v-list-item-title> -->
            </v-list-item>
            <v-list-item>
              Big Tech
              <img src="/image/mdi_chevron-down (1).png" alt="chevron icon" class="chevron-dropdown" />
              <!-- <v-list-item-title>Chevron Icon</v-list-item-title> -->
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- Sidebar Navigation Drawer -->

      <v-navigation-drawer v-model="sidebarMenu" :location="$vuetify.display.mobile ? 'left' : undefined" temporary>
        <v-toolbar-title>
          <RouterLink to="/">
            <img src="/image/arcticons_google_messages.png" class="img1" />
            <img src="/image/Scrutz.png" class="img2" />
          </RouterLink>
        </v-toolbar-title>

        <v-list density="compact" nav>
          <NewCampBtn @click="navigate('/dashboard/new-campaign')" />
          <v-list-item v-for="(item, index) in items" :key="index" @click="navigate(item.route)"
            :class="{ 'v-list-item--active': isActive(item.route) }" link :to="item.route" class="my-2">
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title class="py-4">{{ item.title }}</v-list-item-title>
            
          </v-list-item>
        </v-list>

        <v-spacer></v-spacer>

        <!-- Bottom Content of the Drawer -->
        <div class="drawer-bottom-content bg-white text-center p-3">
          <div class="mb-2">
            <img src="/image/material-symbols_help-outline (1).png" alt="Bottom Image" class="mx-auto d-block" />
          </div>
          <div>
            <h6>Need help?</h6>
            <p class="small-text">We're readily available to provide help</p>
          </div>
          <button class="btn">Get help</button>
        </div>
      </v-navigation-drawer>

      <v-main>
        <!-- Main content goes here -->
        <RouterView />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import NewCampBtn from "../components/NewCampBtn.vue";

export default {
  components: {
    NewCampBtn,
  },

  data() {
    return {
      route: null,
      router: null,
      display: null,
      sidebarMenu: true,
      showLinks: false,
      drawer: false,
      searchQuery: "",
      items: [
        {
          title: "Overview",
          route: "/dashboard/overview",
          icon: "mdi-bullhorn",
        },
        {
          title: "Campaigns",
          route: "/dashboard/all-campaign",
          icon: "mdi-bullhorn",
        },
        {
          title: "Market Intelligence",
          route: "/dashboard/market-intelligence",
          icon: "mdi-lightbulb-on-outline",
        },
        {
          title: "Account Settings",
          route: "/dashboard/account-settings",
          icon: "mdi-cog-outline",
        },
      ],
    };
  },

  mounted() {
    this.route = this.$route;
    this.router = this.$router;
    this.display = this.$vuetify.display;
  },

  computed: {
    searchFieldStyle() {
      return {
        marginLeft: this.$vuetify.display.mdAndUp ? "300px" : "10px",
        maxWidth: this.$vuetify.display.mdAndUp ? "370px" : "200px",
      };
    },
  },

  methods: {
    isActive(path) {
      return (
        this.$route.path === path ||
        (path === "/dashboard" &&
          this.$route.path === "/dashboard/overview")
      );
    },

    navigate(path) {
      this.$router.push(path);
    },

    toggleLinks() {
      thiis.showLinks = !thiis.showLinks;
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  background-color: #f0f4f4 !important;
}

.drawer-bottom-content {
  margin: 20px;
}

.new-campaign-background {
  background-color: #247b7b;
  color: #fff;
}

.img1,
.img2 {
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.btn {
  border: 1px solid #247b7b;
  outline-color: #247b7b;
}

.btn:hover {
  background: #247b7b;
  color: #fff;
}

.v-list-item {
  margin-bottom: 20px;
  padding: 0 10px;
}

.v-menu {
  display: none;
}

.three-dots {
  display: none;
}

.photo {
  margin-right: 10px;
}

@media screen and (min-width: 320px) and (max-width: 425px) {
  .photo {
    width: 20px;
  }

  .icon-bell {
    width: 10px;
  }

  .v-menu {
    display: block;
  }

  .three-dots {
    display: block;
  }

  .icon-notify,
  .photo,
  .bigtech {
    display: none;
  }

  .v-text-field {
    width: 100%;
    margin-right: -50px;
  }
}
</style>
