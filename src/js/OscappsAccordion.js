import DomLib from './lib/DomLib'

const DEFAULT_OSCAPPS_ACCORDION_CLASS_NAME = 'OscappsAccordion'
const HEADER_SECTION_SELECTOR = `.${DEFAULT_OSCAPPS_ACCORDION_CLASS_NAME} > dt`
const CONTENT_SECTION_SELECTOR = `.${DEFAULT_OSCAPPS_ACCORDION_CLASS_NAME} > dd`
const ACTIVE_CLASS_NAME = 'OscappsAccordion--active'
const MULTIPLE_SELECTION_CLASS_NAME = 'multiple-selection'
const HIDE_ICON_CLASS_NAME = 'OscappsAccordion--hide-icon'
const TOGGLE_OSCAPPS_ACCORDION_TAG_NAME = 'DT'

/**
 *
 *
 * @class OscappsAccordion
 */
class OscappsAccordion {
  /**
   * Crea una instancia de OscappsAccordion.
   * @param {*} element
   * @param {*} [{
   *     arrowIcon = true,
   *     multipleSelection = false,
   *     ajaxContent = false,
   *     onOpen = false,
   *     animationTime = false
   *   }={}]
   * @memberof OscappsAccordion
   */
  constructor (element, {
    arrowIcon = true,
    multipleSelection = false,
    ajaxContent = false,
    onOpen = false,
    animationTime = false
  } = {}) {
    this.OscappsAccordionElement = element
    this.multipleSelection = multipleSelection || DomLib.hasClass(element, MULTIPLE_SELECTION_CLASS_NAME)
    this.onOpen = onOpen
    this.ajaxContent = ajaxContent

    !arrowIcon && this._hideArrowIcon()

    this._addClickEventDelegation()

    this._initActiveSections()

    // @TODO refactor a función
    if (!DomLib.hasClass(this.OscappsAccordionElement, DEFAULT_OSCAPPS_ACCORDION_CLASS_NAME)) {
      DomLib.addClass(this.OscappsAccordionElement, DEFAULT_OSCAPPS_ACCORDION_CLASS_NAME)
    }

    animationTime && animationTime >= 0 && this._changeDefaultAnimationTime(animationTime)
  }

  _addClickEventDelegation () {
    this.OscappsAccordionElement.addEventListener('click', (event) => {
      if (this._isHeaderSection(event.target)) {
        this._toggle(event.target)
      }
    })
  }

  _hideArrowIcon () {
    const sectionsHeader = this._getHeaderSections()

    for (let sectionHeader of sectionsHeader) {
      DomLib.addClass(sectionHeader, HIDE_ICON_CLASS_NAME)
    }
  }

  _isHeaderSection (element) {
    return element.tagName === TOGGLE_OSCAPPS_ACCORDION_TAG_NAME && element.parentElement === this.OscappsAccordionElement
  }

  _changeDefaultAnimationTime (animationTime) {
    const sectionsContent = this._getContentSections()

    for (let sectionContent of sectionsContent) {
      sectionContent.style.transitionDuration = `${animationTime / 1000}s`
    }
  }

  _initActiveSections () {
    const activeSections = this.OscappsAccordionElement.querySelectorAll(`.${ACTIVE_CLASS_NAME}`)

    for (const [index, activeSection] of activeSections.entries()) {
      if (this.multipleSelection || index === 0) {
        this._showSection(activeSection)
      } else {
        DomLib.removeClass(activeSection, ACTIVE_CLASS_NAME)
      }
    }
  }

  _toggle (element) {
    if (DomLib.hasClass(element, ACTIVE_CLASS_NAME)) {
      this._hideSection(element)
    } else {
      !this.multipleSelection && this._hideOtherActiveSection(element)

      this._showSection(element)
    }
  }

  _hideSection (element) {
    DomLib.removeClass(element, ACTIVE_CLASS_NAME)
    this._resetMaxHeightContentSection(element)
  }

