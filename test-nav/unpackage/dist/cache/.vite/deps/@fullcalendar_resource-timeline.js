import "./chunk-ALPPRSLK.js";
import {
  BaseComponent,
  BgEvent,
  CalendarImpl,
  ContentContainer,
  DateComponent,
  DelayedRunner,
  Emitter,
  EventImpl,
  MoreLinkContainer,
  NowIndicatorContainer,
  NowTimer,
  PositionCache,
  RefMap,
  Scroller,
  SegHierarchy,
  Slicer,
  Splitter,
  StandardEvent,
  ViewContainer,
  _,
  addDays,
  addMs,
  applyStyle,
  asCleanDays,
  asRoughMinutes,
  asRoughMs,
  asRoughSeconds,
  buildEventRangeKey,
  buildIsoString,
  buildNavLinkAttrs,
  collectFromHash,
  combineEventUis,
  compareByFieldSpecs,
  compareObjs,
  computeEarliestSegStart,
  computeEdges,
  computeInnerRect,
  computeShrinkWidth,
  computeVisibleDayRange,
  config,
  createDuration,
  createEventUi,
  createFormatter,
  createPlugin,
  d,
  diffWholeDays,
  elementClosest,
  filterHash,
  findDirectChildren,
  findElements,
  flexibleCompare,
  getAllowYScrolling,
  getCanVGrowWithinCell,
  getDateMeta,
  getDayClassNames,
  getIsRtlScrollbarOnLeft,
  getScrollGridClassNames,
  getScrollbarWidths,
  getSectionClassNames,
  getSectionHasLiquidHeight,
  getSegMeta,
  getSlotClassNames,
  getStickyFooterScrollbar,
  getStickyHeaderDates,
  greatestDurationDenominator,
  groupIntersectingEntries,
  guid,
  hasShrinkWidth,
  identity,
  injectStyles,
  intersectRanges,
  isArraysEqual,
  isColPropsEqual,
  isInt,
  isPropsEqual,
  isPropsValid,
  isValidDate,
  mapHash,
  memoize,
  memoizeArraylike,
  memoizeHashlike,
  memoizeObjArg,
  mergeEventStores,
  multiplyDuration,
  padStart,
  parseBusinessHours,
  parseClassNames,
  parseFieldSpecs,
  rangeContainsMarker,
  rangesEqual,
  rangesIntersect,
  refineProps,
  removeElement,
  renderChunkContent,
  renderFill,
  renderMicroColGroup,
  renderScrollShim,
  requestJson,
  sanitizeShrinkWidth,
  setRef,
  sortEventSegs,
  startOfDay,
  translateRect,
  unpromisify,
  wholeDivideDurations,
  y
} from "./chunk-MVT35QLI.js";
import "./chunk-MNTBHR2J.js";

// ../../../../../../Users/jin/node_modules/@fullcalendar/premium-common/index.js
var UPGRADE_WINDOW = 365 + 7;
var INVALID_LICENSE_URL = "https://fullcalendar.io/docs/schedulerLicenseKey#invalid";
var OUTDATED_LICENSE_URL = "https://fullcalendar.io/docs/schedulerLicenseKey#outdated";
var PRESET_LICENSE_KEYS = [
  "GPL-My-Project-Is-Open-Source",
  "CC-Attribution-NonCommercial-NoDerivatives"
];
var CSS = {
  position: "absolute",
  zIndex: 99999,
  bottom: "1px",
  left: "1px",
  background: "#eee",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "1px 1px 0 0",
  padding: "2px 4px",
  fontSize: "12px",
  borderTopRightRadius: "3px"
};
function buildLicenseWarning(context) {
  let key = context.options.schedulerLicenseKey;
  let currentUrl = typeof window !== "undefined" ? window.location.href : "";
  if (!isImmuneUrl(currentUrl)) {
    let status = processLicenseKey(key, context.pluginHooks.premiumReleaseDate);
    if (status !== "valid") {
      return y("div", { className: "fc-license-message", style: CSS }, status === "outdated" ? y(
        _,
        null,
        "Your license key is too old to work with this version. ",
        y("a", { href: OUTDATED_LICENSE_URL }, "More Info")
      ) : y(
        _,
        null,
        "Your license key is invalid. ",
        y("a", { href: INVALID_LICENSE_URL }, "More Info")
      ));
    }
  }
  return null;
}
function processLicenseKey(key, premiumReleaseDate) {
  if (PRESET_LICENSE_KEYS.indexOf(key) !== -1) {
    return "valid";
  }
  const parts = (key || "").match(/^(\d+)-fcs-(\d+)$/);
  if (parts && parts[1].length === 10) {
    const purchaseDate = new Date(parseInt(parts[2], 10) * 1e3);
    const releaseDate = config.mockSchedulerReleaseDate || premiumReleaseDate;
    if (isValidDate(releaseDate)) {
      const minPurchaseDate = addDays(releaseDate, -UPGRADE_WINDOW);
      if (minPurchaseDate < purchaseDate) {
        return "valid";
      }
      return "outdated";
    }
  }
  return "invalid";
}
function isImmuneUrl(url) {
  return /\w+:\/\/fullcalendar\.io\/|\/examples\/[\w-]+\.html$/.test(url);
}
var OPTION_REFINERS = {
  schedulerLicenseKey: String
};
var index = createPlugin({
  name: "@fullcalendar/premium-common",
  premiumReleaseDate: "2025-04-02",
  optionRefiners: OPTION_REFINERS,
  viewContainerAppends: [buildLicenseWarning]
});

