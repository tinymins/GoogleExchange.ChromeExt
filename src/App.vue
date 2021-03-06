<template>
  <transition name="fade" mode="out-in">
    <div
      class="app"
      :style="{
        height: bodyAutoHeight ? null : '100%',
        display: bodyAutoHeight ? null : 'flex',
        flexDirection: bodyAutoHeight ? null : 'column',
        boxSizing: bodyAutoHeight ? null : 'border-box',
        overflow: bodyScrollable ? null : 'hidden',
        padding: `${headerHeight}px ${viewportRight}px ${footerHeight}px ${viewportLeft}px`,
      }"
    >
      <router-view name="static"></router-view>
      <router-view name="header" :style="{ flex: bodyAutoHeight ? null : '0 0 auto' }"></router-view>
      <router-view name="main" :style="{ flex: bodyAutoHeight ? null : '1 1 auto' }"></router-view>
      <router-view name="footer" :style="{ flex: bodyAutoHeight ? null : '0 0 auto' }"></router-view>
    </div>
  </transition>
</template>

<script>
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */
import { mapState, mapMutations, mapGetters } from 'vuex';
import { Loading, Message, MessageBox } from 'element-ui';
import { COMMON } from '@/store/types';
import { getElementPath, safeCall } from '@/utils/util';
import { isInMobileDevice } from '@/utils/environment';
import safeAreaInsets from 'safe-area-insets';

export default {
  computed: {
    ...mapState('common', [
      'loadings',
      'toasts',
      'dialogs',
      'actionsheets',
      'viewportTop',
      'viewportRight',
      'viewportBottom',
      'viewportLeft',
      'bodyScrollable',
      'bodyAutoHeight',
    ]),
    ...mapGetters('common', ['headerHeight', 'footerHeight']),
    loading() {
      return this.loadings[0];
    },
    toast() {
      return this.toasts[0];
    },
    dialog() {
      return this.dialogs[0];
    },
    actionsheet() {
      return this.actionsheets[0];
    },
  },
  watch: {
    loading(loading, old) {
      if (loading === old) {
        return;
      }
      if (loading) {
        const text = this.loadings.map(c => c.text).filter(_ => _).join(' | ');
        if (this.insLoading) {
          this.insLoading.text = text;
        } else {
          this.insLoading = Loading.service({
            lock: true,
            text,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          });
        }
      } else if (this.insLoading) {
        this.insLoading.close();
        this.insLoading = null;
      }
    },
    toast(toast, old) {
      if (toast === old) {
        return;
      }
      if (toast) {
        Message({
          message: toast.text,
          type: toast.type,
          duration: toast.time,
          onClose: () => this.$hideToast(toast),
        });
      }
    },
    dialog(dialog, old) {
      if (dialog === old) {
        return;
      }
      if (old && old.onclose) {
        safeCall(old.onclose);
      }
      if (dialog) {
        MessageBox({
          title: dialog.title,
          message: dialog.content,
          callback: () => this.$hideDialog(dialog),
        });
      }
    },
    actionsheet(actionsheet, old) {
      if (actionsheet === old) {
        return;
      }
      if (actionsheet) {
        console.warn('unhandled actionsheet!', actionsheet);
        this.$hideActionsheet(actionsheet);
      }
    },
  },
  mounted() {
    if (isInMobileDevice()) {
      safeAreaInsets.onChange(this.onresize);
      // disable zoom
      window.addEventListener('gesturestart', (e) => {
        e.preventDefault();
      });
      window.addEventListener('touchmove', (e) => {
        const event = e.originalEvent || e;
        if (event.scale && event.scale !== 1) {
          event.preventDefault();
        }
      }, { capture: true, passive: false, once: false });
      // disable selection
      if (typeof document.body.onselectstart !== 'undefined') {
        document.body.onselectstart = e => this.isTagSelectable(e.target);
      }
      if (typeof document.body.style.mozUserSelect !== 'undefined') {
        document.body.style.mozUserSelect = 'none';
      }
      document.body.onmousedown = e => this.isTagSelectable(e.target);
      // disable wechat context menu
      document.body.oncontextmenu = e => !getElementPath(e.target)
        .some($dom => $dom.attributes && $dom.attributes['disable-context-menu']);
    }
    this.onresize();
    this.updateHeaderSize();
    window.addEventListener('resize', this.onresize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onresize);
  },
  methods: {
    ...mapMutations('common', {
      setViewportSize: COMMON.SET_VIEWPORT_SIZE,
    }),
    isTagSelectable(element) {
      return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || getElementPath(element)
        .some($dom => $dom.attributes && $dom.attributes['allow-user-select']);
    },
    updateHeaderSize() {
      this.setViewportSize({
        top: safeAreaInsets.top,
        bottom: safeAreaInsets.bottom,
        left: safeAreaInsets.left,
        right: safeAreaInsets.right,
        width: window.innerWidth - safeAreaInsets.left - safeAreaInsets.right,
        height: window.innerHeight - safeAreaInsets.top - safeAreaInsets.bottom,
      });
    },
    onresize() {
      setTimeout(this.updateHeaderSize, 300);
    },
  },
};
</script>
