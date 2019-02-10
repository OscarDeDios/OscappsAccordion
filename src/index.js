import 'babel-polyfill'
import 'whatwg-fetch'

import OscappsAccordion from './js/OscappsAccordion'

import './scss/styles.scss'

document.addEventListener('DOMContentLoaded', () => {
  const OscappsAccordionElements = document.querySelectorAll('.OscappsAccordion:not(.is-instanced)')
  let instance = []

  for (let OscappsAccordionElement of OscappsAccordionElements) {
    instance.push(new OscappsAccordion(OscappsAccordionElement))
  }
})

export default OscappsAccordion
