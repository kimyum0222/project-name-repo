import {
  Calendar,
  CustomRenderingStore
} from "./chunk-MVT35QLI.js";
import "./chunk-MNTBHR2J.js";

// ../../../../../../Users/jin/node_modules/@fullcalendar/vue3/dist/FullCalendar.js
import { defineComponent, h, Fragment, Teleport } from "vue";

// ../../../../../../Users/jin/node_modules/@fullcalendar/vue3/dist/options.js
var OPTION_IS_COMPLEX = {
  headerToolbar: true,
  footerToolbar: true,
  events: true,
  eventSources: true,
  resources: true
};

// ../../../../../../Users/jin/node_modules/@fullcalendar/vue3/dist/FullCalendar.js
var FullCalendar = defineComponent({
  props: {
    options: Object
  },
  data() {
    return {
      renderId: 0,
      customRenderingMap: /* @__PURE__ */ new Map()
    };
  },
  methods: {
    getApi() {
      return getSecret(this).calendar;
    },
    buildOptions(suppliedOptions) {
      return {
        ...suppliedOptions,
        customRenderingMetaMap: kebabToCamelKeys(this.$slots),
        handleCustomRendering: getSecret(this).handleCustomRendering
      };
    }
  },
  render() {
    const customRenderingNodes = [];
    for (const customRendering of this.customRenderingMap.values()) {
      customRenderingNodes.push(h(CustomRenderingComponent, {
        key: customRendering.id,
        customRendering
      }));
    }
    return h("div", {
      // when renderId is changed, Vue will trigger a real-DOM async rerender, calling beforeUpdate/updated
      attrs: { "data-fc-render-id": this.renderId }
    }, h(Fragment, customRenderingNodes));
  },
  mounted() {
    const customRenderingStore = new CustomRenderingStore();
    getSecret(this).handleCustomRendering = customRenderingStore.handle.bind(customRenderingStore);
    const calendarOptions = this.buildOptions(this.options);
    const calendar = new Calendar(this.$el, calendarOptions);
    getSecret(this).calendar = calendar;
    calendar.render();
    customRenderingStore.subscribe((customRenderingMap) => {
      this.customRenderingMap = customRenderingMap;
      this.renderId++;
      getSecret(this).needCustomRenderingResize = true;
    });
  },
  beforeUpdate() {
    this.getApi().resumeRendering();
  },
  updated() {
    if (getSecret(this).needCustomRenderingResize) {
      getSecret(this).needCustomRenderingResize = false;
      this.getApi().updateSize();
    }
  },
  beforeUnmount() {
    this.getApi().destroy();
  },
  watch: buildWatchers()
});
var FullCalendar_default = FullCalendar;
var CustomRenderingComponent = defineComponent({
  props: {
    customRendering: Object
  },
  render() {
    const customRendering = this.customRendering;
    const innerContent = typeof customRendering.generatorMeta === "function" ? customRendering.generatorMeta(customRendering.renderProps) : (
      // vue-normalized slot function
      customRendering.generatorMeta
    );
    return h(Teleport, { to: customRendering.containerEl }, innerContent);
  }
});
function getSecret(inst) {
  return inst;
}
function buildWatchers() {
  let watchers = {
    // watches changes of ALL options and their nested objects,
    // but this is only a means to be notified of top-level non-complex options changes.
    options: {
      deep: true,
      handler(options) {
        let calendar = this.getApi();
        calendar.pauseRendering();
        let calendarOptions = this.buildOptions(options);
        calendar.resetOptions(calendarOptions);
        this.renderId++;
      }
    }
  };
  for (let complexOptionName in OPTION_IS_COMPLEX) {
    watchers[`options.${complexOptionName}`] = {
      deep: true,
      handler(val) {
        if (val !== void 0) {
          let calendar = this.getApi();
          calendar.pauseRendering();
          calendar.resetOptions({
            [complexOptionName]: val
          }, [complexOptionName]);
          this.renderId++;
        }
      }
    };
  }
  return watchers;
}
function kebabToCamelKeys(map) {
  const newMap = {};
  for (const key in map) {
    newMap[kebabToCamel(key)] = map[key];
  }
  return newMap;
}
function kebabToCamel(s) {
  return s.split("-").map((word, index) => index ? capitalize(word) : word).join("");
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ../../../../../../Users/jin/node_modules/@fullcalendar/vue3/dist/index.js
var dist_default = FullCalendar_default;
export {
  dist_default as default
};
//# sourceMappingURL=@fullcalendar_vue3.js.map
