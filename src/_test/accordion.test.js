/* eslint-disable import/no-duplicates */
import {
  getByText
} from 'dom-testing-library'

import 'jest-dom/extend-expect'

import OscappsAccordion from '../js/OscappsAccordion'

import {
  MAIN_CLASS_NAME,
  ACTIVE_CLASS_NAME,
  HEADER_CLASS_NAME,
  SECTION_CLASS_NAME,
  HEADER_SECTION_SELECTOR
} from '../js/OscappsAccordion'

const getDlElement = () => {
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
  dl.className = MAIN_CLASS_NAME

  return dl
}

const getDivElement = () => {
  const div = document.createElement('div')

  div.innerHTML = `
  <div class="${HEADER_CLASS_NAME}">
    Section 1
  </div>
  <div class="${SECTION_CLASS_NAME}">
    Content Section 1
  </div>
  <div class="${HEADER_CLASS_NAME}">
    Section 2
  </div>
  <div class="${SECTION_CLASS_NAME}">
    Content Section 2
  </div>
  <div class="${HEADER_CLASS_NAME}">
    Section 3
  </div>
  <div class="${SECTION_CLASS_NAME}">
    Content Section 3
  </div>
</div>
  `
  div.className = MAIN_CLASS_NAME

  return div
}

describe('Simple OscappsAccordion', () => {
  const OscappsAccordionElement = getDlElement()
  const oscappsAccordion = new OscappsAccordion(OscappsAccordionElement)

  it('should create an instance of OscappsAccordion', () => {
    expect(oscappsAccordion).toBeInstanceOf(OscappsAccordion)
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

    it('should be the only one active class', () => {
      expect(OscappsAccordionElement.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(1)
    })

    it('should remove active class from Section 1', () => {
      expect(getByText(OscappsAccordionElement, 'Section 1')).not.toHaveClass(ACTIVE_CLASS_NAME)
    })
  })

  describe('when use open method of section 3 (index 2)', () => {
    beforeAll(() => {
      oscappsAccordion.open(2)
    })

    it('should add active className to Section 3', () => {
      expect(getByText(OscappsAccordionElement, 'Section 3')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should be the only one active class', () => {
      expect(OscappsAccordionElement.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(1)
    })

    it('should remove active class from Section 1', () => {
      expect(getByText(OscappsAccordionElement, 'Section 1')).not.toHaveClass(ACTIVE_CLASS_NAME)
    })
  })

  describe('when use open method of section 2 (index 1) with allowMultiple = true', () => {
    beforeAll(() => {
      oscappsAccordion.open(1, true)
    })

    it('should add active className to Section 2', () => {
      expect(getByText(OscappsAccordionElement, 'Section 2')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should not be the only one active class', () => {
      expect(OscappsAccordionElement.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(2)
    })

    it('should remove active class from Section 1', () => {
      expect(getByText(OscappsAccordionElement, 'Section 1')).not.toHaveClass(ACTIVE_CLASS_NAME)
    })
  })

  describe('when use closeAll method', () => {
    beforeAll(() => {
      oscappsAccordion.open(1, true)
      oscappsAccordion.closeAll()
    })

    it('should there isn\'t any active class', () => {
      expect(OscappsAccordionElement.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(0)
    })
  })

  describe('when use openAll method', () => {
    beforeAll(() => {
      oscappsAccordion.openAll()
    })

    it('should there all elements with active class', () => {
      const headerElementsLength = OscappsAccordionElement.querySelectorAll(HEADER_SECTION_SELECTOR).length

      expect(OscappsAccordionElement.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(headerElementsLength)
    })
  })

  describe('when use toggle method', () => {
    beforeAll(() => {
      oscappsAccordion.closeAll()
    })

    it('should add active className to Section 2 when toggle section 2 (before close)', () => {
      oscappsAccordion.close(1)
      oscappsAccordion.toggle(1)

      expect(getByText(OscappsAccordionElement, 'Section 2')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should be the only one active class', () => {
      expect(OscappsAccordionElement.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(1)
    })

    it('should there is not active className in Section 2 when toggle section 2 twice', () => {
      oscappsAccordion.close(1)
      oscappsAccordion.toggle(1)
      oscappsAccordion.toggle(1)

      expect(getByText(OscappsAccordionElement, 'Section 2')).not.toHaveClass(ACTIVE_CLASS_NAME)
    })
  })
})

describe('Multiple Selection OscappsAccordion', () => {
  const OscappsAccordionMultiple = getDlElement()
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

    it('should have two active classes (multiple selection)', () => {
      expect(OscappsAccordionMultiple.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(2)
    })

    it('should not remove active class from Section 1 (multiple selection)', () => {
      expect(getByText(OscappsAccordionMultiple, 'Section 1')).toHaveClass(ACTIVE_CLASS_NAME)
    })
  })
})

describe('OscappsAccordion with div\'s', () => {
  const OscappsAccordionWithDivs = getDivElement()
  const OscappsAccordion3 = new OscappsAccordion(OscappsAccordionWithDivs, { multipleSelection: true })

  it('should create an instance of OscappsAccordion', () => {
    expect(OscappsAccordion3).toBeInstanceOf(OscappsAccordion)
  })

  describe('when click section 1', () => {
    it('should add active className to Section 1', () => {
      getByText(OscappsAccordionWithDivs, 'Section 1').click()

      expect(getByText(OscappsAccordionWithDivs, 'Section 1')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should be the only one active class', () => {
      expect(OscappsAccordionWithDivs.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(1)
    })

    it('should be the only one active class', () => {
      expect(OscappsAccordionWithDivs.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).length).toBe(1)
    })
  })

  describe('when click section 2', () => {
    it('should add active className to Section 2', () => {
      getByText(OscappsAccordionWithDivs, 'Section 2').click()

      expect(getByText(OscappsAccordionWithDivs, 'Section 2')).toHaveClass(ACTIVE_CLASS_NAME)
    })

    it('should not remove active class from Section 1 (multiple selection)', () => {
      expect(getByText(OscappsAccordionWithDivs, 'Section 1')).toHaveClass(ACTIVE_CLASS_NAME)
    })
  })
})
