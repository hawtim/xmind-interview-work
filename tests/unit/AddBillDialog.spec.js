import Vuex from 'vuex'
import ElementUI from 'element-ui'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import AddBillDialog from '@/components/AddBillDialog.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)

// 移除版本api更新的警告
localVue.config.silent = true

describe('AddBillDialog.vue', () => {
  let getters
  let store

  beforeEach(() => {
    getters = {
      category: () => [
        { id: '1bcddudhmh', type: 0, name: '车贷' },
        { id: 'hc5g66kviq', type: 0, name: '车辆保养' },
        { id: '8s0p77c323', type: 0, name: '房贷' }
      ]
    }

    store = new Vuex.Store({
      getters
    })
  })

  it('create component correctly', () => {
    const wrapper = shallowMount(AddBillDialog, {
      propsData: {
        show: true
      },
      store,
      localVue
    })
    // 浅挂载会将标签加上 -stub 后缀
    expect(wrapper.find('el-dialog-stub').attributes('title')).toEqual(
      '添加账单'
    )
  })

  it('is visible with props property show is true', () => {
    const wrapper = shallowMount(AddBillDialog, {
      propsData: {
        show: true
      },
      store,
      localVue
    })
    expect(wrapper.vm.show).toBe(true)
  })

  it('is invisible with props property show is false', () => {
    const wrapper = shallowMount(AddBillDialog, {
      propsData: {
        show: false
      },
      store,
      localVue
    })
    expect(wrapper.vm.show).toBe(false)
  })
  it('renders the correct markup', () => {
    const wrapper = shallowMount(AddBillDialog, {
      propsData: {
        show: true
      },
      store,
      localVue
    })
    expect(wrapper.html()).toContain('车贷')
  })
})