// ../../../../../../Users/jin/node_modules/@fullcalendar/scrollgrid/internal.js
function getScrollCanvasOrigin(scrollEl) {
  let rect = scrollEl.getBoundingClientRect();
  let edges = computeEdges(scrollEl);
  return {
    left: rect.left + edges.borderLeft + edges.scrollbarLeft - getScrollFromLeftEdge(scrollEl),
    top: rect.top + edges.borderTop - scrollEl.scrollTop
  };
}
function getScrollFromLeftEdge(el) {
  let scrollLeft = el.scrollLeft;
  let computedStyles = window.getComputedStyle(el);
  if (computedStyles.direction === "rtl") {
    switch (getRtlScrollSystem()) {
      case "negative":
        scrollLeft *= -1;
      case "reverse":
        scrollLeft = el.scrollWidth - scrollLeft - el.clientWidth;
    }
  }
  return scrollLeft;
}
function setScrollFromLeftEdge(el, scrollLeft) {
  let computedStyles = window.getComputedStyle(el);
  if (computedStyles.direction === "rtl") {
    switch (getRtlScrollSystem()) {
      case "reverse":
        scrollLeft = el.scrollWidth - scrollLeft;
        break;
      case "negative":
        scrollLeft = -(el.scrollWidth - scrollLeft);
        break;
    }
  }
  el.scrollLeft = scrollLeft;
}
var _rtlScrollSystem;
function getRtlScrollSystem() {
  return _rtlScrollSystem || (_rtlScrollSystem = detectRtlScrollSystem());
}
function detectRtlScrollSystem() {
  let el = document.createElement("div");
  el.style.position = "absolute";
  el.style.top = "-1000px";
  el.style.width = "100px";
  el.style.height = "100px";
  el.style.overflow = "scroll";
  el.style.direction = "rtl";
  let innerEl = document.createElement("div");
  innerEl.style.width = "200px";
  innerEl.style.height = "200px";
  el.appendChild(innerEl);
  document.body.appendChild(el);
  let system;
  if (el.scrollLeft > 0) {
    system = "positive";
  } else {
    el.scrollLeft = 1;
    if (el.scrollLeft > 0) {
      system = "reverse";
    } else {
      system = "negative";
    }
  }
  removeElement(el);
  return system;
}
var STICKY_SELECTOR = ".fc-sticky";
var StickyScrolling = class {
  constructor(scrollEl, isRtl) {
    this.scrollEl = scrollEl;
    this.isRtl = isRtl;
    this.updateSize = () => {
      let { scrollEl: scrollEl2 } = this;
      let els = findElements(scrollEl2, STICKY_SELECTOR);
      let elGeoms = this.queryElGeoms(els);
      let viewportWidth = scrollEl2.clientWidth;
      assignStickyPositions(els, elGeoms, viewportWidth);
    };
  }
  queryElGeoms(els) {
    let { scrollEl, isRtl } = this;
    let canvasOrigin = getScrollCanvasOrigin(scrollEl);
    let elGeoms = [];
    for (let el of els) {
      let parentBound = translateRect(
        computeInnerRect(el.parentNode, true, true),
        // weird way to call this!!!
        -canvasOrigin.left,
        -canvasOrigin.top
      );
      let elRect = el.getBoundingClientRect();
      let computedStyles = window.getComputedStyle(el);
      let textAlign = window.getComputedStyle(el.parentNode).textAlign;
      let naturalBound = null;
      if (textAlign === "start") {
        textAlign = isRtl ? "right" : "left";
      } else if (textAlign === "end") {
        textAlign = isRtl ? "left" : "right";
      }
      if (computedStyles.position !== "sticky") {
        naturalBound = translateRect(
          elRect,
          -canvasOrigin.left - (parseFloat(computedStyles.left) || 0),
          // could be 'auto'
          -canvasOrigin.top - (parseFloat(computedStyles.top) || 0)
        );
      }
      elGeoms.push({
        parentBound,
        naturalBound,
        elWidth: elRect.width,
        elHeight: elRect.height,
        textAlign
      });
    }
    return elGeoms;
  }
};
function assignStickyPositions(els, elGeoms, viewportWidth) {
  els.forEach((el, i) => {
    let { textAlign, elWidth, parentBound } = elGeoms[i];
    let parentWidth = parentBound.right - parentBound.left;
    let left;
    if (textAlign === "center" && parentWidth > viewportWidth) {
      left = (viewportWidth - elWidth) / 2;
    } else {
      left = "";
    }
    applyStyle(el, {
      left,
      right: left,
      top: 0
    });
  });
}
var ClippedScroller = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.elRef = d();
    this.state = {
      xScrollbarWidth: 0,
      yScrollbarWidth: 0
    };
    this.handleScroller = (scroller) => {
      this.scroller = scroller;
      setRef(this.props.scrollerRef, scroller);
    };
    this.handleSizing = () => {
      let { props } = this;
      if (props.overflowY === "scroll-hidden") {
        this.setState({ yScrollbarWidth: this.scroller.getYScrollbarWidth() });
      }
      if (props.overflowX === "scroll-hidden") {
        this.setState({ xScrollbarWidth: this.scroller.getXScrollbarWidth() });
      }
    };
  }
  render() {
    let { props, state, context } = this;
    let isScrollbarOnLeft = context.isRtl && getIsRtlScrollbarOnLeft();
    let overcomeLeft = 0;
    let overcomeRight = 0;
    let overcomeBottom = 0;
    let { overflowX, overflowY } = props;
    if (props.forPrint) {
      overflowX = "visible";
      overflowY = "visible";
    }
    if (overflowX === "scroll-hidden") {
      overcomeBottom = state.xScrollbarWidth;
    }
    if (overflowY === "scroll-hidden") {
      if (state.yScrollbarWidth != null) {
        if (isScrollbarOnLeft) {
          overcomeLeft = state.yScrollbarWidth;
        } else {
          overcomeRight = state.yScrollbarWidth;
        }
      }
    }
    return y(
      "div",
      { ref: this.elRef, className: "fc-scroller-harness" + (props.liquid ? " fc-scroller-harness-liquid" : "") },
      y(Scroller, { ref: this.handleScroller, elRef: this.props.scrollerElRef, overflowX: overflowX === "scroll-hidden" ? "scroll" : overflowX, overflowY: overflowY === "scroll-hidden" ? "scroll" : overflowY, overcomeLeft, overcomeRight, overcomeBottom, maxHeight: typeof props.maxHeight === "number" ? props.maxHeight + (overflowX === "scroll-hidden" ? state.xScrollbarWidth : 0) : "", liquid: props.liquid, liquidIsAbsolute: true }, props.children)
    );
  }
  componentDidMount() {
    this.handleSizing();
    this.context.addResizeHandler(this.handleSizing);
  }
  getSnapshotBeforeUpdate(prevProps) {
    if (this.props.forPrint && !prevProps.forPrint) {
      return { simulateScrollLeft: this.scroller.el.scrollLeft };
    }
    return {};
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { props, scroller: { el: scrollerEl } } = this;
    if (!isPropsEqual(prevProps, props)) {
      this.handleSizing();
    }
    if (snapshot.simulateScrollLeft !== void 0) {
      scrollerEl.style.left = -snapshot.simulateScrollLeft + "px";
    } else if (!props.forPrint && prevProps.forPrint) {
      const restoredScrollLeft = -parseInt(scrollerEl.style.left);
      scrollerEl.style.left = "";
      scrollerEl.scrollLeft = restoredScrollLeft;
    }
  }
  componentWillUnmount() {
    this.context.removeResizeHandler(this.handleSizing);
  }
  needsXScrolling() {
    return this.scroller.needsXScrolling();
  }
  needsYScrolling() {
    return this.scroller.needsYScrolling();
  }
};
var WHEEL_EVENT_NAMES = "wheel mousewheel DomMouseScroll MozMousePixelScroll".split(" ");
var ScrollListener = class {
  constructor(el) {
    this.el = el;
    this.emitter = new Emitter();
    this.isScrolling = false;
    this.isTouching = false;
    this.isRecentlyWheeled = false;
    this.isRecentlyScrolled = false;
    this.wheelWaiter = new DelayedRunner(this._handleWheelWaited.bind(this));
    this.scrollWaiter = new DelayedRunner(this._handleScrollWaited.bind(this));
    this.handleScroll = () => {
      this.startScroll();
      this.emitter.trigger("scroll", this.isRecentlyWheeled, this.isTouching);
      this.isRecentlyScrolled = true;
      this.scrollWaiter.request(500);
    };
    this.handleWheel = () => {
      this.isRecentlyWheeled = true;
      this.wheelWaiter.request(500);
    };
    this.handleTouchStart = () => {
      this.isTouching = true;
    };
    this.handleTouchEnd = () => {
      this.isTouching = false;
      if (!this.isRecentlyScrolled) {
        this.endScroll();
      }
    };
    el.addEventListener("scroll", this.handleScroll);
    el.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    el.addEventListener("touchend", this.handleTouchEnd);
    for (let eventName of WHEEL_EVENT_NAMES) {
      el.addEventListener(eventName, this.handleWheel);
    }
  }
  destroy() {
    let { el } = this;
    el.removeEventListener("scroll", this.handleScroll);
    el.removeEventListener("touchstart", this.handleTouchStart, { passive: true });
    el.removeEventListener("touchend", this.handleTouchEnd);
    for (let eventName of WHEEL_EVENT_NAMES) {
      el.removeEventListener(eventName, this.handleWheel);
    }
  }
  // Start / Stop
  // ----------------------------------------------------------------------------------------------
  startScroll() {
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.emitter.trigger("scrollStart", this.isRecentlyWheeled, this.isTouching);
    }
  }
  endScroll() {
    if (this.isScrolling) {
      this.emitter.trigger("scrollEnd");
      this.isScrolling = false;
      this.isRecentlyScrolled = true;
      this.isRecentlyWheeled = false;
      this.scrollWaiter.clear();
      this.wheelWaiter.clear();
    }
  }
  _handleScrollWaited() {
    this.isRecentlyScrolled = false;
    if (!this.isTouching) {
      this.endScroll();
    }
  }
  _handleWheelWaited() {
    this.isRecentlyWheeled = false;
  }
};
var ScrollSyncer = class {
  constructor(isVertical, scrollEls) {
    this.isVertical = isVertical;
    this.scrollEls = scrollEls;
    this.isPaused = false;
    this.scrollListeners = scrollEls.map((el) => this.bindScroller(el));
  }
  destroy() {
    for (let scrollListener of this.scrollListeners) {
      scrollListener.destroy();
    }
  }
  bindScroller(el) {
    let { scrollEls, isVertical } = this;
    let scrollListener = new ScrollListener(el);
    const onScroll = (isWheel, isTouch) => {
      if (!this.isPaused) {
        if (!this.masterEl || this.masterEl !== el && (isWheel || isTouch)) {
          this.assignMaster(el);
        }
        if (this.masterEl === el) {
          for (let otherEl of scrollEls) {
            if (otherEl !== el) {
              if (isVertical) {
                otherEl.scrollTop = el.scrollTop;
              } else {
                otherEl.scrollLeft = el.scrollLeft;
              }
            }
          }
        }
      }
    };
    const onScrollEnd = () => {
      if (this.masterEl === el) {
        this.masterEl = null;
      }
    };
    scrollListener.emitter.on("scroll", onScroll);
    scrollListener.emitter.on("scrollEnd", onScrollEnd);
    return scrollListener;
  }
  assignMaster(el) {
    this.masterEl = el;
    for (let scrollListener of this.scrollListeners) {
      if (scrollListener.el !== el) {
        scrollListener.endScroll();
      }
    }
  }
  /*
  will normalize the scrollLeft value
  */
  forceScrollLeft(scrollLeft) {
    this.isPaused = true;
    for (let listener of this.scrollListeners) {
      setScrollFromLeftEdge(listener.el, scrollLeft);
    }
    this.isPaused = false;
  }
  forceScrollTop(top) {
    this.isPaused = true;
    for (let listener of this.scrollListeners) {
      listener.el.scrollTop = top;
    }
    this.isPaused = false;
  }
};
config.SCROLLGRID_RESIZE_INTERVAL = 500;
var ScrollGrid = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.compileColGroupStats = memoizeArraylike(compileColGroupStat, isColGroupStatsEqual);
    this.renderMicroColGroups = memoizeArraylike(renderMicroColGroup);
    this.clippedScrollerRefs = new RefMap();
    this.scrollerElRefs = new RefMap(this._handleScrollerEl.bind(this));
    this.chunkElRefs = new RefMap(this._handleChunkEl.bind(this));
    this.scrollSyncersBySection = {};
    this.scrollSyncersByColumn = {};
    this.rowUnstableMap = /* @__PURE__ */ new Map();
    this.rowInnerMaxHeightMap = /* @__PURE__ */ new Map();
    this.anyRowHeightsChanged = false;
    this.recentSizingCnt = 0;
    this.state = {
      shrinkWidths: [],
      forceYScrollbars: false,
      forceXScrollbars: false,
      scrollerClientWidths: {},
      scrollerClientHeights: {},
      sectionRowMaxHeights: []
    };
    this.handleSizing = (isForcedResize, sectionRowMaxHeightsChanged) => {
      if (!this.allowSizing()) {
        return;
      }
      if (!sectionRowMaxHeightsChanged) {
        this.anyRowHeightsChanged = true;
      }
      let otherState = {};
      if (isForcedResize || !sectionRowMaxHeightsChanged && !this.rowUnstableMap.size) {
        otherState.sectionRowMaxHeights = this.computeSectionRowMaxHeights();
      }
      this.setState(Object.assign(Object.assign({ shrinkWidths: this.computeShrinkWidths() }, this.computeScrollerDims()), otherState), () => {
        if (!this.rowUnstableMap.size) {
          this.updateStickyScrolling();
        }
      });
    };
    this.handleRowHeightChange = (rowEl, isStable) => {
      let { rowUnstableMap, rowInnerMaxHeightMap } = this;
      if (!isStable) {
        rowUnstableMap.set(rowEl, true);
      } else {
        rowUnstableMap.delete(rowEl);
        let innerMaxHeight = getRowInnerMaxHeight(rowEl);
        if (!rowInnerMaxHeightMap.has(rowEl) || rowInnerMaxHeightMap.get(rowEl) !== innerMaxHeight) {
          rowInnerMaxHeightMap.set(rowEl, innerMaxHeight);
          this.anyRowHeightsChanged = true;
        }
        if (!rowUnstableMap.size && this.anyRowHeightsChanged) {
          this.anyRowHeightsChanged = false;
          this.setState({
            sectionRowMaxHeights: this.computeSectionRowMaxHeights()
          });
        }
      }
    };
  }
  render() {
    let { props, state, context } = this;
    let { shrinkWidths } = state;
    let colGroupStats = this.compileColGroupStats(props.colGroups.map((colGroup) => [colGroup]));
    let microColGroupNodes = this.renderMicroColGroups(colGroupStats.map((stat, i) => [stat.cols, shrinkWidths[i]]));
    let classNames = getScrollGridClassNames(props.liquid, context);
    this.getDims();
    let sectionConfigs = props.sections;
    let configCnt = sectionConfigs.length;
    let configI = 0;
    let currentConfig;
    let headSectionNodes = [];
    let bodySectionNodes = [];
    let footSectionNodes = [];
    while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "header") {
      headSectionNodes.push(this.renderSection(currentConfig, configI, colGroupStats, microColGroupNodes, state.sectionRowMaxHeights, true));
      configI += 1;
    }
    while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "body") {
      bodySectionNodes.push(this.renderSection(currentConfig, configI, colGroupStats, microColGroupNodes, state.sectionRowMaxHeights, false));
      configI += 1;
    }
    while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "footer") {
      footSectionNodes.push(this.renderSection(currentConfig, configI, colGroupStats, microColGroupNodes, state.sectionRowMaxHeights, true));
      configI += 1;
    }
    const isBuggy = !getCanVGrowWithinCell();
    const roleAttrs = { role: "rowgroup" };
    return y("table", {
      ref: props.elRef,
      role: "grid",
      className: classNames.join(" ")
    }, renderMacroColGroup(colGroupStats, shrinkWidths), Boolean(!isBuggy && headSectionNodes.length) && y("thead", roleAttrs, ...headSectionNodes), Boolean(!isBuggy && bodySectionNodes.length) && y("tbody", roleAttrs, ...bodySectionNodes), Boolean(!isBuggy && footSectionNodes.length) && y("tfoot", roleAttrs, ...footSectionNodes), isBuggy && y("tbody", roleAttrs, ...headSectionNodes, ...bodySectionNodes, ...footSectionNodes));
  }
  renderSection(sectionConfig, sectionIndex, colGroupStats, microColGroupNodes, sectionRowMaxHeights, isHeader) {
    if ("outerContent" in sectionConfig) {
      return y(_, { key: sectionConfig.key }, sectionConfig.outerContent);
    }
    return y("tr", { key: sectionConfig.key, role: "presentation", className: getSectionClassNames(sectionConfig, this.props.liquid).join(" ") }, sectionConfig.chunks.map((chunkConfig, i) => this.renderChunk(sectionConfig, sectionIndex, colGroupStats[i], microColGroupNodes[i], chunkConfig, i, (sectionRowMaxHeights[sectionIndex] || [])[i] || [], isHeader)));
  }
  renderChunk(sectionConfig, sectionIndex, colGroupStat, microColGroupNode, chunkConfig, chunkIndex, rowHeights, isHeader) {
    if ("outerContent" in chunkConfig) {
      return y(_, { key: chunkConfig.key }, chunkConfig.outerContent);
    }
    let { state } = this;
    let { scrollerClientWidths, scrollerClientHeights } = state;
    let [sectionCnt, chunksPerSection] = this.getDims();
    let index5 = sectionIndex * chunksPerSection + chunkIndex;
    let sideScrollIndex = !this.context.isRtl || getIsRtlScrollbarOnLeft() ? chunksPerSection - 1 : 0;
    let isVScrollSide = chunkIndex === sideScrollIndex;
    let isLastSection = sectionIndex === sectionCnt - 1;
    let forceXScrollbars = isLastSection && state.forceXScrollbars;
    let forceYScrollbars = isVScrollSide && state.forceYScrollbars;
    let allowXScrolling = colGroupStat && colGroupStat.allowXScrolling;
    let allowYScrolling = getAllowYScrolling(this.props, sectionConfig);
    let chunkVGrow = getSectionHasLiquidHeight(this.props, sectionConfig);
    let expandRows = sectionConfig.expandRows && chunkVGrow;
    let tableMinWidth = colGroupStat && colGroupStat.totalColMinWidth || "";
    let content = renderChunkContent(sectionConfig, chunkConfig, {
      tableColGroupNode: microColGroupNode,
      tableMinWidth,
      clientWidth: scrollerClientWidths[index5] !== void 0 ? scrollerClientWidths[index5] : null,
      clientHeight: scrollerClientHeights[index5] !== void 0 ? scrollerClientHeights[index5] : null,
      expandRows,
      syncRowHeights: Boolean(sectionConfig.syncRowHeights),
      rowSyncHeights: rowHeights,
      reportRowHeightChange: this.handleRowHeightChange
    }, isHeader);
    let overflowX = forceXScrollbars ? isLastSection ? "scroll" : "scroll-hidden" : !allowXScrolling ? "hidden" : isLastSection ? "auto" : "scroll-hidden";
    let overflowY = forceYScrollbars ? isVScrollSide ? "scroll" : "scroll-hidden" : !allowYScrolling ? "hidden" : isVScrollSide ? "auto" : "scroll-hidden";
    content = y(ClippedScroller, { ref: this.clippedScrollerRefs.createRef(index5), scrollerElRef: this.scrollerElRefs.createRef(index5), overflowX, overflowY, forPrint: this.props.forPrint, liquid: chunkVGrow, maxHeight: sectionConfig.maxHeight }, content);
    return y(isHeader ? "th" : "td", {
      key: chunkConfig.key,
      ref: this.chunkElRefs.createRef(index5),
      role: "presentation"
    }, content);
  }
  componentDidMount() {
    this.getStickyScrolling = memoizeArraylike(initStickyScrolling);
    this.getScrollSyncersBySection = memoizeHashlike(initScrollSyncer.bind(this, true), null, destroyScrollSyncer);
    this.getScrollSyncersByColumn = memoizeHashlike(initScrollSyncer.bind(this, false), null, destroyScrollSyncer);
    this.updateScrollSyncers();
    this.handleSizing(false);
    this.context.addResizeHandler(this.handleSizing);
  }
  componentDidUpdate(prevProps, prevState) {
    this.updateScrollSyncers();
    this.handleSizing(false, prevState.sectionRowMaxHeights !== this.state.sectionRowMaxHeights);
  }
  componentWillUnmount() {
    this.context.removeResizeHandler(this.handleSizing);
    this.destroyScrollSyncers();
  }
  allowSizing() {
    let now = /* @__PURE__ */ new Date();
    if (!this.lastSizingDate || now.valueOf() > this.lastSizingDate.valueOf() + config.SCROLLGRID_RESIZE_INTERVAL) {
      this.lastSizingDate = now;
      this.recentSizingCnt = 0;
      return true;
    }
    return (this.recentSizingCnt += 1) <= 10;
  }
  computeShrinkWidths() {
    let colGroupStats = this.compileColGroupStats(this.props.colGroups.map((colGroup) => [colGroup]));
    let [sectionCnt, chunksPerSection] = this.getDims();
    let cnt = sectionCnt * chunksPerSection;
    let shrinkWidths = [];
    colGroupStats.forEach((colGroupStat, i) => {
      if (colGroupStat.hasShrinkCol) {
        let chunkEls = this.chunkElRefs.collect(i, cnt, chunksPerSection);
        shrinkWidths[i] = computeShrinkWidth(chunkEls);
      }
    });
    return shrinkWidths;
  }
  // has the side effect of grooming rowInnerMaxHeightMap
  // TODO: somehow short-circuit if there are no new height changes
  computeSectionRowMaxHeights() {
    let newHeightMap = /* @__PURE__ */ new Map();
    let [sectionCnt, chunksPerSection] = this.getDims();
    let sectionRowMaxHeights = [];
    for (let sectionI = 0; sectionI < sectionCnt; sectionI += 1) {
      let sectionConfig = this.props.sections[sectionI];
      let assignableHeights = [];
      if (sectionConfig && sectionConfig.syncRowHeights) {
        let rowHeightsByChunk = [];
        for (let chunkI = 0; chunkI < chunksPerSection; chunkI += 1) {
          let index5 = sectionI * chunksPerSection + chunkI;
          let rowHeights = [];
          let chunkEl = this.chunkElRefs.currentMap[index5];
          if (chunkEl) {
            rowHeights = findElements(chunkEl, ".fc-scrollgrid-sync-table tr").map((rowEl) => {
              let max = getRowInnerMaxHeight(rowEl);
              newHeightMap.set(rowEl, max);
              return max;
            });
          } else {
            rowHeights = [];
          }
          rowHeightsByChunk.push(rowHeights);
        }
        let rowCnt = rowHeightsByChunk[0].length;
        let isEqualRowCnt = true;
        for (let chunkI = 1; chunkI < chunksPerSection; chunkI += 1) {
          let isOuterContent = sectionConfig.chunks[chunkI] && sectionConfig.chunks[chunkI].outerContent !== void 0;
          if (!isOuterContent && rowHeightsByChunk[chunkI].length !== rowCnt) {
            isEqualRowCnt = false;
            break;
          }
        }
        if (!isEqualRowCnt) {
          let chunkHeightSums = [];
          for (let chunkI = 0; chunkI < chunksPerSection; chunkI += 1) {
            chunkHeightSums.push(sumNumbers(rowHeightsByChunk[chunkI]) + rowHeightsByChunk[chunkI].length);
          }
          let maxTotalSum = Math.max(...chunkHeightSums);
          for (let chunkI = 0; chunkI < chunksPerSection; chunkI += 1) {
            let rowInChunkCnt = rowHeightsByChunk[chunkI].length;
            let rowInChunkTotalHeight = maxTotalSum - rowInChunkCnt;
            let rowInChunkHeightOthers = Math.floor(rowInChunkTotalHeight / rowInChunkCnt);
            let rowInChunkHeightFirst = rowInChunkTotalHeight - rowInChunkHeightOthers * (rowInChunkCnt - 1);
            let rowInChunkHeights = [];
            let row = 0;
            if (row < rowInChunkCnt) {
              rowInChunkHeights.push(rowInChunkHeightFirst);
              row += 1;
            }
            while (row < rowInChunkCnt) {
              rowInChunkHeights.push(rowInChunkHeightOthers);
              row += 1;
            }
            assignableHeights.push(rowInChunkHeights);
          }
        } else {
          for (let chunkI = 0; chunkI < chunksPerSection; chunkI += 1) {
            assignableHeights.push([]);
          }
          for (let row = 0; row < rowCnt; row += 1) {
            let rowHeightsAcrossChunks = [];
            for (let chunkI = 0; chunkI < chunksPerSection; chunkI += 1) {
              let h = rowHeightsByChunk[chunkI][row];
              if (h != null) {
                rowHeightsAcrossChunks.push(h);
              }
            }
            let maxHeight = Math.max(...rowHeightsAcrossChunks);
            for (let chunkI = 0; chunkI < chunksPerSection; chunkI += 1) {
              assignableHeights[chunkI].push(maxHeight);
            }
          }
        }
      }
      sectionRowMaxHeights.push(assignableHeights);
    }
    this.rowInnerMaxHeightMap = newHeightMap;
    return sectionRowMaxHeights;
  }
  computeScrollerDims() {
    let scrollbarWidth = getScrollbarWidths();
    let [sectionCnt, chunksPerSection] = this.getDims();
    let sideScrollI = !this.context.isRtl || getIsRtlScrollbarOnLeft() ? chunksPerSection - 1 : 0;
    let lastSectionI = sectionCnt - 1;
    let currentScrollers = this.clippedScrollerRefs.currentMap;
    let scrollerEls = this.scrollerElRefs.currentMap;
    let forceYScrollbars = false;
    let forceXScrollbars = false;
    let scrollerClientWidths = {};
    let scrollerClientHeights = {};
    for (let sectionI = 0; sectionI < sectionCnt; sectionI += 1) {
      let index5 = sectionI * chunksPerSection + sideScrollI;
      let scroller = currentScrollers[index5];
      if (scroller && scroller.needsYScrolling()) {
        forceYScrollbars = true;
        break;
      }
    }
    for (let chunkI = 0; chunkI < chunksPerSection; chunkI += 1) {
      let index5 = lastSectionI * chunksPerSection + chunkI;
      let scroller = currentScrollers[index5];
      if (scroller && scroller.needsXScrolling()) {
        forceXScrollbars = true;
        break;
      }
    }
    for (let sectionI = 0; sectionI < sectionCnt; sectionI += 1) {
      for (let chunkI = 0; chunkI < chunksPerSection; chunkI += 1) {
        let index5 = sectionI * chunksPerSection + chunkI;
        let scrollerEl = scrollerEls[index5];
        if (scrollerEl) {
          let harnessEl = scrollerEl.parentNode;
          scrollerClientWidths[index5] = Math.floor(harnessEl.getBoundingClientRect().width - (chunkI === sideScrollI && forceYScrollbars ? scrollbarWidth.y : 0));
          scrollerClientHeights[index5] = Math.floor(harnessEl.getBoundingClientRect().height - (sectionI === lastSectionI && forceXScrollbars ? scrollbarWidth.x : 0));
        }
      }
    }
    return { forceYScrollbars, forceXScrollbars, scrollerClientWidths, scrollerClientHeights };
  }
  updateStickyScrolling() {
    let { isRtl } = this.context;
    let argsByKey = this.scrollerElRefs.getAll().map((scrollEl) => [scrollEl, isRtl]);
    this.getStickyScrolling(argsByKey).forEach((stickyScrolling) => stickyScrolling.updateSize());
  }
  updateScrollSyncers() {
    let [sectionCnt, chunksPerSection] = this.getDims();
    let cnt = sectionCnt * chunksPerSection;
    let scrollElsBySection = {};
    let scrollElsByColumn = {};
    let scrollElMap = this.scrollerElRefs.currentMap;
    for (let sectionI = 0; sectionI < sectionCnt; sectionI += 1) {
      let startIndex = sectionI * chunksPerSection;
      let endIndex = startIndex + chunksPerSection;
      scrollElsBySection[sectionI] = collectFromHash(scrollElMap, startIndex, endIndex, 1);
    }
    for (let col = 0; col < chunksPerSection; col += 1) {
      scrollElsByColumn[col] = this.scrollerElRefs.collect(col, cnt, chunksPerSection);
    }
    this.scrollSyncersBySection = this.getScrollSyncersBySection(scrollElsBySection);
    this.scrollSyncersByColumn = this.getScrollSyncersByColumn(scrollElsByColumn);
  }
  destroyScrollSyncers() {
    mapHash(this.scrollSyncersBySection, destroyScrollSyncer);
    mapHash(this.scrollSyncersByColumn, destroyScrollSyncer);
  }
  getChunkConfigByIndex(index5) {
    let chunksPerSection = this.getDims()[1];
    let sectionI = Math.floor(index5 / chunksPerSection);
    let chunkI = index5 % chunksPerSection;
    let sectionConfig = this.props.sections[sectionI];
    return sectionConfig && sectionConfig.chunks[chunkI];
  }
  forceScrollLeft(col, scrollLeft) {
    let scrollSyncer = this.scrollSyncersByColumn[col];
    if (scrollSyncer) {
      scrollSyncer.forceScrollLeft(scrollLeft);
    }
  }
  forceScrollTop(sectionI, scrollTop) {
    let scrollSyncer = this.scrollSyncersBySection[sectionI];
    if (scrollSyncer) {
      scrollSyncer.forceScrollTop(scrollTop);
    }
  }
  _handleChunkEl(chunkEl, key) {
    let chunkConfig = this.getChunkConfigByIndex(parseInt(key, 10));
    if (chunkConfig) {
      setRef(chunkConfig.elRef, chunkEl);
    }
  }
  _handleScrollerEl(scrollerEl, key) {
    let chunkConfig = this.getChunkConfigByIndex(parseInt(key, 10));
    if (chunkConfig) {
      setRef(chunkConfig.scrollerElRef, scrollerEl);
    }
  }
  getDims() {
    let sectionCnt = this.props.sections.length;
    let chunksPerSection = sectionCnt ? this.props.sections[0].chunks.length : 0;
    return [sectionCnt, chunksPerSection];
  }
};
ScrollGrid.addStateEquality({
  shrinkWidths: isArraysEqual,
  scrollerClientWidths: isPropsEqual,
  scrollerClientHeights: isPropsEqual
});
function sumNumbers(numbers) {
  let sum = 0;
  for (let n of numbers) {
    sum += n;
  }
  return sum;
}
function getRowInnerMaxHeight(rowEl) {
  let innerHeights = findElements(rowEl, ".fc-scrollgrid-sync-inner").map(getElHeight);
  if (innerHeights.length) {
    return Math.max(...innerHeights);
  }
  return 0;
}
function getElHeight(el) {
  return el.offsetHeight;
}
function renderMacroColGroup(colGroupStats, shrinkWidths) {
  let children = colGroupStats.map((colGroupStat, i) => {
    let width = colGroupStat.width;
    if (width === "shrink") {
      width = colGroupStat.totalColWidth + sanitizeShrinkWidth(shrinkWidths[i]) + 1;
    }
    return (
      // eslint-disable-next-line react/jsx-key
      y("col", { style: { width } })
    );
  });
  return y("colgroup", {}, ...children);
}
function compileColGroupStat(colGroupConfig) {
  let totalColWidth = sumColProp(colGroupConfig.cols, "width");
  let totalColMinWidth = sumColProp(colGroupConfig.cols, "minWidth");
  let hasShrinkCol = hasShrinkWidth(colGroupConfig.cols);
  let allowXScrolling = colGroupConfig.width !== "shrink" && Boolean(totalColWidth || totalColMinWidth || hasShrinkCol);
  return {
    hasShrinkCol,
    totalColWidth,
    totalColMinWidth,
    allowXScrolling,
    cols: colGroupConfig.cols,
    width: colGroupConfig.width
  };
}
function sumColProp(cols, propName) {
  let total = 0;
  for (let col of cols) {
    let val = col[propName];
    if (typeof val === "number") {
      total += val * (col.span || 1);
    }
  }
  return total;
}
var COL_GROUP_STAT_EQUALITY = {
  cols: isColPropsEqual
};
function isColGroupStatsEqual(stat0, stat1) {
  return compareObjs(stat0, stat1, COL_GROUP_STAT_EQUALITY);
}
function initScrollSyncer(isVertical, ...scrollEls) {
  return new ScrollSyncer(isVertical, scrollEls);
}
function destroyScrollSyncer(scrollSyncer) {
  scrollSyncer.destroy();
}
function initStickyScrolling(scrollEl, isRtl) {
  return new StickyScrolling(scrollEl, isRtl);
}

