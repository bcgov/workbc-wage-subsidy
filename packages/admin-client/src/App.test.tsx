import { render, screen } from '@testing-library/react'
import App from './App'

test('renders progress checkboxes', () => {
  render(<App />)
  const progressElement = screen.getByText(/New/i)
  expect(progressElement).toBeInTheDocument()
})

test('renders logo', () => {
  render(<App />)
  const logoElement = screen.getByAltText(/Work BC/i)
  expect(logoElement).toBeInTheDocument()
})
