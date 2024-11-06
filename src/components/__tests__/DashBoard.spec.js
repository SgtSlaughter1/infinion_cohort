import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DashBoard from '@/views/DashBoard.vue';

describe('DashBoard', () => {
  let wrapper;

  beforeEach(() => {
    // Mock Vuetify display object
    const mockVuetify = {
      display: {
        mdAndUp: true
      }
    }

    wrapper = mount(DashBoard, {
      global: {
        stubs: {
          'v-card': true,
          'v-layout': true,
          'v-app-bar': true,
          'v-app-bar-nav-icon': true,
          'v-text-field': true,
          'v-spacer': true,
          'v-btn': true,
          'v-icon': true,
          'v-menu': true,
          'v-list': true,
          'v-list-item': true,
          'v-navigation-drawer': true,
          'v-toolbar-title': true,
          'v-main': true
        },
        mocks: {
          $vuetify: mockVuetify
        }
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes with correct default data', () => {
    expect(wrapper.vm.drawer).toBe(false)
    expect(wrapper.vm.searchQuery).toBe('')
    expect(wrapper.vm.items).toHaveLength(5)
  })

  it('contains correct navigation items', () => {
    const items = wrapper.vm.items
    expect(items).toContainEqual(
      expect.objectContaining({ 
        title: 'New Campaign',
        route: '/newcampaign',
        icon: 'mdi-plus'
      })
    )
    expect(items).toContainEqual(
      expect.objectContaining({ 
        title: 'Overview',
        route: '/',
        icon: 'mdi-bullhorn'
      })
    )
  })

  it('computes correct search field style for desktop', () => {
    expect(wrapper.vm.searchFieldStyle).toEqual({
      marginLeft: '300px',
      maxWidth: '370px'
    })
  })

  it('computes correct search field style for mobile', () => {
    // Update mock for mobile view
    wrapper.vm.$vuetify.display.mdAndUp = false
    
    expect(wrapper.vm.searchFieldStyle).toEqual({
      marginLeft: '10px',
      maxWidth: '200px'
    })
  })

  it('has correct drawer visibility state', () => {
    expect(wrapper.vm.drawer).toBe(false)
    wrapper.vm.drawer = true
    expect(wrapper.vm.drawer).toBe(true)
  })

  it('has the expected navigation item count', () => {
    const navigationItems = wrapper.vm.items
    expect(navigationItems).toHaveLength(5)
  })

  it('has correct routes for navigation items', () => {
    const navigationItems = wrapper.vm.items
    const routes = navigationItems
      .filter(item => item.route)
      .map(item => item.route)
    
    expect(routes).toContain('/newcampaign')
    expect(routes).toContain('/')
    expect(routes).toContain('/campaign')
  })

  it('has correct icons for navigation items', () => {
    const navigationItems = wrapper.vm.items
    const icons = navigationItems.map(item => item.icon)
    
    expect(icons).toContain('mdi-plus')
    expect(icons).toContain('mdi-bullhorn')
    expect(icons).toContain('mdi-lightbulb-on-outline')
    expect(icons).toContain('mdi-cog-outline')
  })
})