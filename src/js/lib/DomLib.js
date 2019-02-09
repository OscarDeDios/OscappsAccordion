class DomLib {
  static hasClass (element, className) {
    return element.classList.contains(className)
  }

  static addClass (element, className) {
    element.classList.add(className)
  }

  static removeClass (element, className) {
    element.classList.remove(className)
  }
}

export default DomLib
