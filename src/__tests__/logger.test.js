import { consoleGroup, responseLogger, requestLogger } from '../logger'


jest.spyOn(global.console, 'group').mockImplementation(() => jest.fn())
jest.spyOn(global.console, 'groupEnd').mockImplementation(() => jest.fn())
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())

afterEach(() => {
  jest.clearAllMocks();
});

describe('consoleGroup', () => {
  it('logs a group of messages', () => {
    consoleGroup('Foobar', 'green')('Message 1', 'Message 2')

    expect(console.group).toHaveBeenCalledTimes(1)
    expect(console.group).toHaveBeenCalledWith('%cFoobar', 'color: green;')

    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenCalledWith('Message 1')
    expect(console.log).toHaveBeenCalledWith('Message 2')

    expect(console.groupEnd).toHaveBeenCalledTimes(1)
  })
})

describe('requestLogger', () => {
  it('calls consoleGroup', () => {
    requestLogger('https://api.foobar.com/data', 'get', { foo: 'bar' })

    expect(console.group).toHaveBeenCalledTimes(1)
    expect(console.group).toHaveBeenCalledWith('%cREQUEST: ', 'color: mediumpurple;')

    expect(console.log).toHaveBeenCalledTimes(2)

    expect(console.groupEnd).toHaveBeenCalledTimes(1)
  })
})

describe('responseLogger', () => {
  it('calls consoleGroup', () => {
    responseLogger('https://api.foobar.com/data', 'get', { foo: 'bar' })

    expect(console.group).toHaveBeenCalledTimes(1)
    expect(console.group).toHaveBeenCalledWith('%cRESPONSE: ', 'color: coral;')

    expect(console.log).toHaveBeenCalledTimes(2)

    expect(console.groupEnd).toHaveBeenCalledTimes(1)
  })
})
