import rawStyles from './KeyShortcut.css?raw'

/**
 * @class KeyShortcut
 * @extends HTMLElement
 * @example A simple usage
 * ```html
 * <!-- Default operation (windows) -->
 * <key-shortcut keys="ctrl+alt+x x"></key-shortcut>
 * <key-shortcut keys="ctrl+shift+x"></key-shortcut>
 * <!-- Force mac keys (using attr mac) -->
 * <key-shortcut mac keys="cmd+alt+x x"></key-shortcut>
 * <!-- or (using mac unique key cmd)-->
 * <key-shortcut keys="cmd+shift+x"></key-shortcut>
 * ```
 */
class KeyShortcut extends HTMLElement {
  /**
   * @type {string}
   */
  keys: string | null = null
  /**
   * @type {boolean}
   */
  forceMac: boolean = false
  /**
   * @type {Set<string>}
   */
  pressedKeys: Set<string> = new Set()

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback(): void {
    this.keys = this.getAttribute('keys') ?? 'Ctrl + T'
    this.forceMac = this.hasAttribute('mac')
    this.render()
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  disconnectedCallback(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  static get observedAttributes() {
    return ['keys', 'mac']
  }

  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   * @returns
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return

    switch (name) {
      case 'keys':
        this.keys = newValue
        break
      case 'mac':
        this.forceMac = this.hasAttribute('mac')
        break
    }
    this.render()
  }

  /**
   * Detects the current operating system based on the user agent.
   * @returns {import('./os-key-shortcut.d').OS} by default 'unknown'
   */
  detectOS(): string {
    if (this.forceMac) return 'mac'

    const ua = navigator.userAgent.toLowerCase()
    if (/macintosh|mac os x/.test(ua)) return 'mac'
    if (/windows nt/.test(ua)) return 'windows'
    if (/android/.test(ua)) return 'android'
    if (/iphone|ipad|ipod/.test(ua)) return 'ios'
    if (/linux/.test(ua)) return 'linux'

    return 'unknown'
  }

  /**
   * Parses the `keys` attribute and returns formatted HTML for keyboard display.
   * Supports multi-key sequences like: "ctrl+shift+t t"
   */
  formatKeys(): string {
    const os = this.detectOS()
    const isMac = os === 'mac'

    const raw = this.keys
    if (!raw) return ''

    /**
     * @type { Array<string>}
     */
    const sequences: Array<string> = raw.split(/\s+/)

    return sequences
      .map(seq => {
        const keys = seq.split('+').map(k => {
          switch (k) {
            case 'win':
              return '⊞'
            case 'ctrl':
              return isMac ? '⌘' : 'Ctrl'
            case 'cmd':
              return '⌘'
            case 'alt':
              return isMac ? '⌥' : 'Alt'
            case 'shift':
              return 'Shift'
            default:
              return k.toUpperCase()
          }
        })

        return /* html */ `<span class="combo">${keys.map(k => /* html */ `<kbd data-key="${k}">${k}</kbd>`).join('')}</span>`
      })
      .join(/* html */ `<span>&nbsp;</span>`)
  }

  /**
   * @param key
   */
  normalizeKey(key: string): string {
    console.log(key)
    const isMac = navigator.platform.includes('Mac')
    switch (key) {
      case 'Control':
        return isMac ? '⌘' : 'Ctrl'
      case 'Meta':
        return isMac ? '⌘' : 'Win'
      case 'Alt':
        return isMac ? '⌥' : 'Alt'
      case 'Shift':
        return 'Shift'
      case ' ':
        return 'Space'
      default:
        return key.length === 1 ? key.toUpperCase() : key
    }
  }

  /**
   * @param event
   */
  handleKeyDown = ({ key }: KeyboardEvent): void => {
    console.log('key', key)
    const normalizeKey = this.normalizeKey(key)
    this.pressedKeys.add(normalizeKey)
    this.highlightKeys()

    if (['Alt', 'Ctrl', 'Shift', '⌥', '⌘', 'Win'].includes(key)) {
      setTimeout(() => {
        this.pressedKeys.delete(key)
        this.highlightKeys()
      }, 150) // ajustá según tu animación
    }
  }

  /**
   * @param event
   */
  handleKeyUp = ({ key }: KeyboardEvent): void => {
    const normalizeKey = this.normalizeKey(key)
    this.pressedKeys.delete(normalizeKey)
    this.highlightKeys()
  }

  highlightKeys(): void {
    const allKeys = Array.from(this.shadowRoot!.querySelectorAll('kbd')) ?? []
    allKeys.map(kbdEl => {
      const keyAttr = kbdEl.getAttribute('data-key')
      if (keyAttr && this.pressedKeys.has(keyAttr)) {
        kbdEl.classList.add('pressed')
      } else {
        kbdEl.classList.remove('pressed')
      }
    })
  }

  /**
   * Returns the CSS styles for the component.
   */
  static get styles(): string {
    return rawStyles
  }

  render(): void {
    // @ts-ignore
    this.shadowRoot.innerHTML = `
      <style>${KeyShortcut.styles}</style>
      <div class="shortcut-sequence">${this.formatKeys()}</div>
    `
  }
}

customElements.define('key-shortcut', KeyShortcut)
