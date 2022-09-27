import * as exports from './'

it('should contain correct exports', () => {
  expect(Object.keys(exports)).toEqual(['Guard', 'RouteGuard'])
})
