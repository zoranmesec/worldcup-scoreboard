import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders add game form', () => {
  render(<App />);

  const inputNode = screen.getByLabelText('Home team:', {selector: 'input'})
  expect(inputNode).toBeInTheDocument();
});

test('test empty input', async () => {
  render(<App />);
// Click button
fireEvent.click(screen.getByText('Add game', {selector: 'input'}))

//Check that there are no games added, because input was empty
const items = await screen.findAllByText(/game/)
expect(items).toHaveLength(2)
});

// test('test game finished', async () => {
//   render(<App />);
//   const input = getByLabelText("Some Label")
//   input.value = 'ENG'
//   fireEvent.change(input, {target: {value: '23'}})
//   expect(input.value).toBe('$23')

// });