// ../../../../../../Users/jin/node_modules/@fullcalendar/timeline/internal.js
var css_248z = '.fc .fc-timeline-body{min-height:100%;position:relative;z-index:1}.fc .fc-timeline-slots{bottom:0;position:absolute;top:0;z-index:1}.fc .fc-timeline-slots>table{height:100%}.fc .fc-timeline-slot-minor{border-style:dotted}.fc .fc-timeline-slot-frame{align-items:center;display:flex;justify-content:center}.fc .fc-timeline-header-row-chrono .fc-timeline-slot-frame{justify-content:flex-start}.fc .fc-timeline-header-row:last-child .fc-timeline-slot-frame{overflow:hidden}.fc .fc-timeline-slot-cushion{padding:4px 5px;white-space:nowrap}.fc-direction-ltr .fc-timeline-slot{border-right:0!important}.fc-direction-rtl .fc-timeline-slot{border-left:0!important}.fc .fc-timeline-now-indicator-container{bottom:0;left:0;position:absolute;right:0;top:0;width:0;z-index:4}.fc .fc-timeline-now-indicator-arrow,.fc .fc-timeline-now-indicator-line{border-color:var(--fc-now-indicator-color);border-style:solid;pointer-events:none;position:absolute;top:0}.fc .fc-timeline-now-indicator-arrow{border-left-color:transparent;border-right-color:transparent;border-width:6px 5px 0;margin:0 -6px}.fc .fc-timeline-now-indicator-line{border-width:0 0 0 1px;bottom:0;margin:0 -1px}.fc .fc-timeline-events{position:relative;width:0;z-index:3}.fc .fc-timeline-event-harness,.fc .fc-timeline-more-link{position:absolute;top:0}.fc-timeline-event{z-index:1}.fc-timeline-event.fc-event-mirror{z-index:2}.fc-timeline-event{align-items:center;border-radius:0;display:flex;font-size:var(--fc-small-font-size);margin-bottom:1px;padding:2px 1px;position:relative}.fc-timeline-event .fc-event-main{flex-grow:1;flex-shrink:1;min-width:0}.fc-timeline-event .fc-event-time{font-weight:700}.fc-timeline-event .fc-event-time,.fc-timeline-event .fc-event-title{padding:0 2px;white-space:nowrap}.fc-direction-ltr .fc-timeline-event.fc-event-end,.fc-direction-ltr .fc-timeline-more-link{margin-right:1px}.fc-direction-rtl .fc-timeline-event.fc-event-end,.fc-direction-rtl .fc-timeline-more-link{margin-left:1px}.fc-timeline-overlap-disabled .fc-timeline-event{margin-bottom:0;padding-bottom:5px;padding-top:5px}.fc-timeline-event:not(.fc-event-end):after,.fc-timeline-event:not(.fc-event-start):before{border-color:transparent #000;border-style:solid;border-width:5px;content:"";flex-grow:0;flex-shrink:0;height:0;margin:0 1px;opacity:.5;width:0}.fc-direction-ltr .fc-timeline-event:not(.fc-event-start):before,.fc-direction-rtl .fc-timeline-event:not(.fc-event-end):after{border-left:0}.fc-direction-ltr .fc-timeline-event:not(.fc-event-end):after,.fc-direction-rtl .fc-timeline-event:not(.fc-event-start):before{border-right:0}.fc-timeline-more-link{background:var(--fc-more-link-bg-color);color:var(--fc-more-link-text-color);cursor:pointer;font-size:var(--fc-small-font-size);padding:1px}.fc-timeline-more-link-inner{display:inline-block;left:0;padding:2px;right:0}.fc .fc-timeline-bg{bottom:0;left:0;position:absolute;right:0;top:0;width:0;z-index:2}.fc .fc-timeline-bg .fc-non-business{z-index:1}.fc .fc-timeline-bg .fc-bg-event{z-index:2}.fc .fc-timeline-bg .fc-highlight{z-index:3}.fc .fc-timeline-bg-harness{bottom:0;position:absolute;top:0}';
injectStyles(css_248z);
var MIN_AUTO_LABELS = 18;
var MAX_AUTO_SLOTS_PER_LABEL = 6;
var MAX_AUTO_CELLS = 200;
config.MAX_TIMELINE_SLOTS = 1e3;
var STOCK_SUB_DURATIONS = [
  { years: 1 },
  { months: 1 },
  { days: 1 },
  { hours: 1 },
  { minutes: 30 },
  { minutes: 15 },
  { minutes: 10 },
  { minutes: 5 },
  { minutes: 1 },
  { seconds: 30 },
  { seconds: 15 },
  { seconds: 10 },
  { seconds: 5 },
  { seconds: 1 },
  { milliseconds: 500 },
  { milliseconds: 100 },
  { milliseconds: 10 },
  { milliseconds: 1 }
];
function buildTimelineDateProfile(dateProfile, dateEnv, allOptions, dateProfileGenerator) {
  let tDateProfile = {
    labelInterval: allOptions.slotLabelInterval,
    slotDuration: allOptions.slotDuration
  };
  validateLabelAndSlot(tDateProfile, dateProfile, dateEnv);
  ensureLabelInterval(tDateProfile, dateProfile, dateEnv);
  ensureSlotDuration(tDateProfile, dateProfile, dateEnv);
  let input = allOptions.slotLabelFormat;
  let rawFormats = Array.isArray(input) ? input : input != null ? [input] : computeHeaderFormats(tDateProfile, dateProfile, dateEnv, allOptions);
  tDateProfile.headerFormats = rawFormats.map((rawFormat) => createFormatter(rawFormat));
  tDateProfile.isTimeScale = Boolean(tDateProfile.slotDuration.milliseconds);
  let largeUnit = null;
  if (!tDateProfile.isTimeScale) {
    const slotUnit = greatestDurationDenominator(tDateProfile.slotDuration).unit;
    if (/year|month|week/.test(slotUnit)) {
      largeUnit = slotUnit;
    }
  }
  tDateProfile.largeUnit = largeUnit;
  tDateProfile.emphasizeWeeks = asCleanDays(tDateProfile.slotDuration) === 1 && currentRangeAs("weeks", dateProfile, dateEnv) >= 2 && !allOptions.businessHours;
  let rawSnapDuration = allOptions.snapDuration;
  let snapDuration;
  let snapsPerSlot;
  if (rawSnapDuration) {
    snapDuration = createDuration(rawSnapDuration);
    snapsPerSlot = wholeDivideDurations(tDateProfile.slotDuration, snapDuration);
  }
  if (snapsPerSlot == null) {
    snapDuration = tDateProfile.slotDuration;
    snapsPerSlot = 1;
  }
  tDateProfile.snapDuration = snapDuration;
  tDateProfile.snapsPerSlot = snapsPerSlot;
  let timeWindowMs = asRoughMs(dateProfile.slotMaxTime) - asRoughMs(dateProfile.slotMinTime);
  let normalizedStart = normalizeDate(dateProfile.renderRange.start, tDateProfile, dateEnv);
  let normalizedEnd = normalizeDate(dateProfile.renderRange.end, tDateProfile, dateEnv);
  if (tDateProfile.isTimeScale) {
    normalizedStart = dateEnv.add(normalizedStart, dateProfile.slotMinTime);
    normalizedEnd = dateEnv.add(addDays(normalizedEnd, -1), dateProfile.slotMaxTime);
  }
  tDateProfile.timeWindowMs = timeWindowMs;
  tDateProfile.normalizedRange = { start: normalizedStart, end: normalizedEnd };
  let slotDates = [];
  let date = normalizedStart;
  while (date < normalizedEnd) {
    if (isValidDate2(date, tDateProfile, dateProfile, dateProfileGenerator)) {
      slotDates.push(date);
    }
    date = dateEnv.add(date, tDateProfile.slotDuration);
  }
  tDateProfile.slotDates = slotDates;
  let snapIndex = -1;
  let snapDiff = 0;
  const snapDiffToIndex = [];
  const snapIndexToDiff = [];
  date = normalizedStart;
  while (date < normalizedEnd) {
    if (isValidDate2(date, tDateProfile, dateProfile, dateProfileGenerator)) {
      snapIndex += 1;
      snapDiffToIndex.push(snapIndex);
      snapIndexToDiff.push(snapDiff);
    } else {
      snapDiffToIndex.push(snapIndex + 0.5);
    }
    date = dateEnv.add(date, tDateProfile.snapDuration);
    snapDiff += 1;
  }
  tDateProfile.snapDiffToIndex = snapDiffToIndex;
  tDateProfile.snapIndexToDiff = snapIndexToDiff;
  tDateProfile.snapCnt = snapIndex + 1;
  tDateProfile.slotCnt = tDateProfile.snapCnt / tDateProfile.snapsPerSlot;
  tDateProfile.isWeekStarts = buildIsWeekStarts(tDateProfile, dateEnv);
  tDateProfile.cellRows = buildCellRows(tDateProfile, dateEnv);
  tDateProfile.slotsPerLabel = wholeDivideDurations(tDateProfile.labelInterval, tDateProfile.slotDuration);
  return tDateProfile;
}
function normalizeDate(date, tDateProfile, dateEnv) {
  let normalDate = date;
  if (!tDateProfile.isTimeScale) {
    normalDate = startOfDay(normalDate);
    if (tDateProfile.largeUnit) {
      normalDate = dateEnv.startOf(normalDate, tDateProfile.largeUnit);
    }
  }
  return normalDate;
}
function normalizeRange(range, tDateProfile, dateEnv) {
  if (!tDateProfile.isTimeScale) {
    range = computeVisibleDayRange(range);
    if (tDateProfile.largeUnit) {
      let dayRange = range;
      range = {
        start: dateEnv.startOf(range.start, tDateProfile.largeUnit),
        end: dateEnv.startOf(range.end, tDateProfile.largeUnit)
      };
      if (range.end.valueOf() !== dayRange.end.valueOf() || range.end <= range.start) {
        range = {
          start: range.start,
          end: dateEnv.add(range.end, tDateProfile.slotDuration)
        };
      }
    }
  }
  return range;
}
function isValidDate2(date, tDateProfile, dateProfile, dateProfileGenerator) {
  if (dateProfileGenerator.isHiddenDay(date)) {
    return false;
  }
  if (tDateProfile.isTimeScale) {
    let day = startOfDay(date);
    let timeMs = date.valueOf() - day.valueOf();
    let ms = timeMs - asRoughMs(dateProfile.slotMinTime);
    ms = (ms % 864e5 + 864e5) % 864e5;
    return ms < tDateProfile.timeWindowMs;
  }
  return true;
}
function validateLabelAndSlot(tDateProfile, dateProfile, dateEnv) {
  const { currentRange } = dateProfile;
  if (tDateProfile.labelInterval) {
    const labelCnt = dateEnv.countDurationsBetween(currentRange.start, currentRange.end, tDateProfile.labelInterval);
    if (labelCnt > config.MAX_TIMELINE_SLOTS) {
      console.warn("slotLabelInterval results in too many cells");
      tDateProfile.labelInterval = null;
    }
  }
  if (tDateProfile.slotDuration) {
    const slotCnt = dateEnv.countDurationsBetween(currentRange.start, currentRange.end, tDateProfile.slotDuration);
    if (slotCnt > config.MAX_TIMELINE_SLOTS) {
      console.warn("slotDuration results in too many cells");
      tDateProfile.slotDuration = null;
    }
  }
  if (tDateProfile.labelInterval && tDateProfile.slotDuration) {
    const slotsPerLabel = wholeDivideDurations(tDateProfile.labelInterval, tDateProfile.slotDuration);
    if (slotsPerLabel === null || slotsPerLabel < 1) {
      console.warn("slotLabelInterval must be a multiple of slotDuration");
      tDateProfile.slotDuration = null;
    }
  }
}
function ensureLabelInterval(tDateProfile, dateProfile, dateEnv) {
  const { currentRange } = dateProfile;
  let { labelInterval } = tDateProfile;
  if (!labelInterval) {
    let input;
    if (tDateProfile.slotDuration) {
      for (input of STOCK_SUB_DURATIONS) {
        const tryLabelInterval = createDuration(input);
        const slotsPerLabel = wholeDivideDurations(tryLabelInterval, tDateProfile.slotDuration);
        if (slotsPerLabel !== null && slotsPerLabel <= MAX_AUTO_SLOTS_PER_LABEL) {
          labelInterval = tryLabelInterval;
          break;
        }
      }
      if (!labelInterval) {
        labelInterval = tDateProfile.slotDuration;
      }
    } else {
      for (input of STOCK_SUB_DURATIONS) {
        labelInterval = createDuration(input);
        const labelCnt = dateEnv.countDurationsBetween(currentRange.start, currentRange.end, labelInterval);
        if (labelCnt >= MIN_AUTO_LABELS) {
          break;
        }
      }
    }
    tDateProfile.labelInterval = labelInterval;
  }
  return labelInterval;
}
function ensureSlotDuration(tDateProfile, dateProfile, dateEnv) {
  const { currentRange } = dateProfile;
  let { slotDuration } = tDateProfile;
  if (!slotDuration) {
    const labelInterval = ensureLabelInterval(tDateProfile, dateProfile, dateEnv);
    for (let input of STOCK_SUB_DURATIONS) {
      const trySlotDuration = createDuration(input);
      const slotsPerLabel = wholeDivideDurations(labelInterval, trySlotDuration);
      if (slotsPerLabel !== null && slotsPerLabel > 1 && slotsPerLabel <= MAX_AUTO_SLOTS_PER_LABEL) {
        slotDuration = trySlotDuration;
        break;
      }
    }
    if (slotDuration) {
      const slotCnt = dateEnv.countDurationsBetween(currentRange.start, currentRange.end, slotDuration);
      if (slotCnt > MAX_AUTO_CELLS) {
        slotDuration = null;
      }
    }
    if (!slotDuration) {
      slotDuration = labelInterval;
    }
    tDateProfile.slotDuration = slotDuration;
  }
  return slotDuration;
}
function computeHeaderFormats(tDateProfile, dateProfile, dateEnv, allOptions) {
  let format1;
  let format2;
  const { labelInterval } = tDateProfile;
  let unit = greatestDurationDenominator(labelInterval).unit;
  const weekNumbersVisible = allOptions.weekNumbers;
  let format0 = format1 = format2 = null;
  if (unit === "week" && !weekNumbersVisible) {
    unit = "day";
  }
  switch (unit) {
    case "year":
      format0 = { year: "numeric" };
      break;
    case "month":
      if (currentRangeAs("years", dateProfile, dateEnv) > 1) {
        format0 = { year: "numeric" };
      }
      format1 = { month: "short" };
      break;
    case "week":
      if (currentRangeAs("years", dateProfile, dateEnv) > 1) {
        format0 = { year: "numeric" };
      }
      format1 = { week: "narrow" };
      break;
    case "day":
      if (currentRangeAs("years", dateProfile, dateEnv) > 1) {
        format0 = { year: "numeric", month: "long" };
      } else if (currentRangeAs("months", dateProfile, dateEnv) > 1) {
        format0 = { month: "long" };
      }
      if (weekNumbersVisible) {
        format1 = { week: "short" };
      }
      format2 = { weekday: "narrow", day: "numeric" };
      break;
    case "hour":
      if (weekNumbersVisible) {
        format0 = { week: "short" };
      }
      if (currentRangeAs("days", dateProfile, dateEnv) > 1) {
        format1 = { weekday: "short", day: "numeric", month: "numeric", omitCommas: true };
      }
      format2 = {
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: true,
        meridiem: "short"
      };
      break;
    case "minute":
      if (asRoughMinutes(labelInterval) / 60 >= MAX_AUTO_SLOTS_PER_LABEL) {
        format0 = {
          hour: "numeric",
          meridiem: "short"
        };
        format1 = (params) => ":" + padStart(params.date.minute, 2);
      } else {
        format0 = {
          hour: "numeric",
          minute: "numeric",
          meridiem: "short"
        };
      }
      break;
    case "second":
      if (asRoughSeconds(labelInterval) / 60 >= MAX_AUTO_SLOTS_PER_LABEL) {
        format0 = { hour: "numeric", minute: "2-digit", meridiem: "lowercase" };
        format1 = (params) => ":" + padStart(params.date.second, 2);
      } else {
        format0 = { hour: "numeric", minute: "2-digit", second: "2-digit", meridiem: "lowercase" };
      }
      break;
    case "millisecond":
      format0 = { hour: "numeric", minute: "2-digit", second: "2-digit", meridiem: "lowercase" };
      format1 = (params) => "." + padStart(params.millisecond, 3);
      break;
  }
  return [].concat(format0 || [], format1 || [], format2 || []);
}
function currentRangeAs(unit, dateProfile, dateEnv) {
  let range = dateProfile.currentRange;
  let res = null;
  if (unit === "years") {
    res = dateEnv.diffWholeYears(range.start, range.end);
  } else if (unit === "months") {
    res = dateEnv.diffWholeMonths(range.start, range.end);
  } else if (unit === "weeks") {
    res = dateEnv.diffWholeMonths(range.start, range.end);
  } else if (unit === "days") {
    res = diffWholeDays(range.start, range.end);
  }
  return res || 0;
}
function buildIsWeekStarts(tDateProfile, dateEnv) {
  let { slotDates, emphasizeWeeks } = tDateProfile;
  let prevWeekNumber = null;
  let isWeekStarts = [];
  for (let slotDate of slotDates) {
    let weekNumber = dateEnv.computeWeekNumber(slotDate);
    let isWeekStart = emphasizeWeeks && prevWeekNumber !== null && prevWeekNumber !== weekNumber;
    prevWeekNumber = weekNumber;
    isWeekStarts.push(isWeekStart);
  }
  return isWeekStarts;
}
function buildCellRows(tDateProfile, dateEnv) {
  let slotDates = tDateProfile.slotDates;
  let formats = tDateProfile.headerFormats;
  let cellRows = formats.map(() => []);
  let slotAsDays = asCleanDays(tDateProfile.slotDuration);
  let guessedSlotUnit = slotAsDays === 7 ? "week" : slotAsDays === 1 ? "day" : null;
  let rowUnitsFromFormats = formats.map((format) => format.getSmallestUnit ? format.getSmallestUnit() : null);
  for (let i = 0; i < slotDates.length; i += 1) {
    let date = slotDates[i];
    let isWeekStart = tDateProfile.isWeekStarts[i];
    for (let row = 0; row < formats.length; row += 1) {
      let format = formats[row];
      let rowCells = cellRows[row];
      let leadingCell = rowCells[rowCells.length - 1];
      let isLastRow = row === formats.length - 1;
      let isSuperRow = formats.length > 1 && !isLastRow;
      let newCell = null;
      let rowUnit = rowUnitsFromFormats[row] || (isLastRow ? guessedSlotUnit : null);
      if (isSuperRow) {
        let text = dateEnv.format(date, format);
        if (!leadingCell || leadingCell.text !== text) {
          newCell = buildCellObject(date, text, rowUnit);
        } else {
          leadingCell.colspan += 1;
        }
      } else if (!leadingCell || isInt(dateEnv.countDurationsBetween(tDateProfile.normalizedRange.start, date, tDateProfile.labelInterval))) {
        let text = dateEnv.format(date, format);
        newCell = buildCellObject(date, text, rowUnit);
      } else {
        leadingCell.colspan += 1;
      }
      if (newCell) {
        newCell.weekStart = isWeekStart;
        rowCells.push(newCell);
      }
    }
  }
  return cellRows;
}
function buildCellObject(date, text, rowUnit) {
  return { date, text, rowUnit, colspan: 1, isWeekStart: false };
}
var TimelineHeaderTh = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.refineRenderProps = memoizeObjArg(refineRenderProps);
    this.buildCellNavLinkAttrs = memoize(buildCellNavLinkAttrs);
  }
  render() {
    let { props, context } = this;
    let { dateEnv, options } = context;
    let { cell, dateProfile, tDateProfile } = props;
    let dateMeta = getDateMeta(cell.date, props.todayRange, props.nowDate, dateProfile);
    let renderProps = this.refineRenderProps({
      level: props.rowLevel,
      dateMarker: cell.date,
      text: cell.text,
      dateEnv: context.dateEnv,
      viewApi: context.viewApi
    });
    return y(ContentContainer, { elTag: "th", elClasses: [
      "fc-timeline-slot",
      "fc-timeline-slot-label",
      cell.isWeekStart && "fc-timeline-slot-em",
      ...// TODO: so slot classnames for week/month/bigger. see note above about rowUnit
      cell.rowUnit === "time" ? getSlotClassNames(dateMeta, context.theme) : getDayClassNames(dateMeta, context.theme)
    ], elAttrs: {
      colSpan: cell.colspan,
      "data-date": dateEnv.formatIso(cell.date, {
        omitTime: !tDateProfile.isTimeScale,
        omitTimeZoneOffset: true
      })
    }, renderProps, generatorName: "slotLabelContent", customGenerator: options.slotLabelContent, defaultGenerator: renderInnerContent, classNameGenerator: options.slotLabelClassNames, didMount: options.slotLabelDidMount, willUnmount: options.slotLabelWillUnmount }, (InnerContent) => y(
      "div",
      { className: "fc-timeline-slot-frame", style: { height: props.rowInnerHeight } },
      y(InnerContent, { elTag: "a", elClasses: [
        "fc-timeline-slot-cushion",
        "fc-scrollgrid-sync-inner",
        props.isSticky && "fc-sticky"
      ], elAttrs: this.buildCellNavLinkAttrs(context, cell.date, cell.rowUnit) })
    ));
  }
};
function buildCellNavLinkAttrs(context, cellDate, rowUnit) {
  return rowUnit && rowUnit !== "time" ? buildNavLinkAttrs(context, cellDate, rowUnit) : {};
}
function renderInnerContent(renderProps) {
  return renderProps.text;
}
function refineRenderProps(input) {
  return {
    level: input.level,
    date: input.dateEnv.toDate(input.dateMarker),
    view: input.viewApi,
    text: input.text
  };
}
var TimelineHeaderRows = class extends BaseComponent {
  render() {
    let { dateProfile, tDateProfile, rowInnerHeights, todayRange, nowDate } = this.props;
    let { cellRows } = tDateProfile;
    return y(_, null, cellRows.map((rowCells, rowLevel) => {
      let isLast = rowLevel === cellRows.length - 1;
      let isChrono = tDateProfile.isTimeScale && isLast;
      let classNames = [
        "fc-timeline-header-row",
        isChrono ? "fc-timeline-header-row-chrono" : ""
      ];
      return (
        // eslint-disable-next-line react/no-array-index-key
        y("tr", { key: rowLevel, className: classNames.join(" ") }, rowCells.map((cell) => y(TimelineHeaderTh, { key: cell.date.toISOString(), cell, rowLevel, dateProfile, tDateProfile, todayRange, nowDate, rowInnerHeight: rowInnerHeights && rowInnerHeights[rowLevel], isSticky: !isLast })))
      );
    }));
  }
};
var TimelineCoords = class {
  constructor(slatRootEl, slatEls, dateProfile, tDateProfile, dateEnv, isRtl) {
    this.slatRootEl = slatRootEl;
    this.dateProfile = dateProfile;
    this.tDateProfile = tDateProfile;
    this.dateEnv = dateEnv;
    this.isRtl = isRtl;
    this.outerCoordCache = new PositionCache(
      slatRootEl,
      slatEls,
      true,
      // isHorizontal
      false
    );
    this.innerCoordCache = new PositionCache(
      slatRootEl,
      findDirectChildren(slatEls, "div"),
      true,
      // isHorizontal
      false
    );
  }
  isDateInRange(date) {
    return rangeContainsMarker(this.dateProfile.currentRange, date);
  }
  // results range from negative width of area to 0
  dateToCoord(date) {
    let { tDateProfile } = this;
    let snapCoverage = this.computeDateSnapCoverage(date);
    let slotCoverage = snapCoverage / tDateProfile.snapsPerSlot;
    let slotIndex = Math.floor(slotCoverage);
    slotIndex = Math.min(slotIndex, tDateProfile.slotCnt - 1);
    let partial = slotCoverage - slotIndex;
    let { innerCoordCache, outerCoordCache } = this;
    if (this.isRtl) {
      return outerCoordCache.originClientRect.width - (outerCoordCache.rights[slotIndex] - innerCoordCache.getWidth(slotIndex) * partial);
    }
    return outerCoordCache.lefts[slotIndex] + innerCoordCache.getWidth(slotIndex) * partial;
  }
  rangeToCoords(range) {
    return {
      start: this.dateToCoord(range.start),
      end: this.dateToCoord(range.end)
    };
  }
  durationToCoord(duration) {
    let { dateProfile, tDateProfile, dateEnv, isRtl } = this;
    let coord = 0;
    if (dateProfile) {
      let date = dateEnv.add(dateProfile.activeRange.start, duration);
      if (!tDateProfile.isTimeScale) {
        date = startOfDay(date);
      }
      coord = this.dateToCoord(date);
      if (!isRtl && coord) {
        coord += 1;
      }
    }
    return coord;
  }
  coordFromLeft(coord) {
    if (this.isRtl) {
      return this.outerCoordCache.originClientRect.width - coord;
    }
    return coord;
  }
  // returned value is between 0 and the number of snaps
  computeDateSnapCoverage(date) {
    return computeDateSnapCoverage(date, this.tDateProfile, this.dateEnv);
  }
};
function computeDateSnapCoverage(date, tDateProfile, dateEnv) {
  let snapDiff = dateEnv.countDurationsBetween(tDateProfile.normalizedRange.start, date, tDateProfile.snapDuration);
  if (snapDiff < 0) {
    return 0;
  }
  if (snapDiff >= tDateProfile.snapDiffToIndex.length) {
    return tDateProfile.snapCnt;
  }
  let snapDiffInt = Math.floor(snapDiff);
  let snapCoverage = tDateProfile.snapDiffToIndex[snapDiffInt];
  if (isInt(snapCoverage)) {
    snapCoverage += snapDiff - snapDiffInt;
  } else {
    snapCoverage = Math.ceil(snapCoverage);
  }
  return snapCoverage;
}
function coordToCss(hcoord, isRtl) {
  if (hcoord === null) {
    return { left: "", right: "" };
  }
  if (isRtl) {
    return { right: hcoord, left: "" };
  }
  return { left: hcoord, right: "" };
}
function coordsToCss(hcoords, isRtl) {
  if (!hcoords) {
    return { left: "", right: "" };
  }
  if (isRtl) {
    return { right: hcoords.start, left: -hcoords.end };
  }
  return { left: hcoords.start, right: -hcoords.end };
}
var TimelineHeader = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.rootElRef = d();
  }
  render() {
    let { props, context } = this;
    let timerUnit = greatestDurationDenominator(props.tDateProfile.slotDuration).unit;
    let slatCoords = props.slatCoords && props.slatCoords.dateProfile === props.dateProfile ? props.slatCoords : null;
    return y(NowTimer, { unit: timerUnit }, (nowDate, todayRange) => y(
      "div",
      { className: "fc-timeline-header", ref: this.rootElRef },
      y(
        "table",
        { "aria-hidden": true, className: "fc-scrollgrid-sync-table", style: { minWidth: props.tableMinWidth, width: props.clientWidth } },
        props.tableColGroupNode,
        y(
          "tbody",
          null,
          y(TimelineHeaderRows, { dateProfile: props.dateProfile, tDateProfile: props.tDateProfile, nowDate, todayRange, rowInnerHeights: props.rowInnerHeights })
        )
      ),
      context.options.nowIndicator && // need to have a container regardless of whether the current view has a visible now indicator
      // because apparently removal of the element resets the scroll for some reasons (issue #5351).
      // this issue doesn't happen for the timeline body however (
      y("div", { className: "fc-timeline-now-indicator-container" }, slatCoords && slatCoords.isDateInRange(nowDate) && y(NowIndicatorContainer, { elClasses: ["fc-timeline-now-indicator-arrow"], elStyle: coordToCss(slatCoords.dateToCoord(nowDate), context.isRtl), isAxis: true, date: nowDate }))
    ));
  }
  componentDidMount() {
    this.updateSize();
  }
  componentDidUpdate() {
    this.updateSize();
  }
  updateSize() {
    if (this.props.onMaxCushionWidth) {
      this.props.onMaxCushionWidth(this.computeMaxCushionWidth());
    }
  }
  computeMaxCushionWidth() {
    return Math.max(...findElements(this.rootElRef.current, ".fc-timeline-header-row:last-child .fc-timeline-slot-cushion").map((el) => el.getBoundingClientRect().width));
  }
};
var TimelineSlatCell = class extends BaseComponent {
  render() {
    let { props, context } = this;
    let { dateEnv, options, theme } = context;
    let { date, tDateProfile, isEm } = props;
    let dateMeta = getDateMeta(props.date, props.todayRange, props.nowDate, props.dateProfile);
    let renderProps = Object.assign(Object.assign({ date: dateEnv.toDate(props.date) }, dateMeta), { view: context.viewApi });
    return y(ContentContainer, { elTag: "td", elRef: props.elRef, elClasses: [
      "fc-timeline-slot",
      "fc-timeline-slot-lane",
      isEm && "fc-timeline-slot-em",
      tDateProfile.isTimeScale ? isInt(dateEnv.countDurationsBetween(tDateProfile.normalizedRange.start, props.date, tDateProfile.labelInterval)) ? "fc-timeline-slot-major" : "fc-timeline-slot-minor" : "",
      ...props.isDay ? getDayClassNames(dateMeta, theme) : getSlotClassNames(dateMeta, theme)
    ], elAttrs: {
      "data-date": dateEnv.formatIso(date, {
        omitTimeZoneOffset: true,
        omitTime: !tDateProfile.isTimeScale
      })
    }, renderProps, generatorName: "slotLaneContent", customGenerator: options.slotLaneContent, classNameGenerator: options.slotLaneClassNames, didMount: options.slotLaneDidMount, willUnmount: options.slotLaneWillUnmount }, (InnerContent) => y(InnerContent, { elTag: "div" }));
  }
};
var TimelineSlatsBody = class extends BaseComponent {
  render() {
    let { props } = this;
    let { tDateProfile, cellElRefs } = props;
    let { slotDates, isWeekStarts } = tDateProfile;
    let isDay = !tDateProfile.isTimeScale && !tDateProfile.largeUnit;
    return y(
      "tbody",
      null,
      y("tr", null, slotDates.map((slotDate, i) => {
        let key = slotDate.toISOString();
        return y(TimelineSlatCell, { key, elRef: cellElRefs.createRef(key), date: slotDate, dateProfile: props.dateProfile, tDateProfile, nowDate: props.nowDate, todayRange: props.todayRange, isEm: isWeekStarts[i], isDay });
      }))
    );
  }
};
var TimelineSlats = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.rootElRef = d();
    this.cellElRefs = new RefMap();
    this.handleScrollRequest = (request) => {
      let { onScrollLeftRequest } = this.props;
      let { coords } = this;
      if (onScrollLeftRequest && coords) {
        if (request.time) {
          let scrollLeft = coords.coordFromLeft(coords.durationToCoord(request.time));
          onScrollLeftRequest(scrollLeft);
        }
        return true;
      }
      return null;
    };
  }
  render() {
    let { props, context } = this;
    return y(
      "div",
      { className: "fc-timeline-slots", ref: this.rootElRef },
      y(
        "table",
        { "aria-hidden": true, className: context.theme.getClass("table"), style: {
          minWidth: props.tableMinWidth,
          width: props.clientWidth
        } },
        props.tableColGroupNode,
        y(TimelineSlatsBody, { cellElRefs: this.cellElRefs, dateProfile: props.dateProfile, tDateProfile: props.tDateProfile, nowDate: props.nowDate, todayRange: props.todayRange })
      )
    );
  }
  componentDidMount() {
    this.updateSizing();
    this.scrollResponder = this.context.createScrollResponder(this.handleScrollRequest);
  }
  componentDidUpdate(prevProps) {
    this.updateSizing();
    this.scrollResponder.update(prevProps.dateProfile !== this.props.dateProfile);
  }
  componentWillUnmount() {
    this.scrollResponder.detach();
    if (this.props.onCoords) {
      this.props.onCoords(null);
    }
  }
  updateSizing() {
    let { props, context } = this;
    if (props.clientWidth !== null && // is sizing stable?
    this.scrollResponder) {
      let rootEl = this.rootElRef.current;
      if (rootEl.offsetWidth) {
        this.coords = new TimelineCoords(this.rootElRef.current, collectCellEls(this.cellElRefs.currentMap, props.tDateProfile.slotDates), props.dateProfile, props.tDateProfile, context.dateEnv, context.isRtl);
        if (props.onCoords) {
          props.onCoords(this.coords);
        }
        this.scrollResponder.update(false);
      }
    }
  }
  positionToHit(leftPosition) {
    let { outerCoordCache } = this.coords;
    let { dateEnv, isRtl } = this.context;
    let { tDateProfile } = this.props;
    let slatIndex = outerCoordCache.leftToIndex(leftPosition);
    if (slatIndex != null) {
      let slatWidth = outerCoordCache.getWidth(slatIndex);
      let partial = isRtl ? (outerCoordCache.rights[slatIndex] - leftPosition) / slatWidth : (leftPosition - outerCoordCache.lefts[slatIndex]) / slatWidth;
      let localSnapIndex = Math.floor(partial * tDateProfile.snapsPerSlot);
      let start = dateEnv.add(tDateProfile.slotDates[slatIndex], multiplyDuration(tDateProfile.snapDuration, localSnapIndex));
      let end = dateEnv.add(start, tDateProfile.snapDuration);
      return {
        dateSpan: {
          range: { start, end },
          allDay: !this.props.tDateProfile.isTimeScale
        },
        dayEl: this.cellElRefs.currentMap[slatIndex],
        left: outerCoordCache.lefts[slatIndex],
        right: outerCoordCache.rights[slatIndex]
      };
    }
    return null;
  }
};
function collectCellEls(elMap, slotDates) {
  return slotDates.map((slotDate) => {
    let key = slotDate.toISOString();
    return elMap[key];
  });
}
function computeSegHCoords(segs, minWidth, timelineCoords) {
  let hcoords = [];
  if (timelineCoords) {
    for (let seg of segs) {
      let res = timelineCoords.rangeToCoords(seg);
      let start = Math.round(res.start);
      let end = Math.round(res.end);
      if (end - start < minWidth) {
        end = start + minWidth;
      }
      hcoords.push({ start, end });
    }
  }
  return hcoords;
}
function computeFgSegPlacements(segs, segHCoords, eventInstanceHeights, moreLinkHeights, strictOrder, maxStackCnt) {
  let segInputs = [];
  let crudePlacements = [];
  for (let i = 0; i < segs.length; i += 1) {
    let seg = segs[i];
    let instanceId = seg.eventRange.instance.instanceId;
    let height = eventInstanceHeights[instanceId];
    let hcoords = segHCoords[i];
    if (height && hcoords) {
      segInputs.push({
        index: i,
        span: hcoords,
        thickness: height
      });
    } else {
      crudePlacements.push({
        seg,
        hcoords,
        top: null
      });
    }
  }
  let hierarchy = new SegHierarchy();
  if (strictOrder != null) {
    hierarchy.strictOrder = strictOrder;
  }
  if (maxStackCnt != null) {
    hierarchy.maxStackCnt = maxStackCnt;
  }
  let hiddenEntries = hierarchy.addSegs(segInputs);
  let hiddenPlacements = hiddenEntries.map((entry) => ({
    seg: segs[entry.index],
    hcoords: entry.span,
    top: null
  }));
  let hiddenGroups = groupIntersectingEntries(hiddenEntries);
  let moreLinkInputs = [];
  let moreLinkCrudePlacements = [];
  const extractSeg = (entry) => segs[entry.index];
  for (let i = 0; i < hiddenGroups.length; i += 1) {
    let hiddenGroup = hiddenGroups[i];
    let sortedSegs = hiddenGroup.entries.map(extractSeg);
    let height = moreLinkHeights[buildIsoString(computeEarliestSegStart(sortedSegs))];
    if (height != null) {
      moreLinkInputs.push({
        index: segs.length + i,
        thickness: height,
        span: hiddenGroup.span
      });
    } else {
      moreLinkCrudePlacements.push({
        seg: sortedSegs,
        hcoords: hiddenGroup.span,
        top: null
      });
    }
  }
  hierarchy.maxStackCnt = -1;
  hierarchy.addSegs(moreLinkInputs);
  let visibleRects = hierarchy.toRects();
  let visiblePlacements = [];
  let maxHeight = 0;
  for (let rect of visibleRects) {
    let segIndex = rect.index;
    visiblePlacements.push({
      seg: segIndex < segs.length ? segs[segIndex] : hiddenGroups[segIndex - segs.length].entries.map(extractSeg),
      hcoords: rect.span,
      top: rect.levelCoord
    });
    maxHeight = Math.max(maxHeight, rect.levelCoord + rect.thickness);
  }
  return [
    visiblePlacements.concat(crudePlacements, hiddenPlacements, moreLinkCrudePlacements),
    maxHeight
  ];
}
var TimelineLaneBg = class extends BaseComponent {
  render() {
    let { props } = this;
    let highlightSeg = [].concat(props.eventResizeSegs, props.dateSelectionSegs);
    return props.timelineCoords && y(
      "div",
      { className: "fc-timeline-bg" },
      this.renderSegs(props.businessHourSegs || [], props.timelineCoords, "non-business"),
      this.renderSegs(props.bgEventSegs || [], props.timelineCoords, "bg-event"),
      this.renderSegs(highlightSeg, props.timelineCoords, "highlight")
    );
  }
  renderSegs(segs, timelineCoords, fillType) {
    let { todayRange, nowDate } = this.props;
    let { isRtl } = this.context;
    let segHCoords = computeSegHCoords(segs, 0, timelineCoords);
    let children = segs.map((seg, i) => {
      let hcoords = segHCoords[i];
      let hStyle = coordsToCss(hcoords, isRtl);
      return y("div", { key: buildEventRangeKey(seg.eventRange), className: "fc-timeline-bg-harness", style: hStyle }, fillType === "bg-event" ? y(BgEvent, Object.assign({ seg }, getSegMeta(seg, todayRange, nowDate))) : renderFill(fillType));
    });
    return y(_, null, children);
  }
};
var TimelineLaneSlicer = class extends Slicer {
  sliceRange(origRange, dateProfile, dateProfileGenerator, tDateProfile, dateEnv) {
    let normalRange = normalizeRange(origRange, tDateProfile, dateEnv);
    let segs = [];
    if (computeDateSnapCoverage(normalRange.start, tDateProfile, dateEnv) < computeDateSnapCoverage(normalRange.end, tDateProfile, dateEnv)) {
      let slicedRange = intersectRanges(normalRange, tDateProfile.normalizedRange);
      if (slicedRange) {
        segs.push({
          start: slicedRange.start,
          end: slicedRange.end,
          isStart: slicedRange.start.valueOf() === normalRange.start.valueOf() && isValidDate2(slicedRange.start, tDateProfile, dateProfile, dateProfileGenerator),
          isEnd: slicedRange.end.valueOf() === normalRange.end.valueOf() && isValidDate2(addMs(slicedRange.end, -1), tDateProfile, dateProfile, dateProfileGenerator)
        });
      }
    }
    return segs;
  }
};
var DEFAULT_TIME_FORMAT = createFormatter({
  hour: "numeric",
  minute: "2-digit",
  omitZeroMinute: true,
  meridiem: "narrow"
});
var TimelineEvent = class extends BaseComponent {
  render() {
    let { props } = this;
    return y(StandardEvent, Object.assign({}, props, { elClasses: ["fc-timeline-event", "fc-h-event"], defaultTimeFormat: DEFAULT_TIME_FORMAT, defaultDisplayEventTime: !props.isTimeScale }));
  }
};
var TimelineLaneMoreLink = class extends BaseComponent {
  render() {
    let { props, context } = this;
    let { hiddenSegs, placement, resourceId } = props;
    let { top, hcoords } = placement;
    let isVisible = hcoords && top !== null;
    let hStyle = coordsToCss(hcoords, context.isRtl);
    let extraDateSpan = resourceId ? { resourceId } : {};
    return y(MoreLinkContainer, { elRef: props.elRef, elClasses: ["fc-timeline-more-link"], elStyle: Object.assign({ visibility: isVisible ? "" : "hidden", top: top || 0 }, hStyle), allDayDate: null, moreCnt: hiddenSegs.length, allSegs: hiddenSegs, hiddenSegs, dateProfile: props.dateProfile, todayRange: props.todayRange, extraDateSpan, popoverContent: () => y(_, null, hiddenSegs.map((seg) => {
      let instanceId = seg.eventRange.instance.instanceId;
      return y(
        "div",
        { key: instanceId, style: { visibility: props.isForcedInvisible[instanceId] ? "hidden" : "" } },
        y(TimelineEvent, Object.assign({ isTimeScale: props.isTimeScale, seg, isDragging: false, isResizing: false, isDateSelecting: false, isSelected: instanceId === props.eventSelection }, getSegMeta(seg, props.todayRange, props.nowDate)))
      );
    })) }, (InnerContent) => y(InnerContent, { elTag: "div", elClasses: ["fc-timeline-more-link-inner", "fc-sticky"] }));
  }
};
var TimelineLane = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.slicer = new TimelineLaneSlicer();
    this.sortEventSegs = memoize(sortEventSegs);
    this.harnessElRefs = new RefMap();
    this.moreElRefs = new RefMap();
    this.innerElRef = d();
    this.state = {
      eventInstanceHeights: {},
      moreLinkHeights: {}
    };
    this.handleResize = (isForced) => {
      if (isForced) {
        this.updateSize();
      }
    };
  }
  render() {
    let { props, state, context } = this;
    let { options } = context;
    let { dateProfile, tDateProfile } = props;
    let slicedProps = this.slicer.sliceProps(
      props,
      dateProfile,
      tDateProfile.isTimeScale ? null : props.nextDayThreshold,
      context,
      // wish we didn't have to pass in the rest of the args...
      dateProfile,
      context.dateProfileGenerator,
      tDateProfile,
      context.dateEnv
    );
    let mirrorSegs = (slicedProps.eventDrag ? slicedProps.eventDrag.segs : null) || (slicedProps.eventResize ? slicedProps.eventResize.segs : null) || [];
    let fgSegs = this.sortEventSegs(slicedProps.fgEventSegs, options.eventOrder);
    let fgSegHCoords = computeSegHCoords(fgSegs, options.eventMinWidth, props.timelineCoords);
    let [fgPlacements, fgHeight] = computeFgSegPlacements(fgSegs, fgSegHCoords, state.eventInstanceHeights, state.moreLinkHeights, options.eventOrderStrict, options.eventMaxStack);
    let isForcedInvisible = (
      // TODO: more convenient
      (slicedProps.eventDrag ? slicedProps.eventDrag.affectedInstances : null) || (slicedProps.eventResize ? slicedProps.eventResize.affectedInstances : null) || {}
    );
    return y(
      _,
      null,
      y(TimelineLaneBg, { businessHourSegs: slicedProps.businessHourSegs, bgEventSegs: slicedProps.bgEventSegs, timelineCoords: props.timelineCoords, eventResizeSegs: slicedProps.eventResize ? slicedProps.eventResize.segs : [], dateSelectionSegs: slicedProps.dateSelectionSegs, nowDate: props.nowDate, todayRange: props.todayRange }),
      y(
        "div",
        { className: "fc-timeline-events fc-scrollgrid-sync-inner", ref: this.innerElRef, style: { height: fgHeight } },
        this.renderFgSegs(fgPlacements, isForcedInvisible, false, false, false),
        this.renderFgSegs(buildMirrorPlacements(mirrorSegs, props.timelineCoords, fgPlacements), {}, Boolean(slicedProps.eventDrag), Boolean(slicedProps.eventResize), false)
      )
    );
  }
  componentDidMount() {
    this.updateSize();
    this.context.addResizeHandler(this.handleResize);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.eventStore !== this.props.eventStore || // external thing changed?
    prevProps.timelineCoords !== this.props.timelineCoords || // external thing changed?
    prevState.moreLinkHeights !== this.state.moreLinkHeights) {
      this.updateSize();
    }
  }
  componentWillUnmount() {
    this.context.removeResizeHandler(this.handleResize);
  }
  updateSize() {
    let { props } = this;
    let { timelineCoords } = props;
    const innerEl = this.innerElRef.current;
    if (props.onHeightChange) {
      props.onHeightChange(innerEl, false);
    }
    if (timelineCoords) {
      this.setState({
        eventInstanceHeights: mapHash(this.harnessElRefs.currentMap, (harnessEl) => Math.round(harnessEl.getBoundingClientRect().height)),
        moreLinkHeights: mapHash(this.moreElRefs.currentMap, (moreEl) => Math.round(moreEl.getBoundingClientRect().height))
      }, () => {
        if (props.onHeightChange) {
          props.onHeightChange(innerEl, true);
        }
      });
    }
    if (props.syncParentMinHeight) {
      innerEl.parentElement.style.minHeight = innerEl.style.height;
    }
  }
  renderFgSegs(segPlacements, isForcedInvisible, isDragging, isResizing, isDateSelecting) {
    let { harnessElRefs, moreElRefs, props, context } = this;
    let isMirror = isDragging || isResizing || isDateSelecting;
    return y(_, null, segPlacements.map((segPlacement) => {
      let { seg, hcoords, top } = segPlacement;
      if (Array.isArray(seg)) {
        let isoStr = buildIsoString(computeEarliestSegStart(seg));
        return y(TimelineLaneMoreLink, { key: "m:" + isoStr, elRef: moreElRefs.createRef(isoStr), hiddenSegs: seg, placement: segPlacement, dateProfile: props.dateProfile, nowDate: props.nowDate, todayRange: props.todayRange, isTimeScale: props.tDateProfile.isTimeScale, eventSelection: props.eventSelection, resourceId: props.resourceId, isForcedInvisible });
      }
      let instanceId = seg.eventRange.instance.instanceId;
      let isVisible = isMirror || Boolean(!isForcedInvisible[instanceId] && hcoords && top !== null);
      let hStyle = coordsToCss(hcoords, context.isRtl);
      return y(
        "div",
        { key: "e:" + instanceId, ref: isMirror ? null : harnessElRefs.createRef(instanceId), className: "fc-timeline-event-harness", style: Object.assign({ visibility: isVisible ? "" : "hidden", top: top || 0 }, hStyle) },
        y(TimelineEvent, Object.assign({
          isTimeScale: props.tDateProfile.isTimeScale,
          seg,
          isDragging,
          isResizing,
          isDateSelecting,
          isSelected: instanceId === props.eventSelection
          /* TODO: bad for mirror? */
        }, getSegMeta(seg, props.todayRange, props.nowDate)))
      );
    }));
  }
};
TimelineLane.addStateEquality({
  eventInstanceHeights: isPropsEqual,
  moreLinkHeights: isPropsEqual
});
function buildMirrorPlacements(mirrorSegs, timelineCoords, fgPlacements) {
  if (!mirrorSegs.length || !timelineCoords) {
    return [];
  }
  let topsByInstanceId = buildAbsoluteTopHash(fgPlacements);
  return mirrorSegs.map((seg) => ({
    seg,
    hcoords: timelineCoords.rangeToCoords(seg),
    top: topsByInstanceId[seg.eventRange.instance.instanceId]
  }));
}
function buildAbsoluteTopHash(placements) {
  let topsByInstanceId = {};
  for (let placement of placements) {
    let { seg } = placement;
    if (!Array.isArray(seg)) {
      topsByInstanceId[seg.eventRange.instance.instanceId] = placement.top;
    }
  }
  return topsByInstanceId;
}
var TimelineGrid = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.slatsRef = d();
    this.state = {
      coords: null
    };
    this.handeEl = (el) => {
      if (el) {
        this.context.registerInteractiveComponent(this, { el });
      } else {
        this.context.unregisterInteractiveComponent(this);
      }
    };
    this.handleCoords = (coords) => {
      this.setState({ coords });
      if (this.props.onSlatCoords) {
        this.props.onSlatCoords(coords);
      }
    };
  }
  render() {
    let { props, state, context } = this;
    let { options } = context;
    let { dateProfile, tDateProfile } = props;
    let timerUnit = greatestDurationDenominator(tDateProfile.slotDuration).unit;
    return y(
      "div",
      { className: "fc-timeline-body", ref: this.handeEl, style: {
        minWidth: props.tableMinWidth,
        height: props.clientHeight,
        width: props.clientWidth
      } },
      y(NowTimer, { unit: timerUnit }, (nowDate, todayRange) => y(
        _,
        null,
        y(TimelineSlats, { ref: this.slatsRef, dateProfile, tDateProfile, nowDate, todayRange, clientWidth: props.clientWidth, tableColGroupNode: props.tableColGroupNode, tableMinWidth: props.tableMinWidth, onCoords: this.handleCoords, onScrollLeftRequest: props.onScrollLeftRequest }),
        y(TimelineLane, { dateProfile, tDateProfile: props.tDateProfile, nowDate, todayRange, nextDayThreshold: options.nextDayThreshold, businessHours: props.businessHours, eventStore: props.eventStore, eventUiBases: props.eventUiBases, dateSelection: props.dateSelection, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, timelineCoords: state.coords, syncParentMinHeight: true }),
        options.nowIndicator && state.coords && state.coords.isDateInRange(nowDate) && y(
          "div",
          { className: "fc-timeline-now-indicator-container" },
          y(NowIndicatorContainer, { elClasses: ["fc-timeline-now-indicator-line"], elStyle: coordToCss(state.coords.dateToCoord(nowDate), context.isRtl), isAxis: false, date: nowDate })
        )
      ))
    );
  }
  // Hit System
  // ------------------------------------------------------------------------------------------
  queryHit(positionLeft, positionTop, elWidth, elHeight) {
    let slats = this.slatsRef.current;
    let slatHit = slats.positionToHit(positionLeft);
    if (slatHit) {
      return {
        dateProfile: this.props.dateProfile,
        dateSpan: slatHit.dateSpan,
        rect: {
          left: slatHit.left,
          right: slatHit.right,
          top: 0,
          bottom: elHeight
        },
        dayEl: slatHit.dayEl,
        layer: 0
      };
    }
    return null;
  }
};
var TimelineView = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.buildTimelineDateProfile = memoize(buildTimelineDateProfile);
    this.scrollGridRef = d();
    this.state = {
      slatCoords: null,
      slotCushionMaxWidth: null
    };
    this.handleSlatCoords = (slatCoords) => {
      this.setState({ slatCoords });
    };
    this.handleScrollLeftRequest = (scrollLeft) => {
      let scrollGrid = this.scrollGridRef.current;
      scrollGrid.forceScrollLeft(0, scrollLeft);
    };
    this.handleMaxCushionWidth = (slotCushionMaxWidth) => {
      this.setState({
        slotCushionMaxWidth: Math.ceil(slotCushionMaxWidth)
        // for less rerendering TODO: DRY
      });
    };
  }
  render() {
    let { props, state, context } = this;
    let { options } = context;
    let stickyHeaderDates = !props.forPrint && getStickyHeaderDates(options);
    let stickyFooterScrollbar = !props.forPrint && getStickyFooterScrollbar(options);
    let tDateProfile = this.buildTimelineDateProfile(props.dateProfile, context.dateEnv, options, context.dateProfileGenerator);
    let { slotMinWidth } = options;
    let slatCols = buildSlatCols(tDateProfile, slotMinWidth || this.computeFallbackSlotMinWidth(tDateProfile));
    let sections = [
      {
        type: "header",
        key: "header",
        isSticky: stickyHeaderDates,
        chunks: [{
          key: "timeline",
          content: (contentArg) => y(TimelineHeader, { dateProfile: props.dateProfile, clientWidth: contentArg.clientWidth, clientHeight: contentArg.clientHeight, tableMinWidth: contentArg.tableMinWidth, tableColGroupNode: contentArg.tableColGroupNode, tDateProfile, slatCoords: state.slatCoords, onMaxCushionWidth: slotMinWidth ? null : this.handleMaxCushionWidth })
        }]
      },
      {
        type: "body",
        key: "body",
        liquid: true,
        chunks: [{
          key: "timeline",
          content: (contentArg) => y(TimelineGrid, Object.assign({}, props, { clientWidth: contentArg.clientWidth, clientHeight: contentArg.clientHeight, tableMinWidth: contentArg.tableMinWidth, tableColGroupNode: contentArg.tableColGroupNode, tDateProfile, onSlatCoords: this.handleSlatCoords, onScrollLeftRequest: this.handleScrollLeftRequest }))
        }]
      }
    ];
    if (stickyFooterScrollbar) {
      sections.push({
        type: "footer",
        key: "footer",
        isSticky: true,
        chunks: [{
          key: "timeline",
          content: renderScrollShim
        }]
      });
    }
    return y(
      ViewContainer,
      { elClasses: [
        "fc-timeline",
        options.eventOverlap === false ? "fc-timeline-overlap-disabled" : ""
      ], viewSpec: context.viewSpec },
      y(ScrollGrid, { ref: this.scrollGridRef, liquid: !props.isHeightAuto && !props.forPrint, forPrint: props.forPrint, collapsibleWidth: false, colGroups: [
        { cols: slatCols }
      ], sections })
    );
  }
  computeFallbackSlotMinWidth(tDateProfile) {
    return Math.max(30, (this.state.slotCushionMaxWidth || 0) / tDateProfile.slotsPerLabel);
  }
};
function buildSlatCols(tDateProfile, slotMinWidth) {
  return [{
    span: tDateProfile.slotCnt,
    minWidth: slotMinWidth || 1
    // needs to be a non-zero number to trigger horizontal scrollbars!??????
  }];
}

