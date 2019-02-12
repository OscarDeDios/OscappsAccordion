import DomLib from './lib/DomLib'

const MAIN_CLASS_NAME = 'OscappsAccordion'
const HEADER_CLASS_NAME = 'OscappsAccordion-header'
const SECTION_CLASS_NAME = 'OscappsAccordion-section'
const ACTIVE_CLASS_NAME = 'is-active'
const HIDE_ICON_CLASS_NAME = 'OscappsAccordion--hide-icon'
const MULTIPLE_SELECTION_CLASS_NAME = 'is-multiple-selection'

const HEADER_SECTION_SELECTOR = `.${MAIN_CLASS_NAME} > dt, .${MAIN_CLASS_NAME} > .${HEADER_CLASS_NAME}`
const CONTENT_SECTION_SELECTOR = `.${MAIN_CLASS_NAME} > dd, .${MAIN_CLASS_NAME} > .${SECTION_CLASS_NAME}`
const TOGGLE_OSCAPPS_ACCORDION_TAG_NAME = 'DT'

const AJAX_SPINNER = '<div class="OscappsSpinner"><div class="OscappsSpinner--ring"></div></div>'
const AJAX_READ_MARK = 'content-loaded'
const AJAX_LOAD_ERROR = 'Loading error'

/**
 * Plugin para mostrar y ocultar secciones de una lista con un efecto de "deslizamiento"
 *
 * @class OscappsAccordion
 */
class OscappsAccordion {
  /**
   * Crea una instancia de OscappsAccordion sobre una "description list" (dl). Trata los valores de las opciones de creación.
   *
   * @param {object} element elemento DOM (dl) sobre el que se va a crear el efecto acordeón
   * @param {object} {} opciones de creación del plugin con los valores por defecto inicializados
   * @memberof OscappsAccordion
   */
  constructor (element, {
    arrowIcon = true,
    multipleSelection = false,
    ajaxContent = false,
    onOpen = false,
    animationTime = false
  } = {}) {
    if (!element) {
      return false
    }

    this.OscappsAccordionElement = element
    this.multipleSelection = multipleSelection || DomLib.hasClass(element, MULTIPLE_SELECTION_CLASS_NAME)
    this.onOpen = onOpen
    this.ajaxContent = ajaxContent

    !arrowIcon && this._hideArrowIcon()

    this._addClickEventDelegation()

    this._initActiveSections()

    if (!DomLib.hasClass(this.OscappsAccordionElement, MAIN_CLASS_NAME)) {
      DomLib.addClass(this.OscappsAccordionElement, MAIN_CLASS_NAME)
    }

    animationTime && animationTime >= 0 && this._changeDefaultAnimationTime(animationTime)
  }

  /**
   * Oculta el icono que indica si la sección de la acordeón esta visible u oculta

   * @private
   * @memberof OscappsAccordion
   */
  _hideArrowIcon () {
    const sectionsHeader = this._getHeaderSections()

    for (let sectionHeader of sectionsHeader) {
      DomLib.addClass(sectionHeader, HIDE_ICON_CLASS_NAME)
    }
  }

  /**
   * Añade un listener al acordeón para detectar el click para abrir la sección. Usa el patrón "event delegation" para tener un
   * solo listener en lugar de uno para cada sección, por lo que en cada click debe comprobar que se realiza sobre una cabecera de
   * sección.
   *
   * @private
   * @memberof OscappsAccordion
   */
  _addClickEventDelegation () {
    this.OscappsAccordionElement.addEventListener('click', (event) => {
      if (this._isHeaderSection(event.target)) {
        this._toggle(event.target)
      }
    })
  }

  /**
   * Comprueba si el elemento es una cabecera de sección (un dt), también comprueba que el dt sea hijo directo del dl principal
   * de esta forma dentro de una sección se podría tener un dl normal sin problema o incluso otra acordeón anidada.
   *
   * @param {object} element elemnto DOM sobre el que se ha hecho click
   * @returns {boolean} true si el elemento es una cabera de sección (dt)
   * @private
   * @memberof OscappsAccordion
   */
  _isHeaderSection (element) {
    return (element.tagName === TOGGLE_OSCAPPS_ACCORDION_TAG_NAME ||
      DomLib.hasClass(element, HEADER_CLASS_NAME)) &&
      element.parentElement === this.OscappsAccordionElement
  }

  /**
   * Inicializa las secciones definidas como abiertas en el momento de la creación. Si hay más de una y la acordeón no es
   * de tipo se selección múltiple, sólo abre la primera y las demás clases que indican sección activa las quita.
   *
   * @private
   * @memberof OscappsAccordion
   */
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

  /**
   * Cambia el tiempo por defecto de la animación al mostrar y ocultar la sección.
   *
   * @param {integer} animationTime tiempo en milisegundos de la animación.
   * @private
   * @memberof OscappsAccordion
   */
  _changeDefaultAnimationTime (animationTime) {
    const sectionsContent = this._getContentSections()

    for (let sectionContent of sectionsContent) {
      sectionContent.style.transitionDuration = `${animationTime / 1000}s`
    }
  }

