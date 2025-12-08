import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import App from '../src/ts/components/App.vue'

type AppInstance = InstanceType<typeof App>

describe("App", () => {
  let wrapper: VueWrapper<AppInstance>

  const factory = (options: {
    props?: Record<string, unknown>
    slots?: Record<string, string>
  } = {}) => {
    const { props = {}, slots = {} } = options

    return mount(App, {
      props,
      slots,
    })
  }

  beforeEach(() => {
    wrapper = factory()
  })

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true)
  })

 
})