// ../../../../../../Users/jin/node_modules/@fullcalendar/timeline/index.js
var index2 = createPlugin({
  name: "@fullcalendar/timeline",
  premiumReleaseDate: "2025-04-02",
  deps: [index],
  initialView: "timelineDay",
  views: {
    timeline: {
      component: TimelineView,
      usesMinMaxTime: true,
      eventResizableFromStart: true
      // how is this consumed for TimelineView tho?
    },
    timelineDay: {
      type: "timeline",
      duration: { days: 1 }
    },
    timelineWeek: {
      type: "timeline",
      duration: { weeks: 1 }
    },
    timelineMonth: {
      type: "timeline",
      duration: { months: 1 }
    },
    timelineYear: {
      type: "timeline",
      duration: { years: 1 }
    }
  }
});

// ../../../../../../Users/jin/node_modules/@fullcalendar/resource/internal-common.js
var PRIVATE_ID_PREFIX = "_fc:";
var RESOURCE_REFINERS = {
  id: String,
  parentId: String,
  children: identity,
  title: String,
  businessHours: identity,
  extendedProps: identity,
  // event-ui
  eventEditable: Boolean,
  eventStartEditable: Boolean,
  eventDurationEditable: Boolean,
  eventConstraint: identity,
  eventOverlap: Boolean,
  eventAllow: identity,
  eventClassNames: parseClassNames,
  eventBackgroundColor: String,
  eventBorderColor: String,
  eventTextColor: String,
  eventColor: String
};
function parseResource(raw, parentId = "", store, context) {
  let { refined, extra } = refineProps(raw, RESOURCE_REFINERS);
  let resource = {
    id: refined.id || PRIVATE_ID_PREFIX + guid(),
    parentId: refined.parentId || parentId,
    title: refined.title || "",
    businessHours: refined.businessHours ? parseBusinessHours(refined.businessHours, context) : null,
    ui: createEventUi({
      editable: refined.eventEditable,
      startEditable: refined.eventStartEditable,
      durationEditable: refined.eventDurationEditable,
      constraint: refined.eventConstraint,
      overlap: refined.eventOverlap,
      allow: refined.eventAllow,
      classNames: refined.eventClassNames,
      backgroundColor: refined.eventBackgroundColor,
      borderColor: refined.eventBorderColor,
      textColor: refined.eventTextColor,
      color: refined.eventColor
    }, context),
    extendedProps: Object.assign(Object.assign({}, extra), refined.extendedProps)
  };
  Object.freeze(resource.ui.classNames);
  Object.freeze(resource.extendedProps);
  if (store[resource.id])
    ;
  else {
    store[resource.id] = resource;
    if (refined.children) {
      for (let childInput of refined.children) {
        parseResource(childInput, resource.id, store, context);
      }
    }
  }
  return resource;
}
function getPublicId(id) {
  if (id.indexOf(PRIVATE_ID_PREFIX) === 0) {
    return "";
  }
  return id;
}
var ResourceApi = class _ResourceApi {
  constructor(_context, _resource) {
    this._context = _context;
    this._resource = _resource;
  }
  setProp(name, value) {
    let oldResource = this._resource;
    this._context.dispatch({
      type: "SET_RESOURCE_PROP",
      resourceId: oldResource.id,
      propName: name,
      propValue: value
    });
    this.sync(oldResource);
  }
  setExtendedProp(name, value) {
    let oldResource = this._resource;
    this._context.dispatch({
      type: "SET_RESOURCE_EXTENDED_PROP",
      resourceId: oldResource.id,
      propName: name,
      propValue: value
    });
    this.sync(oldResource);
  }
  sync(oldResource) {
    let context = this._context;
    let resourceId = oldResource.id;
    this._resource = context.getCurrentData().resourceStore[resourceId];
    context.emitter.trigger("resourceChange", {
      oldResource: new _ResourceApi(context, oldResource),
      resource: this,
      revert() {
        context.dispatch({
          type: "ADD_RESOURCE",
          resourceHash: {
            [resourceId]: oldResource
          }
        });
      }
    });
  }
  remove() {
    let context = this._context;
    let internalResource = this._resource;
    let resourceId = internalResource.id;
    context.dispatch({
      type: "REMOVE_RESOURCE",
      resourceId
    });
    context.emitter.trigger("resourceRemove", {
      resource: this,
      revert() {
        context.dispatch({
          type: "ADD_RESOURCE",
          resourceHash: {
            [resourceId]: internalResource
          }
        });
      }
    });
  }
  getParent() {
    let context = this._context;
    let parentId = this._resource.parentId;
    if (parentId) {
      return new _ResourceApi(context, context.getCurrentData().resourceStore[parentId]);
    }
    return null;
  }
  getChildren() {
    let thisResourceId = this._resource.id;
    let context = this._context;
    let { resourceStore } = context.getCurrentData();
    let childApis = [];
    for (let resourceId in resourceStore) {
      if (resourceStore[resourceId].parentId === thisResourceId) {
        childApis.push(new _ResourceApi(context, resourceStore[resourceId]));
      }
    }
    return childApis;
  }
  /*
  this is really inefficient!
  TODO: make EventApi::resourceIds a hash or keep an index in the Calendar's state
  */
  getEvents() {
    let thisResourceId = this._resource.id;
    let context = this._context;
    let { defs: defs2, instances } = context.getCurrentData().eventStore;
    let eventApis = [];
    for (let instanceId in instances) {
      let instance = instances[instanceId];
      let def = defs2[instance.defId];
      if (def.resourceIds.indexOf(thisResourceId) !== -1) {
        eventApis.push(new EventImpl(context, def, instance));
      }
    }
    return eventApis;
  }
  get id() {
    return getPublicId(this._resource.id);
  }
  get title() {
    return this._resource.title;
  }
  get eventConstraint() {
    return this._resource.ui.constraints[0] || null;
  }
  // TODO: better type
  get eventOverlap() {
    return this._resource.ui.overlap;
  }
  get eventAllow() {
    return this._resource.ui.allows[0] || null;
  }
  // TODO: better type
  get eventBackgroundColor() {
    return this._resource.ui.backgroundColor;
  }
  get eventBorderColor() {
    return this._resource.ui.borderColor;
  }
  get eventTextColor() {
    return this._resource.ui.textColor;
  }
  // NOTE: user can't modify these because Object.freeze was called in event-def parsing
  get eventClassNames() {
    return this._resource.ui.classNames;
  }
  get extendedProps() {
    return this._resource.extendedProps;
  }
  toPlainObject(settings = {}) {
    let internal = this._resource;
    let { ui } = internal;
    let publicId = this.id;
    let res = {};
    if (publicId) {
      res.id = publicId;
    }
    if (internal.title) {
      res.title = internal.title;
    }
    if (settings.collapseEventColor && ui.backgroundColor && ui.backgroundColor === ui.borderColor) {
      res.eventColor = ui.backgroundColor;
    } else {
      if (ui.backgroundColor) {
        res.eventBackgroundColor = ui.backgroundColor;
      }
      if (ui.borderColor) {
        res.eventBorderColor = ui.borderColor;
      }
    }
    if (ui.textColor) {
      res.eventTextColor = ui.textColor;
    }
    if (ui.classNames.length) {
      res.eventClassNames = ui.classNames;
    }
    if (Object.keys(internal.extendedProps).length) {
      if (settings.collapseExtendedProps) {
        Object.assign(res, internal.extendedProps);
      } else {
        res.extendedProps = internal.extendedProps;
      }
    }
    return res;
  }
  toJSON() {
    return this.toPlainObject();
  }
};
function buildResourceApis(resourceStore, context) {
  let resourceApis = [];
  for (let resourceId in resourceStore) {
    resourceApis.push(new ResourceApi(context, resourceStore[resourceId]));
  }
  return resourceApis;
}
var ResourceSplitter = class extends Splitter {
  getKeyInfo(props) {
    return Object.assign({ "": {} }, props.resourceStore);
  }
  getKeysForDateSpan(dateSpan) {
    return [dateSpan.resourceId || ""];
  }
  getKeysForEventDef(eventDef) {
    let resourceIds = eventDef.resourceIds;
    if (!resourceIds.length) {
      return [""];
    }
    return resourceIds;
  }
};
var DEFAULT_RESOURCE_ORDER = parseFieldSpecs("id,title");
function handleResourceStore(resourceStore, calendarData) {
  let { emitter } = calendarData;
  if (emitter.hasHandlers("resourcesSet")) {
    emitter.trigger("resourcesSet", buildResourceApis(resourceStore, calendarData));
  }
}
function refineRenderProps$1(input) {
  return {
    resource: new ResourceApi(input.context, input.resource)
  };
}
function buildRowNodes(resourceStore, groupSpecs, orderSpecs, isVGrouping, expansions, expansionDefault) {
  let complexNodes = buildHierarchy(resourceStore, isVGrouping ? -1 : 1, groupSpecs, orderSpecs);
  let flatNodes = [];
  flattenNodes(complexNodes, flatNodes, isVGrouping, [], 0, expansions, expansionDefault);
  return flatNodes;
}
function flattenNodes(complexNodes, res, isVGrouping, rowSpans, depth, expansions, expansionDefault) {
  for (let i = 0; i < complexNodes.length; i += 1) {
    let complexNode = complexNodes[i];
    let group = complexNode.group;
    if (group) {
      if (isVGrouping) {
        let firstRowIndex = res.length;
        let rowSpanIndex = rowSpans.length;
        flattenNodes(complexNode.children, res, isVGrouping, rowSpans.concat(0), depth, expansions, expansionDefault);
        if (firstRowIndex < res.length) {
          let firstRow = res[firstRowIndex];
          let firstRowSpans = firstRow.rowSpans = firstRow.rowSpans.slice();
          firstRowSpans[rowSpanIndex] = res.length - firstRowIndex;
        }
      } else {
        let id = group.spec.field + ":" + group.value;
        let isExpanded = expansions[id] != null ? expansions[id] : expansionDefault;
        res.push({ id, group, isExpanded });
        if (isExpanded) {
          flattenNodes(complexNode.children, res, isVGrouping, rowSpans, depth + 1, expansions, expansionDefault);
        }
      }
    } else if (complexNode.resource) {
      let id = complexNode.resource.id;
      let isExpanded = expansions[id] != null ? expansions[id] : expansionDefault;
      res.push({
        id,
        rowSpans,
        depth,
        isExpanded,
        hasChildren: Boolean(complexNode.children.length),
        resource: complexNode.resource,
        resourceFields: complexNode.resourceFields
      });
      if (isExpanded) {
        flattenNodes(complexNode.children, res, isVGrouping, rowSpans, depth + 1, expansions, expansionDefault);
      }
    }
  }
}
function buildHierarchy(resourceStore, maxDepth, groupSpecs, orderSpecs) {
  let resourceNodes = buildResourceNodes(resourceStore, orderSpecs);
  let builtNodes = [];
  for (let resourceId in resourceNodes) {
    let resourceNode = resourceNodes[resourceId];
    if (!resourceNode.resource.parentId) {
      insertResourceNode(resourceNode, builtNodes, groupSpecs, 0, maxDepth, orderSpecs);
    }
  }
  return builtNodes;
}
function buildResourceNodes(resourceStore, orderSpecs) {
  let nodeHash = {};
  for (let resourceId in resourceStore) {
    let resource = resourceStore[resourceId];
    nodeHash[resourceId] = {
      resource,
      resourceFields: buildResourceFields(resource),
      children: []
    };
  }
  for (let resourceId in resourceStore) {
    let resource = resourceStore[resourceId];
    if (resource.parentId) {
      let parentNode = nodeHash[resource.parentId];
      if (parentNode) {
        insertResourceNodeInSiblings(nodeHash[resourceId], parentNode.children, orderSpecs);
      }
    }
  }
  return nodeHash;
}
function insertResourceNode(resourceNode, nodes, groupSpecs, depth, maxDepth, orderSpecs) {
  if (groupSpecs.length && (maxDepth === -1 || depth <= maxDepth)) {
    let groupNode = ensureGroupNodes(resourceNode, nodes, groupSpecs[0]);
    insertResourceNode(resourceNode, groupNode.children, groupSpecs.slice(1), depth + 1, maxDepth, orderSpecs);
  } else {
    insertResourceNodeInSiblings(resourceNode, nodes, orderSpecs);
  }
}
function ensureGroupNodes(resourceNode, nodes, groupSpec) {
  let groupValue = resourceNode.resourceFields[groupSpec.field];
  let groupNode;
  let newGroupIndex;
  if (groupSpec.order) {
    for (newGroupIndex = 0; newGroupIndex < nodes.length; newGroupIndex += 1) {
      let node = nodes[newGroupIndex];
      if (node.group) {
        let cmp = flexibleCompare(groupValue, node.group.value) * groupSpec.order;
        if (cmp === 0) {
          groupNode = node;
          break;
        } else if (cmp < 0) {
          break;
        }
      }
    }
  } else {
    for (newGroupIndex = 0; newGroupIndex < nodes.length; newGroupIndex += 1) {
      let node = nodes[newGroupIndex];
      if (node.group && groupValue === node.group.value) {
        groupNode = node;
        break;
      }
    }
  }
  if (!groupNode) {
    groupNode = {
      group: {
        value: groupValue,
        spec: groupSpec
      },
      children: []
    };
    nodes.splice(newGroupIndex, 0, groupNode);
  }
  return groupNode;
}
function insertResourceNodeInSiblings(resourceNode, siblings, orderSpecs) {
  let i;
  for (i = 0; i < siblings.length; i += 1) {
    let cmp = compareByFieldSpecs(siblings[i].resourceFields, resourceNode.resourceFields, orderSpecs);
    if (cmp > 0) {
      break;
    }
  }
  siblings.splice(i, 0, resourceNode);
}
function buildResourceFields(resource) {
  let obj = Object.assign(Object.assign(Object.assign({}, resource.extendedProps), resource.ui), resource);
  delete obj.ui;
  delete obj.extendedProps;
  return obj;
}
function isGroupsEqual(group0, group1) {
  return group0.spec === group1.spec && group0.value === group1.value;
}