  _showSection (element) {
    DomLib.addClass(element, ACTIVE_CLASS_NAME)
    this._setMaxHeightContentSectionToFull(element)

    !!this.ajaxContent && this._checkAjaxSection(element)
    this._isFunction(this.onOpen) && this.onOpen()
  }

  _hideOtherActiveSection () {
    const activeElement = this.OscappsAccordionElement.querySelector(`.${ACTIVE_CLASS_NAME}`)

    if (activeElement) {
      DomLib.removeClass(activeElement, ACTIVE_CLASS_NAME)
      this._resetMaxHeightContentSection(activeElement)
    }
  }

  /**
   * Cambia la altura máxima del contenido de la sección activa. Si el parámetro maximumHeight es true asigna el tamaño
   * máximo del elemento en caso contrario 0.
   * Este cambio de maxHeight es para que la animación "slide Up" y "slide Down" funcione correctamente.
   *
   * @param {object} element elemento DOM de la sección que se está mostrando u ocultando
   * @param {boolean} [maximumHeight=false] indica si se pone la máxima altura o la mínima (0)
   * @private
   * @memberof OscappsAccordion
   */
  _setMaxHeightContentSectionToFull (element) {
    element.nextElementSibling.style.maxHeight = `${element.nextElementSibling.scrollHeight}px`
  }

  _resetMaxHeightContentSection (element) {
    element.nextElementSibling.style.maxHeight = 0
  }

  async _checkAjaxSection (element) {
    const sectionsHeaders = this._getHeaderSections()

    var index = this._getIndexElement(sectionsHeaders, element)

    // @TODO refactor
    for (const ajaxContent of this.ajaxContent) {
      if (ajaxContent.section === index && !sectionsHeaders[index].getAttribute('content-loaded')) {
        sectionsHeaders[index].nextElementSibling.innerHTML = '<div class="spinner"><div class="lds-dual-ring"></div></div>'
        const htmlContent = await this._getAjaxData(ajaxContent)
        sectionsHeaders[index].nextElementSibling.innerHTML = htmlContent
        sectionsHeaders[index].setAttribute('content-loaded', true)
        this._setMaxHeightContentSectionToFull(sectionsHeaders[index])
      }
    }
  }

  _getIndexElement (elementList, element) {
    return Array.prototype.indexOf.call(elementList, element)
  }

  _getHeaderSections () {
    return this.OscappsAccordionElement.querySelectorAll(HEADER_SECTION_SELECTOR)
  }

  _getContentSections () {
    return this.OscappsAccordionElement.querySelectorAll(CONTENT_SECTION_SELECTOR)
  }

  _getAjaxData (ajaxContent) {
    return fetch(ajaxContent.url)
      .then((response) => {
        return response.text()
      })
      .catch((response) => {
        console.log(response)
      })
  }

  open (indexSection) {
    const elementSection = this._getElementSectionByIndex(indexSection)
    elementSection && this._showSection(elementSection)
  }

  openAll () {
    const sectionsHeader = this._getHeaderSections()

    for (let sectionHeader of sectionsHeader) {
      this._showSection(sectionHeader)
    }
  }

  close (indexSection) {
    const elementSection = this._getElementSectionByIndex(indexSection)
    elementSection && this._hideSection(elementSection)
  }

  closeAll () {
    const sectionsHeader = this._getHeaderSections()

    for (let sectionHeader of sectionsHeader) {
      this._hideSection(sectionHeader)
    }
  }

  isOpen (indexSection) {
    const sectionsHeader = this._getHeaderSections()

    return sectionsHeader[indexSection] && DomLib.hasClass(sectionsHeader[indexSection], ACTIVE_CLASS_NAME)
  }

  _getElementSectionByIndex (indexSection) {
    return this._getHeaderSections()[indexSection]
  }

  _isFunction (f) {
    return Object.prototype.toString.call(f) === '[object Function]'
  }
}

export default OscappsAccordion
