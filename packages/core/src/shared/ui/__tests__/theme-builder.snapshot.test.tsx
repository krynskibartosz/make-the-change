import { render, screen, waitFor } from '@testing-library/react'
import { ThemeBuilder } from '../theme-builder'

const setBrandMock = vi.fn()
const setCustomVarsMock = vi.fn()

vi.mock('../../providers/theme-provider', () => ({
  useThemeBrand: () => ({
    brand: 'custom',
    setBrand: setBrandMock,
    customVars: {
      '--primary': '221 83% 53%',
      '--secondary': '210 40% 96%',
      '--accent': '210 40% 96%',
      '--background': '0 0% 100%',
      '--foreground': '222 47% 11%',
      '--border': '214 32% 91%',
    },
    setCustomVars: setCustomVarsMock,
  }),
}))

describe('ThemeBuilder layout', () => {
  it('keeps the rendered structure stable', async () => {
    const { container } = render(<ThemeBuilder />)

    await waitFor(() => {
      expect(screen.getByText('Configuration Technique')).toBeVisible()
    })

    expect(container.firstChild).toMatchSnapshot()
  })
})
