import DomLib from './lib/DomLib'

export const MAIN_CLASS_NAME = 'OscappsAccordion'
export const HEADER_CLASS_NAME = 'OscappsAccordion-header'
export const SECTION_CLASS_NAME = 'OscappsAccordion-section'
export const ACTIVE_CLASS_NAME = 'is-active'
export const HIDE_ICON_CLASS_NAME = 'OscappsAccordion--hidden-icon'
export const MULTIPLE_SELECTION_CLASS_NAME = 'is-multiple-selection'

export const HEADER_SECTION_SELECTOR = `.${MAIN_CLASS_NAME} > dt, .${MAIN_CLASS_NAME} > .${HEADER_CLASS_NAME}`
export const CONTENT_SECTION_SELECTOR = `.${MAIN_CLASS_NAME} > dd, .${MAIN_CLASS_NAME} > .${SECTION_CLASS_NAME}`
export const TOGGLE_OSCAPPS_ACCORDION_TAG_NAME = 'DT'

export const AJAX_SPINNER = '<div class="OscappsSpinner"><div class="OscappsSpinner-ring"></div></div>'
export const AJAX_READ_MARK = 'content-loaded'
export const AJAX_LOAD_ERROR = 'Loading error'

/**
 * Plugin para mostrar y ocultar secciones de una lista con un efecto de "deslizamiento"
 *
 * @class OscappsAccordion
 */
class OscappsAccordion {
  /**
   * Crea una instancia de OscappsAccordion sobre una "description list" (dl). Trata los valores de las opciones de creación.
   *
   * @param {object} element elemento DOM sobre el que se va a crear el efecto acordeón
   * @param {object} options opciones de creación del plugin con los valores por defecto inicializados
   * @param {boolean} options.arrowIcon true si se quiere el icono que indica si la sección está abierta o cerrada
   * @param {boolean} options.multipleSelection true si se quiere abrir más de una sección a la vez
   * @param {array} options.ajaxContent lista de objetos que indican una url y el índice de una sección para poner
   * como contenido de esa sección el html que haya en esa url
   * @param {function} options.onOpen callback opcional a ejecutar al abrir una sección
   * @param {integer} options.animationTime tiempo de animación al mostrar u ocultar una sección
   * @memberof OscappsAccordion
   */
  constructor (element, {
    arrowIcon = true,
    multipleSelection = false,
    ajaxContent = false,
    onOpen = false,
    animationTime = false
  } = {}) {
    if (!element || !DomLib.isDomElement(element)) {
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
    DomLib.addClass(this.OscappsAccordionElement, HIDE_ICON_CLASS_NAME)
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
   * Comprueba si el elemento es una cabecera de sección (un dt u otro elemento con la clase de header), también comprueba
   * que el header sea hijo directo del componente principal de esta forma dentro de una sección se podría tener un dl
   * normal sin problema o incluso otra acordeón anidada.
   *
   * @param {object} element elemnto DOM sobre el que se ha hecho click
   * @returns {boolean} true si el elemento es una cabera de sección
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
      !this.multipleSelection && this.closeAll(element)

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
  * Si hay definido contenido ajax accede a él.
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
  * Función asíncrona que carga contenido de una sección mediante Ajax.
  *
  * @private
  * @param {object} element elemento DOM, cabecera de sección que se quiere mostrar.
  * @memberof OscappsAccordion
  */
  _checkAjaxSection (element) {
    const headerSections = this._getHeaderSections()

    var index = this._getIndexElement(headerSections, element)

    for (const ajaxContent of this.ajaxContent) {
      if (ajaxContent.indexSection === index && !this._isAlreadyRead(headerSections[index])) {
        let headerSection = headerSections[index]
        let contentSection = headerSection.nextElementSibling

        contentSection.innerHTML = AJAX_SPINNER

        this._getAjaxData(ajaxContent.url, (htmlContent) => {
          this._putContentInElement(headerSection, contentSection, htmlContent)
          this._markAsRead(headerSections[index])
        }, () => {
          this._putContentInElement(headerSection, contentSection, AJAX_LOAD_ERROR)
        })
      }
    }
  }

  _putContentInElement (headerSection, contentSection, htmlContent) {
    contentSection.innerHTML = htmlContent
    this._setMaxHeightContentSectionToFull(headerSection)
  }

  /**
   * Comprueba si existe el atributo de accesso a ajax ya realizado
   *
   * @param {object} headerSection cabecera de sección que se quiere consultar
   * @returns {boolean} retorna true si existe el atributo de lectura
   * @private
   * @memberof OscappsAccordion
   */
  _isAlreadyRead (headerSection) {
    return headerSection.getAttribute(AJAX_READ_MARK)
  }

  /**
   * Marca con atributo de ya yeido la cabecera de sección
   *
   * @private
   * @param {object} headerSection elemento Dom de cabecera de sección
   * @memberof OscappsAccordion
   */
  _markAsRead (headerSection) {
    headerSection.setAttribute(AJAX_READ_MARK, true)
  }

  /**
   *  Obtiene el índice del elemento DOM dentro de la lista que llega como parámetro
   *
   * @param {array} elementList lista de elementos DOM
   * @param {object} element elemento DOM
   *
   * @returns {integer} retorna el índice del elemento de entrada dentro de la lista de elementos
   * @private
   * @memberof OscappsAccordion
   */
  _getIndexElement (elementList, element) {
    return Array.prototype.indexOf.call(elementList, element)
  }

  /**
   * Obtiene una lista de elemntos DOM de cabeceras de sección
   *
   * @returns {array} lista de elemntos DOM de cabeceras de sección
   * @private
   * @memberof OscappsAccordion
   */
  _getHeaderSections () {
    return this.OscappsAccordionElement.querySelectorAll(HEADER_SECTION_SELECTOR)
  }

  /**
  * Obtiene una lista de elemnetos DOM de secciones (contenido de las acordeones)
  *
  * @returns {array} lista de elemntos DOM de secciones
  * @private
  * @memberof OscappsAccordion
  */
  _getContentSections () {
    return this.OscappsAccordionElement.querySelectorAll(CONTENT_SECTION_SELECTOR)
  }

  /**
   * Accede a la url y retorna una promise. En caso de éxito la promise resuelve con el texto leido y en caso de
   * error con un mensaje de error.
   *
   * @param {string} url
   * @returns {promise} promise que resuelve al acabar el acceso.
   * @private
   * @memberof OscappsAccordion
   */
  _getAjaxData (url, succesCallback, errorCallback) {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        this._isFunction(succesCallback) && succesCallback(request.responseText)
      } else {
        this._isFunction(errorCallback) && errorCallback()
      }
    }

    request.onerror = () => {
      this._isFunction(errorCallback) && errorCallback()
    }

    request.send()
  }