  /**
   * Muestra la sección si estaba oculta o la oculta si estaba visible. Si no es selección multiple oculta la otra posible
   * sección visible.
   *
   * @param {object} element elemento DOM de la cabecera de la sección
   * @private
   * @memberof OscappsAccordion
   */
  _toggle (element) {
    if (DomLib.hasClass(element, ACTIVE_CLASS_NAME)) {
      this._hideSection(element)
    } else {
      !this.multipleSelection && this._hideOtherActiveSection(element)

      this._showSection(element)
    }
  }

  /**
   * Oculta la sección
   *
   * @param {object} element elemento DOM de la cabecera de la sección a ocultar
   * @private
   * @memberof OscappsAccordion
   */
  _hideSection (element) {
    DomLib.removeClass(element, ACTIVE_CLASS_NAME)
    this._resetMaxHeightContentSection(element)
  }

  /**
  * Muestra la sección. Ejecuta el callback de apertura si se ha informado en las opciones.
  *
  * @param {object} element elemento DOM de la cabecera de la sección a mostrar
  * @private
  * @memberof OscappsAccordion
  */
  _showSection (element) {
    this.ajaxContent && this._checkAjaxSection(element)

    DomLib.addClass(element, ACTIVE_CLASS_NAME)
    this._setMaxHeightContentSectionToFull(element)

    this._isFunction(this.onOpen) && this.onOpen()
  }

  _hideOtherActiveSection () {
    const activeElement = this.OscappsAccordionElement.querySelector(`.${ACTIVE_CLASS_NAME}`)

    if (activeElement && activeElement.parentElement === this.OscappsAccordionElement) {
      DomLib.removeClass(activeElement, ACTIVE_CLASS_NAME)
      this._resetMaxHeightContentSection(activeElement)
    }
  }

  /**
   * Cambia la altura máxima del contenido de la sección activa a su altura.
   * Este cambio de maxHeight es para que la animación "slide Up" y "slide Down" funcione correctamente.
   *
   * @param {object} element elemento DOM de la sección que se está mostrando u ocultando
   * @private
   * @memberof OscappsAccordion
   */
  _setMaxHeightContentSectionToFull (element) {
    element.nextElementSibling.style.maxHeight = `${element.nextElementSibling.scrollHeight}px`
  }

  /**
  * Cambia la altura máxima del contenido de la sección activa a 0.
  * Este cambio de maxHeight es para que la animación "slide Up" y "slide Down" funcione correctamente.
  *
  * @param {object} element elemento DOM de la sección que se está mostrando u ocultando
  * @private
  * @memberof OscappsAccordion
  */
  _resetMaxHeightContentSection (element) {
    element.nextElementSibling.style.maxHeight = 0
  }

  /**
  * Función asíncrona que carga contenido de una sección mediante Ajax. Sólo la lee una vez.
  *
  * @param {object} element
  * @memberof OscappsAccordion
  */
  async _checkAjaxSection (element) {
    const headerSections = this._getHeaderSections()

    var index = this._getIndexElement(headerSections, element)

    for (const ajaxContent of this.ajaxContent) {
      if (ajaxContent.indexSection === index && !this._isAlreadyRead(headerSections, index)) {
        let headerSection = headerSections[index]
        let contentSection = headerSection.nextElementSibling

        contentSection.innerHTML = AJAX_SPINNER

        const htmlContent = await this._getAjaxData(ajaxContent.url)

        contentSection.innerHTML = htmlContent
        this._setMaxHeightContentSectionToFull(headerSection)

        this._markAsRead(headerSections, index)
      }
    }
  }

  _isAlreadyRead (headerSections, index) {
    return headerSections[index].getAttribute(AJAX_READ_MARK)
  }

  _markAsRead (headerSections, index) {
    headerSections[index].setAttribute(AJAX_READ_MARK, true)
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

  _getAjaxData (url) {
    return fetch(url)
      .then((response) => {
        return response.text()
      })
      .catch((response) => {
        return AJAX_LOAD_ERROR
      })
  }

  open (indexSection) {
    const elementSection = this._getElementSectionByIndex(indexSection)
    elementSection && this._showSection(elementSection)

    return this
  }

  openAll () {
    const sectionsHeader = this._getHeaderSections()

    for (let sectionHeader of sectionsHeader) {
      this._showSection(sectionHeader)
    }

    return this
  }

  close (indexSection) {
    const elementSection = this._getElementSectionByIndex(indexSection)
    elementSection && this._hideSection(elementSection)

    return this
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

  toggle (indexSection) {
    if (this.isOpen(indexSection)) {
      this.close(indexSection)
    } else {
      this.open(indexSection)
    }
  }

  _getElementSectionByIndex (indexSection) {
    return this._getHeaderSections()[indexSection]
  }

  _isFunction (f) {
    return Object.prototype.toString.call(f) === '[object Function]'
  }
}

export default OscappsAccordion
