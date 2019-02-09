import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  wait,
} from 'dom-testing-library'

import 'jest-dom/extend-expect'

import OscappsAccordion from '../js/OscappsAccordion'

const ACTIVE_CLASS_NAME = 'active'
const MULTIPLE_SELECTION_CLASS_NAME = 'multiple-selection'

const getContainerDOM = () => {
  const dl = document.createElement('dl')

  dl.innerHTML = `
    <dt>Section 1</dt>
    <dd>
      <p>Section 1 Content</p>
    </dd>
    <dt>Section 2</dt>
    <dd>
      <p>Section 2 Content</p>
    </dd>
    <dt>Section 3</dt>
    <dd>
      <p>Section 3 Content</p>
    </dd>
  `
  dl.className = 'OscappsAccordion'

  return dl
}

describe('Simple OscappsAccordion', () => {
  const OscappsAccordionElement = getContainerDOM()
  const OscappsAccordion = new OscappsAccordion(OscappsAccordionElement)

  it('should create an instance of OscappsAccordion', () => {
    expect(OscappsAccordion).toBeInstanceOf(OscappsAccordion)
  })

  describe('when click section 1', () => {
    it('should add active className to Section 1', () => {
      getByText(OscappsAccordionElement, 'Section 1').click()

      expect(getByText(OscappsAccordionElement, 'Section 1')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should be the only one active class', () => {
      expect(OscappsAccordionElement.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(1)
    })
  })

  describe('when click section 2', () => {
    it('should add active className to Section 2', () => {
      getByText(OscappsAccordionElement, 'Section 2').click()

      expect(getByText(OscappsAccordionElement, 'Section 2')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should remove active class from Section 1', () => {
      expect(getByText(OscappsAccordionElement, 'Section 1')).not.toHaveClass(ACTIVE_CLASS_NAME)
    })
  })
})

describe('Multiple Selection OscappsAccordion', () => {
  const OscappsAccordionMultiple = getContainerDOM()
  const OscappsAccordion2 = new OscappsAccordion(OscappsAccordionMultiple, { multipleSelection: true })

  it('should create an instance of OscappsAccordion', () => {
    expect(OscappsAccordion2).toBeInstanceOf(OscappsAccordion)
  })

  describe('when click section 1', () => {
    it('should add active className to Section 1', () => {
      getByText(OscappsAccordionMultiple, 'Section 1').click()

      expect(getByText(OscappsAccordionMultiple, 'Section 1')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should be the only one active class', () => {
      expect(OscappsAccordionMultiple.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(1)
    })
  })

  describe('when click section 2', () => {
    it('should add active className to Section 2', () => {
      getByText(OscappsAccordionMultiple, 'Section 2').click()

      expect(getByText(OscappsAccordionMultiple, 'Section 2')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should not remove active class from Section 1 (multiple selection)', () => {
      expect(getByText(OscappsAccordionMultiple, 'Section 1')).toHaveClass(ACTIVE_CLASS_NAME)
    })
  })
})