  /**
   * Comprueba si el objeto de entrada es una función
   *
   * @param {object} f
   * @returns {boolean} retorna true si el parámetro de entrada es una función
   * @private
   * @memberof OscappsAccordion
   */
  _isFunction (f) {
    return Object.prototype.toString.call(f) === '[object Function]'
  }

  /**
   * Abre la sección con el índice pasado como parámetro.
   *
   * @param {integer} indexSection índice de la sección a abrir
   * @param {boolean} [allowMultiple] opcional, si es true permite abrir varias secciones al mismo tiempo
   * independientemente de si estuviera definida como selección múltiple o no.
   * @returns {object} retorna la propia clase para poder encadenar métodos
   * @memberof OscappsAccordion
   */
  open (indexSection, allowMultiple = false) {
    const elementSection = this._getElementSectionByIndex(indexSection)

    if (elementSection) {
      if (!allowMultiple && !this.multipleSelection) {
        this.closeAll()
      }

      this._showSection(elementSection)
    }

    return this
  }

  /**
  * Abre todas las secciones. Se permite abrir todas aunque no sea un acordeón
  * de selección múltiple.
  *
  * @returns {object} retorna la propia clase para poder encadenar métodos
  * @memberof OscappsAccordion
  */
  openAll () {
    const sectionsHeader = this._getHeaderSections()

    for (let sectionHeader of sectionsHeader) {
      this._showSection(sectionHeader)
    }

    return this
  }

  /**
  * Cierra la sección con el índice pasado como parámetro.
  *
  * @param {integer} indexSection índice de la sección a cerrar
  * @returns {object} retorna la propia clase para poder encadenar métodos
  * @memberof OscappsAccordion
  */
  close (indexSection) {
    const elementSection = this._getElementSectionByIndex(indexSection)
    elementSection && this._hideSection(elementSection)

    return this
  }

  /**
  * Cierra todas las secciones
  *
  * @returns {object} retorna la propia clase para poder encadenar métodos
  * @memberof OscappsAccordion
  */
  closeAll () {
    const sectionsHeader = this._getHeaderSections()

    for (let sectionHeader of sectionsHeader) {
      this._hideSection(sectionHeader)
    }
  }

  /**
   * Comprueba si la sección pasada como parámetro está abierta
   *
   * @param {integer} indexSection índice de la sección a cerrar
   * @returns retorna true si la sección está abierta, false en caso contrario.
   * @memberof OscappsAccordion
   */
  isOpen (indexSection) {
    const sectionsHeader = this._getHeaderSections()

    return sectionsHeader[indexSection] && DomLib.hasClass(sectionsHeader[indexSection], ACTIVE_CLASS_NAME)
  }

  /**
  * Abre la sección identificada con el índice si está cerrada o la cierra si está abierta.
  *
  * @param {integer} indexSection índice de la sección a abrir o cerrar
  * @param {boolean} [allowMultiple] opcional, si es true permite abrir varias secciones al mismo tiempo
  * independientemente de si estuviera definida como selección múltiple o no.
  * @returns {object} retorna la propia clase para poder encadenar métodos
  * @memberof OscappsAccordion
  */
  toggle (indexSection, allowMultiple = false) {
    if (this.isOpen(indexSection)) {
      this.close(indexSection)
    } else {
      this.open(indexSection, allowMultiple)
    }

    return this
  }

  /**
   * Retorna la cabecera de sección especificada por el índice.
   *
   * @param {integer} indexSection
   * @returns {object} elemento DOM especificado por el índice
   * @private
   * @memberof OscappsAccordion
   */
  _getElementSectionByIndex (indexSection) {
    return this._getHeaderSections()[indexSection]
  }
}

export default OscappsAccordion