// ../../../../../../Users/jin/node_modules/@fullcalendar/resource/index.js
function massageEventDragMutation(eventMutation, hit0, hit1) {
  let resource0 = hit0.dateSpan.resourceId;
  let resource1 = hit1.dateSpan.resourceId;
  if (resource0 && resource1 && resource0 !== resource1) {
    eventMutation.resourceMutation = {
      matchResourceId: resource0,
      setResourceId: resource1
    };
  }
}
function applyEventDefMutation(eventDef, mutation, context) {
  let resourceMutation = mutation.resourceMutation;
  if (resourceMutation && computeResourceEditable(eventDef, context)) {
    let index5 = eventDef.resourceIds.indexOf(resourceMutation.matchResourceId);
    if (index5 !== -1) {
      let resourceIds = eventDef.resourceIds.slice();
      resourceIds.splice(index5, 1);
      if (resourceIds.indexOf(resourceMutation.setResourceId) === -1) {
        resourceIds.push(resourceMutation.setResourceId);
      }
      eventDef.resourceIds = resourceIds;
    }
  }
}
function computeResourceEditable(eventDef, context) {
  let { resourceEditable } = eventDef;
  if (resourceEditable == null) {
    let source = eventDef.sourceId && context.getCurrentData().eventSources[eventDef.sourceId];
    if (source) {
      resourceEditable = source.extendedProps.resourceEditable;
    }
    if (resourceEditable == null) {
      resourceEditable = context.options.eventResourceEditable;
      if (resourceEditable == null) {
        resourceEditable = context.options.editable;
      }
    }
  }
  return resourceEditable;
}
function transformEventDrop(mutation, context) {
  let { resourceMutation } = mutation;
  if (resourceMutation) {
    let { calendarApi } = context;
    return {
      oldResource: calendarApi.getResourceById(resourceMutation.matchResourceId),
      newResource: calendarApi.getResourceById(resourceMutation.setResourceId)
    };
  }
  return {
    oldResource: null,
    newResource: null
  };
}
var ResourceDataAdder = class {
  constructor() {
    this.filterResources = memoize(filterResources);
  }
  transform(viewProps, calendarProps) {
    if (calendarProps.viewSpec.optionDefaults.needsResourceData) {
      return {
        resourceStore: this.filterResources(calendarProps.resourceStore, calendarProps.options.filterResourcesWithEvents, calendarProps.eventStore, calendarProps.dateProfile.activeRange),
        resourceEntityExpansions: calendarProps.resourceEntityExpansions
      };
    }
    return null;
  }
};
function filterResources(resourceStore, doFilterResourcesWithEvents, eventStore, activeRange) {
  if (doFilterResourcesWithEvents) {
    let instancesInRange = filterEventInstancesInRange(eventStore.instances, activeRange);
    let hasEvents = computeHasEvents(instancesInRange, eventStore.defs);
    Object.assign(hasEvents, computeAncestorHasEvents(hasEvents, resourceStore));
    return filterHash(resourceStore, (resource, resourceId) => hasEvents[resourceId]);
  }
  return resourceStore;
}
function filterEventInstancesInRange(eventInstances, activeRange) {
  return filterHash(eventInstances, (eventInstance) => rangesIntersect(eventInstance.range, activeRange));
}
function computeHasEvents(eventInstances, eventDefs) {
  let hasEvents = {};
  for (let instanceId in eventInstances) {
    let instance = eventInstances[instanceId];
    for (let resourceId of eventDefs[instance.defId].resourceIds) {
      hasEvents[resourceId] = true;
    }
  }
  return hasEvents;
}
function computeAncestorHasEvents(hasEvents, resourceStore) {
  let res = {};
  for (let resourceId in hasEvents) {
    let resource;
    while (resource = resourceStore[resourceId]) {
      resourceId = resource.parentId;
      if (resourceId) {
        res[resourceId] = true;
      } else {
        break;
      }
    }
  }
  return res;
}
function transformIsDraggable(val, eventDef, eventUi, context) {
  if (!val) {
    let state = context.getCurrentData();
    let viewSpec = state.viewSpecs[state.currentViewType];
    if (viewSpec.optionDefaults.needsResourceData) {
      if (computeResourceEditable(eventDef, context)) {
        return true;
      }
    }
  }
  return val;
}
var ResourceEventConfigAdder = class {
  constructor() {
    this.buildResourceEventUis = memoize(buildResourceEventUis, isPropsEqual);
    this.injectResourceEventUis = memoize(injectResourceEventUis);
  }
  transform(viewProps, calendarProps) {
    if (!calendarProps.viewSpec.optionDefaults.needsResourceData) {
      return {
        eventUiBases: this.injectResourceEventUis(viewProps.eventUiBases, viewProps.eventStore.defs, this.buildResourceEventUis(calendarProps.resourceStore))
      };
    }
    return null;
  }
};
function buildResourceEventUis(resourceStore) {
  return mapHash(resourceStore, (resource) => resource.ui);
}
function injectResourceEventUis(eventUiBases, eventDefs, resourceEventUis) {
  return mapHash(eventUiBases, (eventUi, defId) => {
    if (defId) {
      return injectResourceEventUi(eventUi, eventDefs[defId], resourceEventUis);
    }
    return eventUi;
  });
}
function injectResourceEventUi(origEventUi, eventDef, resourceEventUis) {
  let parts = [];
  for (let resourceId of eventDef.resourceIds) {
    if (resourceEventUis[resourceId]) {
      parts.unshift(resourceEventUis[resourceId]);
    }
  }
  parts.unshift(origEventUi);
  return combineEventUis(parts);
}
var defs = [];
function registerResourceSourceDef(def) {
  defs.push(def);
}
function getResourceSourceDef(id) {
  return defs[id];
}
function getResourceSourceDefs() {
  return defs;
}
var RESOURCE_SOURCE_REFINERS = {
  id: String,
  // for array. TODO: move to resource-array
  resources: identity,
  // for json feed. TODO: move to resource-json-feed
  url: String,
  method: String,
  startParam: String,
  endParam: String,
  timeZoneParam: String,
  extraParams: identity
};
function parseResourceSource(input) {
  let inputObj;
  if (typeof input === "string") {
    inputObj = { url: input };
  } else if (typeof input === "function" || Array.isArray(input)) {
    inputObj = { resources: input };
  } else if (typeof input === "object" && input) {
    inputObj = input;
  }
  if (inputObj) {
    let { refined, extra } = refineProps(inputObj, RESOURCE_SOURCE_REFINERS);
    warnUnknownProps(extra);
    let metaRes = buildResourceSourceMeta(refined);
    if (metaRes) {
      return {
        _raw: input,
        sourceId: guid(),
        sourceDefId: metaRes.sourceDefId,
        meta: metaRes.meta,
        publicId: refined.id || "",
        isFetching: false,
        latestFetchId: "",
        fetchRange: null
      };
    }
  }
  return null;
}
function buildResourceSourceMeta(refined) {
  let defs2 = getResourceSourceDefs();
  for (let i = defs2.length - 1; i >= 0; i -= 1) {
    let def = defs2[i];
    let meta = def.parseMeta(refined);
    if (meta) {
      return { meta, sourceDefId: i };
    }
  }
  return null;
}
function warnUnknownProps(props) {
  for (let propName in props) {
    console.warn(`Unknown resource prop '${propName}'`);
  }
}
function reduceResourceSource(source, action, context) {
  let { options, dateProfile } = context;
  if (!source || !action) {
    return createSource(options.initialResources || options.resources, dateProfile.activeRange, options.refetchResourcesOnNavigate, context);
  }
  switch (action.type) {
    case "RESET_RESOURCE_SOURCE":
      return createSource(action.resourceSourceInput, dateProfile.activeRange, options.refetchResourcesOnNavigate, context);
    case "PREV":
    case "NEXT":
    case "CHANGE_DATE":
    case "CHANGE_VIEW_TYPE":
      return handleRangeChange(source, dateProfile.activeRange, options.refetchResourcesOnNavigate, context);
    case "RECEIVE_RESOURCES":
    case "RECEIVE_RESOURCE_ERROR":
      return receiveResponse(source, action.fetchId, action.fetchRange);
    case "REFETCH_RESOURCES":
      return fetchSource(source, dateProfile.activeRange, context);
    default:
      return source;
  }
}
function createSource(input, activeRange, refetchResourcesOnNavigate, context) {
  if (input) {
    let source = parseResourceSource(input);
    source = fetchSource(source, refetchResourcesOnNavigate ? activeRange : null, context);
    return source;
  }
  return null;
}
function handleRangeChange(source, activeRange, refetchResourcesOnNavigate, context) {
  if (refetchResourcesOnNavigate && !doesSourceIgnoreRange(source) && (!source.fetchRange || !rangesEqual(source.fetchRange, activeRange))) {
    return fetchSource(source, activeRange, context);
  }
  return source;
}
function doesSourceIgnoreRange(source) {
  return Boolean(getResourceSourceDef(source.sourceDefId).ignoreRange);
}
function fetchSource(source, fetchRange, context) {
  let sourceDef = getResourceSourceDef(source.sourceDefId);
  let fetchId = guid();
  sourceDef.fetch({
    resourceSource: source,
    range: fetchRange,
    context
  }, (res) => {
    context.dispatch({
      type: "RECEIVE_RESOURCES",
      fetchId,
      fetchRange,
      rawResources: res.rawResources
    });
  }, (error) => {
    context.dispatch({
      type: "RECEIVE_RESOURCE_ERROR",
      fetchId,
      fetchRange,
      error
    });
  });
  return Object.assign(Object.assign({}, source), { isFetching: true, latestFetchId: fetchId });
}
function receiveResponse(source, fetchId, fetchRange) {
  if (fetchId === source.latestFetchId) {
    return Object.assign(Object.assign({}, source), { isFetching: false, fetchRange });
  }
  return source;
}
function reduceResourceStore(store, action, source, context) {
  if (!store || !action) {
    return {};
  }
  switch (action.type) {
    case "RECEIVE_RESOURCES":
      return receiveRawResources(store, action.rawResources, action.fetchId, source, context);
    case "ADD_RESOURCE":
      return addResource(store, action.resourceHash);
    case "REMOVE_RESOURCE":
      return removeResource(store, action.resourceId);
    case "SET_RESOURCE_PROP":
      return setResourceProp(store, action.resourceId, action.propName, action.propValue);
    case "SET_RESOURCE_EXTENDED_PROP":
      return setResourceExtendedProp(store, action.resourceId, action.propName, action.propValue);
    default:
      return store;
  }
}
function receiveRawResources(existingStore, inputs, fetchId, source, context) {
  if (source.latestFetchId === fetchId) {
    let nextStore = {};
    for (let input of inputs) {
      parseResource(input, "", nextStore, context);
    }
    return nextStore;
  }
  return existingStore;
}
function addResource(existingStore, additions) {
  return Object.assign(Object.assign({}, existingStore), additions);
}
function removeResource(existingStore, resourceId) {
  let newStore = Object.assign({}, existingStore);
  delete newStore[resourceId];
  for (let childResourceId in newStore) {
    if (newStore[childResourceId].parentId === resourceId) {
      newStore[childResourceId] = Object.assign(Object.assign({}, newStore[childResourceId]), { parentId: "" });
    }
  }
  return newStore;
}
function setResourceProp(existingStore, resourceId, name, value) {
  let existingResource = existingStore[resourceId];
  if (existingResource) {
    return Object.assign(Object.assign({}, existingStore), { [resourceId]: Object.assign(Object.assign({}, existingResource), { [name]: value }) });
  }
  return existingStore;
}
function setResourceExtendedProp(existingStore, resourceId, name, value) {
  let existingResource = existingStore[resourceId];
  if (existingResource) {
    return Object.assign(Object.assign({}, existingStore), { [resourceId]: Object.assign(Object.assign({}, existingResource), { extendedProps: Object.assign(Object.assign({}, existingResource.extendedProps), { [name]: value }) }) });
  }
  return existingStore;
}
function reduceResourceEntityExpansions(expansions, action) {
  if (!expansions || !action) {
    return {};
  }
  switch (action.type) {
    case "SET_RESOURCE_ENTITY_EXPANDED":
      return Object.assign(Object.assign({}, expansions), { [action.id]: action.isExpanded });
    default:
      return expansions;
  }
}
function reduceResources(state, action, context) {
  let resourceSource = reduceResourceSource(state && state.resourceSource, action, context);
  let resourceStore = reduceResourceStore(state && state.resourceStore, action, resourceSource, context);
  let resourceEntityExpansions = reduceResourceEntityExpansions(state && state.resourceEntityExpansions, action);
  return {
    resourceSource,
    resourceStore,
    resourceEntityExpansions
  };
}
var EVENT_REFINERS = {
  resourceId: String,
  resourceIds: identity,
  resourceEditable: Boolean
};
function generateEventDefResourceMembers(refined) {
  return {
    resourceIds: ensureStringArray(refined.resourceIds).concat(refined.resourceId ? [refined.resourceId] : []),
    resourceEditable: refined.resourceEditable
  };
}
function ensureStringArray(items) {
  return (items || []).map((item) => String(item));
}
function transformDateSelectionJoin(hit0, hit1) {
  let resourceId0 = hit0.dateSpan.resourceId;
  let resourceId1 = hit1.dateSpan.resourceId;
  if (resourceId0 && resourceId1) {
    return { resourceId: resourceId0 };
  }
  return null;
}
CalendarImpl.prototype.addResource = function(input, scrollTo = true) {
  let currentState = this.getCurrentData();
  let resourceHash;
  let resource;
  if (input instanceof ResourceApi) {
    resource = input._resource;
    resourceHash = { [resource.id]: resource };
  } else {
    resourceHash = {};
    resource = parseResource(input, "", resourceHash, currentState);
  }
  this.dispatch({
    type: "ADD_RESOURCE",
    resourceHash
  });
  if (scrollTo) {
    this.trigger("_scrollRequest", { resourceId: resource.id });
  }
  let resourceApi = new ResourceApi(currentState, resource);
  currentState.emitter.trigger("resourceAdd", {
    resource: resourceApi,
    revert: () => {
      this.dispatch({
        type: "REMOVE_RESOURCE",
        resourceId: resource.id
      });
    }
  });
  return resourceApi;
};
CalendarImpl.prototype.getResourceById = function(id) {
  id = String(id);
  let currentState = this.getCurrentData();
  if (currentState.resourceStore) {
    let rawResource = currentState.resourceStore[id];
    if (rawResource) {
      return new ResourceApi(currentState, rawResource);
    }
  }
  return null;
};
CalendarImpl.prototype.getResources = function() {
  let currentState = this.getCurrentData();
  let { resourceStore } = currentState;
  let resourceApis = [];
  if (resourceStore) {
    for (let resourceId in resourceStore) {
      resourceApis.push(new ResourceApi(currentState, resourceStore[resourceId]));
    }
  }
  return resourceApis;
};
CalendarImpl.prototype.getTopLevelResources = function() {
  let currentState = this.getCurrentData();
  let { resourceStore } = currentState;
  let resourceApis = [];
  if (resourceStore) {
    for (let resourceId in resourceStore) {
      if (!resourceStore[resourceId].parentId) {
        resourceApis.push(new ResourceApi(currentState, resourceStore[resourceId]));
      }
    }
  }
  return resourceApis;
};
CalendarImpl.prototype.refetchResources = function() {
  this.dispatch({
    type: "REFETCH_RESOURCES"
  });
};
function transformDatePoint(dateSpan, context) {
  return dateSpan.resourceId ? { resource: context.calendarApi.getResourceById(dateSpan.resourceId) } : {};
}
function transformDateSpan(dateSpan, context) {
  return dateSpan.resourceId ? { resource: context.calendarApi.getResourceById(dateSpan.resourceId) } : {};
}
function isPropsValidWithResources(combinedProps, context) {
  let splitter = new ResourceSplitter();
  let sets = splitter.splitProps(Object.assign(Object.assign({}, combinedProps), { resourceStore: context.getCurrentData().resourceStore }));
  for (let resourceId in sets) {
    let props = sets[resourceId];
    if (resourceId && sets[""]) {
      props = Object.assign(Object.assign({}, props), { eventStore: mergeEventStores(sets[""].eventStore, props.eventStore), eventUiBases: Object.assign(Object.assign({}, sets[""].eventUiBases), props.eventUiBases) });
    }
    if (!isPropsValid(props, context, { resourceId }, filterConfig.bind(null, resourceId))) {
      return false;
    }
  }
  return true;
}
function filterConfig(resourceId, config2) {
  return Object.assign(Object.assign({}, config2), { constraints: filterConstraints(resourceId, config2.constraints) });
}
function filterConstraints(resourceId, constraints) {
  return constraints.map((constraint) => {
    let defs2 = constraint.defs;
    if (defs2) {
      for (let defId in defs2) {
        let resourceIds = defs2[defId].resourceIds;
        if (resourceIds.length && resourceIds.indexOf(resourceId) === -1) {
          return false;
        }
      }
    }
    return constraint;
  });
}
function transformExternalDef(dateSpan) {
  return dateSpan.resourceId ? { resourceId: dateSpan.resourceId } : {};
}
var optionChangeHandlers = {
  resources: handleResources
};
function handleResources(newSourceInput, context) {
  let oldSourceInput = context.getCurrentData().resourceSource._raw;
  if (oldSourceInput !== newSourceInput) {
    context.dispatch({
      type: "RESET_RESOURCE_SOURCE",
      resourceSourceInput: newSourceInput
    });
  }
}
var OPTION_REFINERS2 = {
  initialResources: identity,
  resources: identity,
  eventResourceEditable: Boolean,
  refetchResourcesOnNavigate: Boolean,
  resourceOrder: parseFieldSpecs,
  filterResourcesWithEvents: Boolean,
  resourceGroupField: String,
  resourceAreaWidth: identity,
  resourceAreaColumns: identity,
  resourcesInitiallyExpanded: Boolean,
  datesAboveResources: Boolean,
  needsResourceData: Boolean,
  resourceAreaHeaderClassNames: identity,
  resourceAreaHeaderContent: identity,
  resourceAreaHeaderDidMount: identity,
  resourceAreaHeaderWillUnmount: identity,
  resourceGroupLabelClassNames: identity,
  resourceGroupLabelContent: identity,
  resourceGroupLabelDidMount: identity,
  resourceGroupLabelWillUnmount: identity,
  resourceLabelClassNames: identity,
  resourceLabelContent: identity,
  resourceLabelDidMount: identity,
  resourceLabelWillUnmount: identity,
  resourceLaneClassNames: identity,
  resourceLaneContent: identity,
  resourceLaneDidMount: identity,
  resourceLaneWillUnmount: identity,
  resourceGroupLaneClassNames: identity,
  resourceGroupLaneContent: identity,
  resourceGroupLaneDidMount: identity,
  resourceGroupLaneWillUnmount: identity
};
var LISTENER_REFINERS = {
  resourcesSet: identity,
  resourceAdd: identity,
  resourceChange: identity,
  resourceRemove: identity
};
EventImpl.prototype.getResources = function() {
  let { calendarApi } = this._context;
  return this._def.resourceIds.map((resourceId) => calendarApi.getResourceById(resourceId));
};
EventImpl.prototype.setResources = function(resources) {
  let resourceIds = [];
  for (let resource of resources) {
    let resourceId = null;
    if (typeof resource === "string") {
      resourceId = resource;
    } else if (typeof resource === "number") {
      resourceId = String(resource);
    } else if (resource instanceof ResourceApi) {
      resourceId = resource.id;
    } else {
      console.warn("unknown resource type: " + resource);
    }
    if (resourceId) {
      resourceIds.push(resourceId);
    }
  }
  this.mutate({
    standardProps: {
      resourceIds
    }
  });
};
registerResourceSourceDef({
  ignoreRange: true,
  parseMeta(refined) {
    if (Array.isArray(refined.resources)) {
      return refined.resources;
    }
    return null;
  },
  fetch(arg, successCallback) {
    successCallback({
      rawResources: arg.resourceSource.meta
    });
  }
});
registerResourceSourceDef({
  parseMeta(refined) {
    if (typeof refined.resources === "function") {
      return refined.resources;
    }
    return null;
  },
  fetch(arg, successCallback, errorCallback) {
    const dateEnv = arg.context.dateEnv;
    const func = arg.resourceSource.meta;
    const publicArg = arg.range ? {
      start: dateEnv.toDate(arg.range.start),
      end: dateEnv.toDate(arg.range.end),
      startStr: dateEnv.formatIso(arg.range.start),
      endStr: dateEnv.formatIso(arg.range.end),
      timeZone: dateEnv.timeZone
    } : {};
    unpromisify(func.bind(null, publicArg), (rawResources) => successCallback({ rawResources }), errorCallback);
  }
});
registerResourceSourceDef({
  parseMeta(refined) {
    if (refined.url) {
      return {
        url: refined.url,
        method: (refined.method || "GET").toUpperCase(),
        extraParams: refined.extraParams
      };
    }
    return null;
  },
  fetch(arg, successCallback, errorCallback) {
    const meta = arg.resourceSource.meta;
    const requestParams = buildRequestParams(meta, arg.range, arg.context);
    requestJson(meta.method, meta.url, requestParams).then(([rawResources, response]) => {
      successCallback({ rawResources, response });
    }, errorCallback);
  }
});
function buildRequestParams(meta, range, context) {
  let { dateEnv, options } = context;
  let startParam;
  let endParam;
  let timeZoneParam;
  let customRequestParams;
  let params = {};
  if (range) {
    startParam = meta.startParam;
    if (startParam == null) {
      startParam = options.startParam;
    }
    endParam = meta.endParam;
    if (endParam == null) {
      endParam = options.endParam;
    }
    timeZoneParam = meta.timeZoneParam;
    if (timeZoneParam == null) {
      timeZoneParam = options.timeZoneParam;
    }
    params[startParam] = dateEnv.formatIso(range.start);
    params[endParam] = dateEnv.formatIso(range.end);
    if (dateEnv.timeZone !== "local") {
      params[timeZoneParam] = dateEnv.timeZone;
    }
  }
  if (typeof meta.extraParams === "function") {
    customRequestParams = meta.extraParams();
  } else {
    customRequestParams = meta.extraParams || {};
  }
  Object.assign(params, customRequestParams);
  return params;
}
var index3 = createPlugin({
  name: "@fullcalendar/resource",
  premiumReleaseDate: "2025-04-02",
  deps: [index],
  reducers: [reduceResources],
  isLoadingFuncs: [
    (state) => state.resourceSource && state.resourceSource.isFetching
  ],
  eventRefiners: EVENT_REFINERS,
  eventDefMemberAdders: [generateEventDefResourceMembers],
  isDraggableTransformers: [transformIsDraggable],
  eventDragMutationMassagers: [massageEventDragMutation],
  eventDefMutationAppliers: [applyEventDefMutation],
  dateSelectionTransformers: [transformDateSelectionJoin],
  datePointTransforms: [transformDatePoint],
  dateSpanTransforms: [transformDateSpan],
  viewPropsTransformers: [ResourceDataAdder, ResourceEventConfigAdder],
  isPropsValid: isPropsValidWithResources,
  externalDefTransforms: [transformExternalDef],
  eventDropTransformers: [transformEventDrop],
  optionChangeHandlers,
  optionRefiners: OPTION_REFINERS2,
  listenerRefiners: LISTENER_REFINERS,
  propSetHandlers: { resourceStore: handleResourceStore }
});

