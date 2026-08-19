import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useCounterStore, { useCounter, useCounterControls } from './store'

beforeEach(() => {
  useCounterStore.setState({ counter: 0 })
})

describe('counter hooks', () => {
  it('useCounter returns initial value of 0', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current).toBe(0)
  })

  it('increment updates counter', () => {
    const { result: controls } = renderHook(() => useCounterControls())
    act(() => {
        controls.current.increment()
    })
    const { result: counter } = renderHook(() => useCounter())
    expect( counter.current ).toBe(1)
  })

  it('decrement updates counter', () => {
    const { result: controls } = renderHook(() => useCounterControls())
    act(() => {
        controls.current.decrement()
    })
    const { result: counter } = renderHook(() => useCounter())
    expect( counter.current ).toBe(-1)
  })

  it('zero resets counter', () => {
    const { result: controls } = renderHook(() => useCounterControls())
    const { result: counter } = renderHook(() => useCounter())

    act(() => {
        controls.current.increment()
        controls.current.increment()
        controls.current.increment()
        controls.current.reset()
    })

    expect(counter.current).toBe(0)
  })
})