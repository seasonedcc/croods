import PropTypes from 'prop-types'

import CroodsPropTypes from '../CroodsPropTypes'

const { name, url, path } = CroodsPropTypes

jest.spyOn(global.console, 'warn')

const validProps = {
  id: 1,
  name: 'foobar',
  path: '/foobar',
  url: 'https://foobar.com',
}

const invalidProps = {
  id: [{ foo: 'bar' }],
  name: '$$$$$',
  path: '     ',
  url: 'foobar'
}

describe('with valid props', () => {
  describe('name', () => {
    it('returns null', () => {
      expect(name(validProps, 'name', 'Component')).toBeNull()
    })
  })

  describe('path', () => {
    it('returns null', () => {
      expect(path(validProps, 'path', 'Component')).toBeNull()
    })
  })

  describe('url', () => {
    it('returns null', () => {
      expect(url(validProps, 'url', 'Component')).toBeNull()
    })
  })
})

describe('with invalid props', () => {
  describe('name', () => {
    it('returns null', () => {
      const error = name(invalidProps, 'name', 'Component')
      const expected = new Error(`Invalid value: "${invalidProps.name}" of prop:"name" supplied to Component component.`)
      expect(error).toEqual(expected)
    })
  })

  describe('path', () => {
    it('returns null', () => {
      const error = path(invalidProps, 'path', 'Component')
      const expected = new Error(`Invalid value: "${invalidProps.path}" of prop:"path" supplied to Component component.`)
      expect(error).toEqual(expected)
    })
  })

  describe('url', () => {
    it('returns null', () => {
      const error = url(invalidProps, 'url', 'Component')
      const expected = new Error(`Invalid value: "${invalidProps.url}" of prop:"url" supplied to Component component.`)

      expect(error).toEqual(expected)
    })
  })
})