// ../../../../../../Users/jin/node_modules/@fullcalendar/resource-timeline/internal.js
function ExpanderIcon({ depth, hasChildren, isExpanded, onExpanderClick }) {
  let nodes = [];
  for (let i = 0; i < depth; i += 1) {
    nodes.push(y("span", { className: "fc-icon" }));
  }
  let iconClassNames = ["fc-icon"];
  if (hasChildren) {
    if (isExpanded) {
      iconClassNames.push("fc-icon-minus-square");
    } else {
      iconClassNames.push("fc-icon-plus-square");
    }
  }
  nodes.push(y(
    "span",
    { className: "fc-datagrid-expander" + (hasChildren ? "" : " fc-datagrid-expander-placeholder"), onClick: onExpanderClick },
    y("span", { className: iconClassNames.join(" ") })
  ));
  return y(_, {}, ...nodes);
}
var SpreadsheetIndividualCell = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.refineRenderProps = memoizeObjArg(refineRenderProps2);
    this.onExpanderClick = (ev) => {
      let { props } = this;
      if (props.hasChildren) {
        this.context.dispatch({
          type: "SET_RESOURCE_ENTITY_EXPANDED",
          id: props.resource.id,
          isExpanded: !props.isExpanded
        });
      }
    };
  }
  render() {
    let { props, context } = this;
    let { colSpec } = props;
    let renderProps = this.refineRenderProps({
      resource: props.resource,
      fieldValue: props.fieldValue,
      context
    });
    return y(ContentContainer, { elTag: "td", elClasses: [
      "fc-datagrid-cell",
      "fc-resource"
    ], elAttrs: {
      role: "gridcell",
      "data-resource-id": props.resource.id
    }, renderProps, generatorName: colSpec.isMain ? "resourceLabelContent" : void 0, customGenerator: colSpec.cellContent, defaultGenerator: renderResourceInner, classNameGenerator: colSpec.cellClassNames, didMount: colSpec.cellDidMount, willUnmount: colSpec.cellWillUnmount }, (InnerContent) => y(
      "div",
      { className: "fc-datagrid-cell-frame", style: { height: props.innerHeight } },
      y(
        "div",
        { className: "fc-datagrid-cell-cushion fc-scrollgrid-sync-inner" },
        colSpec.isMain && y(ExpanderIcon, { depth: props.depth, hasChildren: props.hasChildren, isExpanded: props.isExpanded, onExpanderClick: this.onExpanderClick }),
        y(InnerContent, { elTag: "span", elClasses: ["fc-datagrid-cell-main"] })
      )
    ));
  }
};
function renderResourceInner(renderProps) {
  return renderProps.fieldValue || y(_, null, " ");
}
function refineRenderProps2(input) {
  return {
    resource: new ResourceApi(input.context, input.resource),
    fieldValue: input.fieldValue,
    view: input.context.viewApi
  };
}
var SpreadsheetGroupCell = class extends BaseComponent {
  render() {
    let { props, context } = this;
    let { colSpec } = props;
    let renderProps = {
      groupValue: props.fieldValue,
      view: context.viewApi
    };
    return y(ContentContainer, { elTag: "td", elClasses: [
      "fc-datagrid-cell",
      "fc-resource-group"
    ], elAttrs: {
      role: "gridcell",
      rowSpan: props.rowSpan
    }, renderProps, generatorName: "resourceGroupLabelContent", customGenerator: colSpec.cellContent, defaultGenerator: renderGroupInner, classNameGenerator: colSpec.cellClassNames, didMount: colSpec.cellDidMount, willUnmount: colSpec.cellWillUnmount }, (InnerContent) => y(
      "div",
      { className: "fc-datagrid-cell-frame fc-datagrid-cell-frame-liquid" },
      y(InnerContent, { elTag: "div", elClasses: ["fc-datagrid-cell-cushion", "fc-sticky"] })
    ));
  }
};
function renderGroupInner(renderProps) {
  return renderProps.groupValue || y(_, null, " ");
}
var SpreadsheetRow = class extends BaseComponent {
  render() {
    let { props } = this;
    let { resource, rowSpans, depth } = props;
    let resourceFields = buildResourceFields(resource);
    return y("tr", { role: "row" }, props.colSpecs.map((colSpec, i) => {
      let rowSpan = rowSpans[i];
      if (rowSpan === 0) {
        return null;
      }
      if (rowSpan == null) {
        rowSpan = 1;
      }
      let fieldValue = colSpec.field ? resourceFields[colSpec.field] : resource.title || getPublicId(resource.id);
      if (rowSpan > 1) {
        return y(SpreadsheetGroupCell, { key: i, colSpec, fieldValue, rowSpan });
      }
      return y(SpreadsheetIndividualCell, { key: i, colSpec, resource, fieldValue, depth, hasChildren: props.hasChildren, isExpanded: props.isExpanded, innerHeight: props.innerHeight });
    }));
  }
};
SpreadsheetRow.addPropsEquality({
  rowSpans: isArraysEqual
});
var SpreadsheetGroupRow = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.innerInnerRef = d();
    this.onExpanderClick = () => {
      let { props } = this;
      this.context.dispatch({
        type: "SET_RESOURCE_ENTITY_EXPANDED",
        id: props.id,
        isExpanded: !props.isExpanded
      });
    };
  }
  render() {
    let { props, context } = this;
    let renderProps = { groupValue: props.group.value, view: context.viewApi };
    let spec = props.group.spec;
    return y(
      "tr",
      { role: "row" },
      y(ContentContainer, { elTag: "th", elClasses: [
        "fc-datagrid-cell",
        "fc-resource-group",
        context.theme.getClass("tableCellShaded")
      ], elAttrs: {
        // ARIA TODO: not really a columnheader
        // extremely tedious to make this aria-compliant,
        // to assign multiple headers to each cell
        // https://www.w3.org/WAI/tutorials/tables/multi-level/
        role: "columnheader",
        scope: "colgroup",
        colSpan: props.spreadsheetColCnt
      }, renderProps, generatorName: "resourceGroupLabelContent", customGenerator: spec.labelContent, defaultGenerator: renderCellInner, classNameGenerator: spec.labelClassNames, didMount: spec.labelDidMount, willUnmount: spec.labelWillUnmount }, (InnerContent) => y(
        "div",
        { className: "fc-datagrid-cell-frame", style: { height: props.innerHeight } },
        y(
          "div",
          { className: "fc-datagrid-cell-cushion fc-scrollgrid-sync-inner", ref: this.innerInnerRef },
          y(ExpanderIcon, { depth: 0, hasChildren: true, isExpanded: props.isExpanded, onExpanderClick: this.onExpanderClick }),
          y(InnerContent, { elTag: "span", elClasses: ["fc-datagrid-cell-main"] })
        )
      ))
    );
  }
};
SpreadsheetGroupRow.addPropsEquality({
  group: isGroupsEqual
});
function renderCellInner(renderProps) {
  return renderProps.groupValue || y(_, null, " ");
}
var SPREADSHEET_COL_MIN_WIDTH = 20;
var SpreadsheetHeader = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.resizerElRefs = new RefMap(this._handleColResizerEl.bind(this));
    this.colDraggings = {};
  }
  render() {
    let { colSpecs, superHeaderRendering, rowInnerHeights } = this.props;
    let renderProps = { view: this.context.viewApi };
    let rowNodes = [];
    rowInnerHeights = rowInnerHeights.slice();
    if (superHeaderRendering) {
      let rowInnerHeight2 = rowInnerHeights.shift();
      rowNodes.push(y(
        "tr",
        { key: "row-super", role: "row" },
        y(ContentContainer, { elTag: "th", elClasses: [
          "fc-datagrid-cell",
          "fc-datagrid-cell-super"
        ], elAttrs: {
          role: "columnheader",
          scope: "colgroup",
          colSpan: colSpecs.length
        }, renderProps, generatorName: "resourceAreaHeaderContent", customGenerator: superHeaderRendering.headerContent, defaultGenerator: superHeaderRendering.headerDefault, classNameGenerator: superHeaderRendering.headerClassNames, didMount: superHeaderRendering.headerDidMount, willUnmount: superHeaderRendering.headerWillUnmount }, (InnerContent) => y(
          "div",
          { className: "fc-datagrid-cell-frame", style: { height: rowInnerHeight2 } },
          y(InnerContent, { elTag: "div", elClasses: ["fc-datagrid-cell-cushion", "fc-scrollgrid-sync-inner"] })
        ))
      ));
    }
    let rowInnerHeight = rowInnerHeights.shift();
    rowNodes.push(y("tr", { key: "row", role: "row" }, colSpecs.map((colSpec, i) => {
      let isLastCol = i === colSpecs.length - 1;
      return y(ContentContainer, { key: i, elTag: "th", elClasses: ["fc-datagrid-cell"], elAttrs: { role: "columnheader" }, renderProps, generatorName: "resourceAreaHeaderContent", customGenerator: colSpec.headerContent, defaultGenerator: colSpec.headerDefault, classNameGenerator: colSpec.headerClassNames, didMount: colSpec.headerDidMount, willUnmount: colSpec.headerWillUnmount }, (InnerContent) => y(
        "div",
        { className: "fc-datagrid-cell-frame", style: { height: rowInnerHeight } },
        y(
          "div",
          { className: "fc-datagrid-cell-cushion fc-scrollgrid-sync-inner" },
          colSpec.isMain && y(
            "span",
            { className: "fc-datagrid-expander fc-datagrid-expander-placeholder" },
            y("span", { className: "fc-icon" })
          ),
          y(InnerContent, { elTag: "span", elClasses: ["fc-datagrid-cell-main"] })
        ),
        !isLastCol && y("div", { className: "fc-datagrid-cell-resizer", ref: this.resizerElRefs.createRef(i) })
      ));
    })));
    return y(_, null, rowNodes);
  }
  _handleColResizerEl(resizerEl, index5) {
    let { colDraggings } = this;
    if (!resizerEl) {
      let dragging = colDraggings[index5];
      if (dragging) {
        dragging.destroy();
        delete colDraggings[index5];
      }
    } else {
      let dragging = this.initColResizing(resizerEl, parseInt(index5, 10));
      if (dragging) {
        colDraggings[index5] = dragging;
      }
    }
  }
  initColResizing(resizerEl, index5) {
    let { pluginHooks, isRtl } = this.context;
    let { onColWidthChange } = this.props;
    let ElementDraggingImpl = pluginHooks.elementDraggingImpl;
    if (ElementDraggingImpl) {
      let dragging = new ElementDraggingImpl(resizerEl);
      let startWidth;
      let currentWidths;
      dragging.emitter.on("dragstart", () => {
        let allCells = findElements(elementClosest(resizerEl, "tr"), "th");
        currentWidths = allCells.map((cellEl) => cellEl.getBoundingClientRect().width);
        startWidth = currentWidths[index5];
      });
      dragging.emitter.on("dragmove", (pev) => {
        currentWidths[index5] = Math.max(startWidth + pev.deltaX * (isRtl ? -1 : 1), SPREADSHEET_COL_MIN_WIDTH);
        if (onColWidthChange) {
          onColWidthChange(currentWidths.slice());
        }
      });
      dragging.setAutoScrollEnabled(false);
      return dragging;
    }
    return null;
  }
};
var ResourceTimelineLane = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.refineRenderProps = memoizeObjArg(refineRenderProps$1);
    this.handleHeightChange = (innerEl, isStable) => {
      if (this.props.onHeightChange) {
        this.props.onHeightChange(
          // would want to use own <tr> ref, but not guaranteed to be ready when this fires
          elementClosest(innerEl, "tr"),
          isStable
        );
      }
    };
  }
  render() {
    let { props, context } = this;
    let { options } = context;
    let renderProps = this.refineRenderProps({ resource: props.resource, context });
    return y(
      "tr",
      { ref: props.elRef },
      y(ContentContainer, { elTag: "td", elClasses: [
        "fc-timeline-lane",
        "fc-resource"
      ], elAttrs: {
        "data-resource-id": props.resource.id
      }, renderProps, generatorName: "resourceLaneContent", customGenerator: options.resourceLaneContent, classNameGenerator: options.resourceLaneClassNames, didMount: options.resourceLaneDidMount, willUnmount: options.resourceLaneWillUnmount }, (InnerContent) => y(
        "div",
        { className: "fc-timeline-lane-frame", style: { height: props.innerHeight } },
        y(InnerContent, { elTag: "div", elClasses: ["fc-timeline-lane-misc"] }),
        y(TimelineLane, { dateProfile: props.dateProfile, tDateProfile: props.tDateProfile, nowDate: props.nowDate, todayRange: props.todayRange, nextDayThreshold: props.nextDayThreshold, businessHours: props.businessHours, eventStore: props.eventStore, eventUiBases: props.eventUiBases, dateSelection: props.dateSelection, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, timelineCoords: props.timelineCoords, onHeightChange: this.handleHeightChange, resourceId: props.resource.id })
      ))
    );
  }
};
var DividerRow = class extends BaseComponent {
  render() {
    let { props, context } = this;
    let { renderHooks } = props;
    let renderProps = {
      groupValue: props.groupValue,
      view: context.viewApi
    };
    return y(
      "tr",
      { ref: props.elRef },
      y(ContentContainer, { elTag: "td", elRef: props.elRef, elClasses: [
        "fc-timeline-lane",
        "fc-resource-group",
        context.theme.getClass("tableCellShaded")
      ], renderProps, generatorName: "resourceGroupLaneContent", customGenerator: renderHooks.laneContent, classNameGenerator: renderHooks.laneClassNames, didMount: renderHooks.laneDidMount, willUnmount: renderHooks.laneWillUnmount }, (InnerContainer) => y(InnerContainer, { elTag: "div", elStyle: { height: props.innerHeight } }))
    );
  }
};
var ResourceTimelineLanesBody = class extends BaseComponent {
  render() {
    let { props, context } = this;
    let { rowElRefs, innerHeights } = props;
    return y("tbody", null, props.rowNodes.map((node, index5) => {
      if (node.group) {
        return y(DividerRow, { key: node.id, elRef: rowElRefs.createRef(node.id), groupValue: node.group.value, renderHooks: node.group.spec, innerHeight: innerHeights[index5] || "" });
      }
      if (node.resource) {
        let resource = node.resource;
        return y(ResourceTimelineLane, Object.assign({ key: node.id, elRef: rowElRefs.createRef(node.id) }, props.splitProps[resource.id], { resource, dateProfile: props.dateProfile, tDateProfile: props.tDateProfile, nowDate: props.nowDate, todayRange: props.todayRange, nextDayThreshold: context.options.nextDayThreshold, businessHours: resource.businessHours || props.fallbackBusinessHours, innerHeight: innerHeights[index5] || "", timelineCoords: props.slatCoords, onHeightChange: props.onRowHeightChange }));
      }
      return null;
    }));
  }
};
var ResourceTimelineLanes = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.rootElRef = d();
    this.rowElRefs = new RefMap();
  }
  render() {
    let { props, context } = this;
    return y(
      "table",
      { ref: this.rootElRef, "aria-hidden": true, className: "fc-scrollgrid-sync-table " + context.theme.getClass("table"), style: {
        minWidth: props.tableMinWidth,
        width: props.clientWidth,
        height: props.minHeight
      } },
      y(ResourceTimelineLanesBody, { rowElRefs: this.rowElRefs, rowNodes: props.rowNodes, dateProfile: props.dateProfile, tDateProfile: props.tDateProfile, nowDate: props.nowDate, todayRange: props.todayRange, splitProps: props.splitProps, fallbackBusinessHours: props.fallbackBusinessHours, slatCoords: props.slatCoords, innerHeights: props.innerHeights, onRowHeightChange: props.onRowHeightChange })
    );
  }
  componentDidMount() {
    this.updateCoords();
  }
  componentDidUpdate() {
    this.updateCoords();
  }
  componentWillUnmount() {
    if (this.props.onRowCoords) {
      this.props.onRowCoords(null);
    }
  }
  updateCoords() {
    let { props } = this;
    if (props.onRowCoords && props.clientWidth !== null) {
      this.props.onRowCoords(new PositionCache(this.rootElRef.current, collectRowEls(this.rowElRefs.currentMap, props.rowNodes), false, true));
    }
  }
};
function collectRowEls(elMap, rowNodes) {
  return rowNodes.map((rowNode) => elMap[rowNode.id]);
}
var ResourceTimelineGrid = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.computeHasResourceBusinessHours = memoize(computeHasResourceBusinessHours);
    this.resourceSplitter = new ResourceSplitter();
    this.bgSlicer = new TimelineLaneSlicer();
    this.slatsRef = d();
    this.state = {
      slatCoords: null
    };
    this.handleEl = (el) => {
      if (el) {
        this.context.registerInteractiveComponent(this, { el });
      } else {
        this.context.unregisterInteractiveComponent(this);
      }
    };
    this.handleSlatCoords = (slatCoords) => {
      this.setState({ slatCoords });
      if (this.props.onSlatCoords) {
        this.props.onSlatCoords(slatCoords);
      }
    };
    this.handleRowCoords = (rowCoords) => {
      this.rowCoords = rowCoords;
      if (this.props.onRowCoords) {
        this.props.onRowCoords(rowCoords);
      }
    };
  }
  render() {
    let { props, state, context } = this;
    let { dateProfile, tDateProfile } = props;
    let timerUnit = greatestDurationDenominator(tDateProfile.slotDuration).unit;
    let hasResourceBusinessHours = this.computeHasResourceBusinessHours(props.rowNodes);
    let splitProps = this.resourceSplitter.splitProps(props);
    let bgLaneProps = splitProps[""];
    let bgSlicedProps = this.bgSlicer.sliceProps(
      bgLaneProps,
      dateProfile,
      tDateProfile.isTimeScale ? null : props.nextDayThreshold,
      context,
      // wish we didn't need to pass in the rest of these args...
      dateProfile,
      context.dateProfileGenerator,
      tDateProfile,
      context.dateEnv
    );
    let slatCoords = state.slatCoords && state.slatCoords.dateProfile === props.dateProfile ? state.slatCoords : null;
    return y(
      "div",
      { ref: this.handleEl, className: [
        "fc-timeline-body",
        props.expandRows ? "fc-timeline-body-expandrows" : ""
      ].join(" "), style: { minWidth: props.tableMinWidth } },
      y(NowTimer, { unit: timerUnit }, (nowDate, todayRange) => y(
        _,
        null,
        y(TimelineSlats, { ref: this.slatsRef, dateProfile, tDateProfile, nowDate, todayRange, clientWidth: props.clientWidth, tableColGroupNode: props.tableColGroupNode, tableMinWidth: props.tableMinWidth, onCoords: this.handleSlatCoords, onScrollLeftRequest: props.onScrollLeftRequest }),
        y(TimelineLaneBg, {
          businessHourSegs: hasResourceBusinessHours ? null : bgSlicedProps.businessHourSegs,
          bgEventSegs: bgSlicedProps.bgEventSegs,
          timelineCoords: slatCoords,
          // empty array will result in unnecessary rerenders?
          eventResizeSegs: bgSlicedProps.eventResize ? bgSlicedProps.eventResize.segs : [],
          dateSelectionSegs: bgSlicedProps.dateSelectionSegs,
          nowDate,
          todayRange
        }),
        y(ResourceTimelineLanes, { rowNodes: props.rowNodes, dateProfile, tDateProfile: props.tDateProfile, nowDate, todayRange, splitProps, fallbackBusinessHours: hasResourceBusinessHours ? props.businessHours : null, clientWidth: props.clientWidth, minHeight: props.expandRows ? props.clientHeight : "", tableMinWidth: props.tableMinWidth, innerHeights: props.rowInnerHeights, slatCoords, onRowCoords: this.handleRowCoords, onRowHeightChange: props.onRowHeightChange }),
        context.options.nowIndicator && slatCoords && slatCoords.isDateInRange(nowDate) && y(
          "div",
          { className: "fc-timeline-now-indicator-container" },
          y(NowIndicatorContainer, { elClasses: ["fc-timeline-now-indicator-line"], elStyle: coordToCss(slatCoords.dateToCoord(nowDate), context.isRtl), isAxis: false, date: nowDate })
        )
      ))
    );
  }
  // Hit System
  // ------------------------------------------------------------------------------------------
  queryHit(positionLeft, positionTop) {
    let rowCoords = this.rowCoords;
    let rowIndex = rowCoords.topToIndex(positionTop);
    if (rowIndex != null) {
      let resource = this.props.rowNodes[rowIndex].resource;
      if (resource) {
        let slatHit = this.slatsRef.current.positionToHit(positionLeft);
        if (slatHit) {
          return {
            dateProfile: this.props.dateProfile,
            dateSpan: {
              range: slatHit.dateSpan.range,
              allDay: slatHit.dateSpan.allDay,
              resourceId: resource.id
            },
            rect: {
              left: slatHit.left,
              right: slatHit.right,
              top: rowCoords.tops[rowIndex],
              bottom: rowCoords.bottoms[rowIndex]
            },
            dayEl: slatHit.dayEl,
            layer: 0
          };
        }
      }
    }
    return null;
  }
};
function computeHasResourceBusinessHours(rowNodes) {
  for (let node of rowNodes) {
    let resource = node.resource;
    if (resource && resource.businessHours) {
      return true;
    }
  }
  return false;
}
var MIN_RESOURCE_AREA_WIDTH = 30;
var ResourceTimelineViewLayout = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.scrollGridRef = d();
    this.timeBodyScrollerElRef = d();
    this.spreadsheetHeaderChunkElRef = d();
    this.rootElRef = d();
    this.ensureScrollGridResizeId = 0;
    this.state = {
      resourceAreaWidthOverride: null
    };
    this.ensureScrollGridResize = () => {
      if (this.ensureScrollGridResizeId) {
        clearTimeout(this.ensureScrollGridResizeId);
      }
      this.ensureScrollGridResizeId = setTimeout(() => {
        this.scrollGridRef.current.handleSizing(false);
      }, config.SCROLLGRID_RESIZE_INTERVAL + 1);
    };
  }
  render() {
    let { props, state, context } = this;
    let { options } = context;
    let stickyHeaderDates = !props.forPrint && getStickyHeaderDates(options);
    let stickyFooterScrollbar = !props.forPrint && getStickyFooterScrollbar(options);
    let sections = [
      {
        type: "header",
        key: "header",
        syncRowHeights: true,
        isSticky: stickyHeaderDates,
        chunks: [
          {
            key: "datagrid",
            elRef: this.spreadsheetHeaderChunkElRef,
            // TODO: allow the content to specify this. have general-purpose 'content' with obj with keys
            tableClassName: "fc-datagrid-header",
            rowContent: props.spreadsheetHeaderRows
          },
          {
            key: "divider",
            outerContent: y("td", { role: "presentation", className: "fc-resource-timeline-divider " + context.theme.getClass("tableCellShaded") })
          },
          {
            key: "timeline",
            content: props.timeHeaderContent
          }
        ]
      },
      {
        type: "body",
        key: "body",
        syncRowHeights: true,
        liquid: true,
        expandRows: Boolean(options.expandRows),
        chunks: [
          {
            key: "datagrid",
            tableClassName: "fc-datagrid-body",
            rowContent: props.spreadsheetBodyRows
          },
          {
            key: "divider",
            outerContent: y("td", { role: "presentation", className: "fc-resource-timeline-divider " + context.theme.getClass("tableCellShaded") })
          },
          {
            key: "timeline",
            scrollerElRef: this.timeBodyScrollerElRef,
            content: props.timeBodyContent
          }
        ]
      }
    ];
    if (stickyFooterScrollbar) {
      sections.push({
        type: "footer",
        key: "footer",
        isSticky: true,
        chunks: [
          {
            key: "datagrid",
            content: renderScrollShim
          },
          {
            key: "divider",
            outerContent: y("td", { role: "presentation", className: "fc-resource-timeline-divider " + context.theme.getClass("tableCellShaded") })
          },
          {
            key: "timeline",
            content: renderScrollShim
          }
        ]
      });
    }
    let resourceAreaWidth = state.resourceAreaWidthOverride != null ? state.resourceAreaWidthOverride : options.resourceAreaWidth;
    return y(ScrollGrid, { ref: this.scrollGridRef, elRef: this.rootElRef, liquid: !props.isHeightAuto && !props.forPrint, forPrint: props.forPrint, collapsibleWidth: false, colGroups: [
      { cols: props.spreadsheetCols, width: resourceAreaWidth },
      { cols: [] },
      { cols: props.timeCols }
    ], sections });
  }
  forceTimeScroll(left) {
    let scrollGrid = this.scrollGridRef.current;
    scrollGrid.forceScrollLeft(2, left);
  }
  forceResourceScroll(top) {
    let scrollGrid = this.scrollGridRef.current;
    scrollGrid.forceScrollTop(1, top);
  }
  getResourceScroll() {
    let timeBodyScrollerEl = this.timeBodyScrollerElRef.current;
    return timeBodyScrollerEl.scrollTop;
  }
  // Resource Area Resizing
  // ------------------------------------------------------------------------------------------
  // NOTE: a callback Ref for the resizer was firing multiple times with same elements (Preact)
  // that's why we use spreadsheetResizerElRef instead
  componentDidMount() {
    this.initSpreadsheetResizing();
  }
  componentWillUnmount() {
    this.destroySpreadsheetResizing();
  }
  initSpreadsheetResizing() {
    let { isRtl, pluginHooks } = this.context;
    let ElementDraggingImpl = pluginHooks.elementDraggingImpl;
    let spreadsheetHeadEl = this.spreadsheetHeaderChunkElRef.current;
    if (ElementDraggingImpl) {
      let rootEl = this.rootElRef.current;
      let dragging = this.spreadsheetResizerDragging = new ElementDraggingImpl(rootEl, ".fc-resource-timeline-divider");
      let dragStartWidth;
      let viewWidth;
      dragging.emitter.on("dragstart", () => {
        dragStartWidth = spreadsheetHeadEl.getBoundingClientRect().width;
        viewWidth = rootEl.getBoundingClientRect().width;
      });
      dragging.emitter.on("dragmove", (pev) => {
        let newWidth = dragStartWidth + pev.deltaX * (isRtl ? -1 : 1);
        newWidth = Math.max(newWidth, MIN_RESOURCE_AREA_WIDTH);
        newWidth = Math.min(newWidth, viewWidth - MIN_RESOURCE_AREA_WIDTH);
        this.setState({
          resourceAreaWidthOverride: newWidth
        }, this.ensureScrollGridResize);
      });
      dragging.setAutoScrollEnabled(false);
    }
  }
  destroySpreadsheetResizing() {
    if (this.spreadsheetResizerDragging) {
      this.spreadsheetResizerDragging.destroy();
    }
  }
};
var ResourceTimelineView = class extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.processColOptions = memoize(processColOptions);
    this.buildTimelineDateProfile = memoize(buildTimelineDateProfile);
    this.hasNesting = memoize(hasNesting);
    this.buildRowNodes = memoize(buildRowNodes);
    this.layoutRef = d();
    this.rowNodes = [];
    this.renderedRowNodes = [];
    this.buildRowIndex = memoize(buildRowIndex);
    this.handleSlatCoords = (slatCoords) => {
      this.setState({ slatCoords });
    };
    this.handleRowCoords = (rowCoords) => {
      this.rowCoords = rowCoords;
      this.scrollResponder.update(false);
    };
    this.handleMaxCushionWidth = (slotCushionMaxWidth) => {
      this.setState({
        slotCushionMaxWidth: Math.ceil(slotCushionMaxWidth)
        // for less rerendering TODO: DRY
      });
    };
    this.handleScrollLeftRequest = (scrollLeft) => {
      let layout = this.layoutRef.current;
      layout.forceTimeScroll(scrollLeft);
    };
    this.handleScrollRequest = (request) => {
      let { rowCoords } = this;
      let layout = this.layoutRef.current;
      let rowId = request.rowId || request.resourceId;
      if (rowCoords) {
        if (rowId) {
          let rowIdToIndex = this.buildRowIndex(this.renderedRowNodes);
          let index5 = rowIdToIndex[rowId];
          if (index5 != null) {
            let scrollTop = request.fromBottom != null ? rowCoords.bottoms[index5] - request.fromBottom : (
              // pixels from bottom edge
              rowCoords.tops[index5]
            );
            layout.forceResourceScroll(scrollTop);
          }
        }
        return true;
      }
      return null;
    };
    this.handleColWidthChange = (colWidths) => {
      this.setState({
        spreadsheetColWidths: colWidths
      });
    };
    this.state = {
      resourceAreaWidth: context.options.resourceAreaWidth,
      spreadsheetColWidths: []
    };
  }
  render() {
    let { props, state, context } = this;
    let { options, viewSpec } = context;
    let { superHeaderRendering, groupSpecs, orderSpecs, isVGrouping, colSpecs } = this.processColOptions(context.options);
    let tDateProfile = this.buildTimelineDateProfile(props.dateProfile, context.dateEnv, options, context.dateProfileGenerator);
    let rowNodes = this.rowNodes = this.buildRowNodes(props.resourceStore, groupSpecs, orderSpecs, isVGrouping, props.resourceEntityExpansions, options.resourcesInitiallyExpanded);
    let { slotMinWidth } = options;
    let slatCols = buildSlatCols(tDateProfile, slotMinWidth || this.computeFallbackSlotMinWidth(tDateProfile));
    return y(
      ViewContainer,
      { elClasses: [
        "fc-resource-timeline",
        !this.hasNesting(rowNodes) && "fc-resource-timeline-flat",
        "fc-timeline",
        options.eventOverlap === false ? "fc-timeline-overlap-disabled" : "fc-timeline-overlap-enabled"
      ], viewSpec },
      y(ResourceTimelineViewLayout, { ref: this.layoutRef, forPrint: props.forPrint, isHeightAuto: props.isHeightAuto, spreadsheetCols: buildSpreadsheetCols(colSpecs, state.spreadsheetColWidths, ""), spreadsheetHeaderRows: (contentArg) => y(
        SpreadsheetHeader,
        { superHeaderRendering, colSpecs, onColWidthChange: this.handleColWidthChange, rowInnerHeights: contentArg.rowSyncHeights }
      ), spreadsheetBodyRows: (contentArg) => y(_, null, this.renderSpreadsheetRows(rowNodes, colSpecs, contentArg.rowSyncHeights)), timeCols: slatCols, timeHeaderContent: (contentArg) => y(TimelineHeader, { clientWidth: contentArg.clientWidth, clientHeight: contentArg.clientHeight, tableMinWidth: contentArg.tableMinWidth, tableColGroupNode: contentArg.tableColGroupNode, dateProfile: props.dateProfile, tDateProfile, slatCoords: state.slatCoords, rowInnerHeights: contentArg.rowSyncHeights, onMaxCushionWidth: slotMinWidth ? null : this.handleMaxCushionWidth }), timeBodyContent: (contentArg) => y(ResourceTimelineGrid, { dateProfile: props.dateProfile, clientWidth: contentArg.clientWidth, clientHeight: contentArg.clientHeight, tableMinWidth: contentArg.tableMinWidth, tableColGroupNode: contentArg.tableColGroupNode, expandRows: contentArg.expandRows, tDateProfile, rowNodes, businessHours: props.businessHours, dateSelection: props.dateSelection, eventStore: props.eventStore, eventUiBases: props.eventUiBases, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, resourceStore: props.resourceStore, nextDayThreshold: context.options.nextDayThreshold, rowInnerHeights: contentArg.rowSyncHeights, onSlatCoords: this.handleSlatCoords, onRowCoords: this.handleRowCoords, onScrollLeftRequest: this.handleScrollLeftRequest, onRowHeightChange: contentArg.reportRowHeightChange }) })
    );
  }
  renderSpreadsheetRows(nodes, colSpecs, rowSyncHeights) {
    return nodes.map((node, index5) => {
      if (node.group) {
        return y(SpreadsheetGroupRow, { key: node.id, id: node.id, spreadsheetColCnt: colSpecs.length, isExpanded: node.isExpanded, group: node.group, innerHeight: rowSyncHeights[index5] || "" });
      }
      if (node.resource) {
        return y(SpreadsheetRow, { key: node.id, colSpecs, rowSpans: node.rowSpans, depth: node.depth, isExpanded: node.isExpanded, hasChildren: node.hasChildren, resource: node.resource, innerHeight: rowSyncHeights[index5] || "" });
      }
      return null;
    });
  }
  componentDidMount() {
    this.renderedRowNodes = this.rowNodes;
    this.scrollResponder = this.context.createScrollResponder(this.handleScrollRequest);
  }
  getSnapshotBeforeUpdate() {
    if (!this.props.forPrint) {
      return { resourceScroll: this.queryResourceScroll() };
    }
    return {};
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.renderedRowNodes = this.rowNodes;
    this.scrollResponder.update(prevProps.dateProfile !== this.props.dateProfile);
    if (snapshot.resourceScroll) {
      this.handleScrollRequest(snapshot.resourceScroll);
    }
  }
  componentWillUnmount() {
    this.scrollResponder.detach();
  }
  computeFallbackSlotMinWidth(tDateProfile) {
    return Math.max(30, (this.state.slotCushionMaxWidth || 0) / tDateProfile.slotsPerLabel);
  }
  queryResourceScroll() {
    let { rowCoords, renderedRowNodes } = this;
    if (rowCoords) {
      let layout = this.layoutRef.current;
      let trBottoms = rowCoords.bottoms;
      let scrollTop = layout.getResourceScroll();
      let scroll = {};
      for (let i = 0; i < trBottoms.length; i += 1) {
        let rowNode = renderedRowNodes[i];
        let elBottom = trBottoms[i] - scrollTop;
        if (elBottom > 0) {
          scroll.rowId = rowNode.id;
          scroll.fromBottom = elBottom;
          break;
        }
      }
      return scroll;
    }
    return null;
  }
};
ResourceTimelineView.addStateEquality({
  spreadsheetColWidths: isArraysEqual
});
function buildRowIndex(rowNodes) {
  let rowIdToIndex = {};
  for (let i = 0; i < rowNodes.length; i += 1) {
    rowIdToIndex[rowNodes[i].id] = i;
  }
  return rowIdToIndex;
}
function buildSpreadsheetCols(colSpecs, forcedWidths, fallbackWidth = "") {
  return colSpecs.map((colSpec, i) => ({
    className: colSpec.isMain ? "fc-main-col" : "",
    width: forcedWidths[i] || colSpec.width || fallbackWidth
  }));
}
function hasNesting(nodes) {
  for (let node of nodes) {
    if (node.group) {
      return true;
    }
    if (node.resource) {
      if (node.hasChildren) {
        return true;
      }
    }
  }
  return false;
}
function processColOptions(options) {
  let allColSpecs = options.resourceAreaColumns || [];
  let superHeaderRendering = null;
  if (!allColSpecs.length) {
    allColSpecs.push({
      headerClassNames: options.resourceAreaHeaderClassNames,
      headerContent: options.resourceAreaHeaderContent,
      headerDefault: () => "Resources",
      headerDidMount: options.resourceAreaHeaderDidMount,
      headerWillUnmount: options.resourceAreaHeaderWillUnmount
    });
  } else if (options.resourceAreaHeaderContent) {
    superHeaderRendering = {
      headerClassNames: options.resourceAreaHeaderClassNames,
      headerContent: options.resourceAreaHeaderContent,
      headerDidMount: options.resourceAreaHeaderDidMount,
      headerWillUnmount: options.resourceAreaHeaderWillUnmount
    };
  }
  let plainColSpecs = [];
  let groupColSpecs = [];
  let groupSpecs = [];
  let isVGrouping = false;
  for (let colSpec of allColSpecs) {
    if (colSpec.group) {
      groupColSpecs.push(Object.assign(Object.assign({}, colSpec), { cellClassNames: colSpec.cellClassNames || options.resourceGroupLabelClassNames, cellContent: colSpec.cellContent || options.resourceGroupLabelContent, cellDidMount: colSpec.cellDidMount || options.resourceGroupLabelDidMount, cellWillUnmount: colSpec.cellWillUnmount || options.resourceGroupLaneWillUnmount }));
    } else {
      plainColSpecs.push(colSpec);
    }
  }
  let mainColSpec = plainColSpecs[0];
  mainColSpec.isMain = true;
  mainColSpec.cellClassNames = mainColSpec.cellClassNames || options.resourceLabelClassNames;
  mainColSpec.cellContent = mainColSpec.cellContent || options.resourceLabelContent;
  mainColSpec.cellDidMount = mainColSpec.cellDidMount || options.resourceLabelDidMount;
  mainColSpec.cellWillUnmount = mainColSpec.cellWillUnmount || options.resourceLabelWillUnmount;
  if (groupColSpecs.length) {
    groupSpecs = groupColSpecs;
    isVGrouping = true;
  } else {
    let hGroupField = options.resourceGroupField;
    if (hGroupField) {
      groupSpecs.push({
        field: hGroupField,
        labelClassNames: options.resourceGroupLabelClassNames,
        labelContent: options.resourceGroupLabelContent,
        labelDidMount: options.resourceGroupLabelDidMount,
        labelWillUnmount: options.resourceGroupLabelWillUnmount,
        laneClassNames: options.resourceGroupLaneClassNames,
        laneContent: options.resourceGroupLaneContent,
        laneDidMount: options.resourceGroupLaneDidMount,
        laneWillUnmount: options.resourceGroupLaneWillUnmount
      });
    }
  }
  let allOrderSpecs = options.resourceOrder || DEFAULT_RESOURCE_ORDER;
  let plainOrderSpecs = [];
  for (let orderSpec of allOrderSpecs) {
    let isGroup = false;
    for (let groupSpec of groupSpecs) {
      if (groupSpec.field === orderSpec.field) {
        groupSpec.order = orderSpec.order;
        isGroup = true;
        break;
      }
    }
    if (!isGroup) {
      plainOrderSpecs.push(orderSpec);
    }
  }
  return {
    superHeaderRendering,
    isVGrouping,
    groupSpecs,
    colSpecs: groupColSpecs.concat(plainColSpecs),
    orderSpecs: plainOrderSpecs
  };
}
var css_248z2 = ".fc .fc-resource-timeline-divider{cursor:col-resize;width:3px}.fc .fc-resource-group{font-weight:inherit;text-align:inherit}.fc .fc-resource-timeline .fc-resource-group:not([rowspan]){background:var(--fc-neutral-bg-color)}.fc .fc-timeline-lane-frame{position:relative}.fc .fc-timeline-overlap-enabled .fc-timeline-lane-frame .fc-timeline-events{box-sizing:content-box;padding-bottom:10px}.fc-timeline-body-expandrows td.fc-timeline-lane{position:relative}.fc-timeline-body-expandrows .fc-timeline-lane-frame{position:static}.fc-datagrid-cell-frame-liquid{height:100%}.fc-liquid-hack .fc-datagrid-cell-frame-liquid{bottom:0;height:auto;left:0;position:absolute;right:0;top:0}.fc .fc-datagrid-header .fc-datagrid-cell-frame{align-items:center;display:flex;justify-content:flex-start;position:relative}.fc .fc-datagrid-cell-resizer{bottom:0;cursor:col-resize;position:absolute;top:0;width:5px;z-index:1}.fc .fc-datagrid-cell-cushion{overflow:hidden;padding:8px;white-space:nowrap}.fc .fc-datagrid-expander{cursor:pointer;opacity:.65}.fc .fc-datagrid-expander .fc-icon{display:inline-block;width:1em}.fc .fc-datagrid-expander-placeholder{cursor:auto}.fc .fc-resource-timeline-flat .fc-datagrid-expander-placeholder{display:none}.fc-direction-ltr .fc-datagrid-cell-resizer{right:-3px}.fc-direction-rtl .fc-datagrid-cell-resizer{left:-3px}.fc-direction-ltr .fc-datagrid-expander{margin-right:3px}.fc-direction-rtl .fc-datagrid-expander{margin-left:3px}";
injectStyles(css_248z2);

// ../../../../../../Users/jin/node_modules/@fullcalendar/resource-timeline/index.js
var index4 = createPlugin({
  name: "@fullcalendar/resource-timeline",
  premiumReleaseDate: "2025-04-02",
  deps: [
    index,
    index3,
    index2
  ],
  initialView: "resourceTimelineDay",
  views: {
    resourceTimeline: {
      type: "timeline",
      component: ResourceTimelineView,
      needsResourceData: true,
      resourceAreaWidth: "30%",
      resourcesInitiallyExpanded: true,
      eventResizableFromStart: true
      // TODO: not DRY with this same setting in the main timeline config
    },
    resourceTimelineDay: {
      type: "resourceTimeline",
      duration: { days: 1 }
    },
    resourceTimelineWeek: {
      type: "resourceTimeline",
      duration: { weeks: 1 }
    },
    resourceTimelineMonth: {
      type: "resourceTimeline",
      duration: { months: 1 }
    },
    resourceTimelineYear: {
      type: "resourceTimeline",
      duration: { years: 1 }
    }
  }
});
export {
  index4 as default
};
//# sourceMappingURL=@fullcalendar_resource-timeline.js.map
