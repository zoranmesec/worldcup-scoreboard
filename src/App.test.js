import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
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

test('test game finished', async () => {
  render(<App />);
  const homeInput = screen.getByLabelText(/home/i)
  const awayInput = screen.getByLabelText(/away/i)
  const homeText = 'ENG'
  const awayText = 'SWE'
  act(() => {
    userEvent.type(homeInput, homeText)
    userEvent.type(awayInput, awayText)
  })
  expect(homeInput.value).toEqual(homeText.toUpperCase())
  expect(awayInput.value).toEqual(awayText.toUpperCase())
  fireEvent.click(screen.getByText('Add game', {selector: 'input'}))

  const items = screen.getAllByTestId('game')
  expect(items).toHaveLength(1)

  const finishButton = screen.getByTestId( 'finish' +  homeText + awayText )
  expect(finishButton).toBeInTheDocument();

  act(() => {
    userEvent.click(finishButton)
  })

  expect(finishButton).not.toBeInTheDocument()

});

test('test summary', async () => {
  render(<App />);
  var homeInput = screen.getByLabelText("Home team:")
  var awayInput = screen.getByLabelText("Away team:")
  var homeText = 'ENG'
  var awayText = 'SWE'
  act(() => {
    userEvent.type(homeInput, homeText)
    userEvent.type(awayInput, awayText)
  })
  fireEvent.click(screen.getByText('Add game', {selector: 'input'}))


  act(() => {
    homeInput.value = '';
    homeText = 'SLO'
    userEvent.type(homeInput, homeText)
    expect(homeInput.value).toEqual(homeText.toUpperCase())
  })

  act(() => {
    awayInput.value = '';
    awayText = 'ITA'
    userEvent.type(awayInput, awayText)
    expect(awayInput.value).toEqual(awayText.toUpperCase())
  })

  fireEvent.click(screen.getByText('Add game', {selector: 'input'}))

  const summary = screen.getAllByTitle('Summary of game')

  expect(summary).toHaveLength(2)

  //check that first item is game that was last added
  const gameSummarySLOITA = screen.getByTestId('summary0')
  expect(gameSummarySLOITA.innerHTML.substring(0,17)).toEqual('SLO : ITA (0 : 0)')

});


