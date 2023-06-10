import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';

function addGame(homeText, awayText) {
  var homeInput = screen.getByLabelText(/home/i)
  
  var awayInput = screen.getByLabelText(/away/i)
  
  act(() => {
    homeInput.value = '';
    userEvent.type(homeInput, homeText)
  })

  act(() => {
    awayInput.value = '';
    userEvent.type(awayInput, awayText)
  })
  expect(homeInput.value).toEqual(homeText.toUpperCase())
  expect(awayInput.value).toEqual(awayText.toUpperCase())
  act(() => {
    fireEvent.click(screen.getByText('Add game', {selector: 'input'}))
  })
}

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
  const homeText = 'ENG'
  const awayText = 'SWE'

  addGame(homeText, awayText);

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
  var homeText = 'ENG'
  var awayText = 'SWE'

  addGame(homeText, awayText);

  homeText = 'SLO'
  awayText = 'ITA'

  addGame(homeText, awayText);

  const summary = screen.getAllByTitle('Summary of game')

  expect(summary).toHaveLength(2)

  //check that first item is game that was last added
  const gameSummarySLOITA = screen.getByTestId('summary0')
  expect(gameSummarySLOITA.innerHTML.substring(0,17)).toEqual('SLO : ITA (0 : 0)')

});

test('test add goal', async () => {
  render(<App />);
  var homeText = 'ENG'
  var awayText = 'SWE'

  addGame(homeText, awayText);

  homeText = 'SLO'
  awayText = 'ITA'

  addGame(homeText, awayText);
  var playernameInput = screen.getByTestId( 'playername' + homeText + awayText);
  var playerlastnameInput = screen.getByTestId( 'playerlastname' + homeText + awayText);
  expect(playernameInput).toBeInTheDocument();
  expect(playerlastnameInput).toBeInTheDocument();
  expect(screen.getByTestId( 'addgoalhome' + homeText + awayText )).toBeInTheDocument();
  expect(screen.getByTestId( 'addgoalaway' + homeText + awayText )).toBeInTheDocument();

  const playerName = 'Zlatan';
  const playerLastName = 'Ibrahimović'
  act(() => {
    playernameInput.value = '';
    userEvent.type(playernameInput, playerName)
  })

  act(() => {
    playerlastnameInput.value = '';
    userEvent.type(playerlastnameInput, playerLastName)
  })
  expect(playernameInput.value).toEqual(playerName)
  expect(playerlastnameInput.value).toEqual(playerLastName)


  act(() => {
    userEvent.click(screen.getByTestId( 'addgoalhome' +  homeText + awayText ))
  })

  let activities = screen.getAllByTestId('activity')
  expect(activities).toHaveLength(1)
  //check that activity was added
  expect(activities[0]).toHaveTextContent(/GOAL! ZI on/i)
});

test('test card functionality', async () => {
  render(<App />);
  var homeText = 'ENG'
  var awayText = 'SWE'

  addGame(homeText, awayText);

  homeText = 'SLO'
  awayText = 'ITA'

  addGame(homeText, awayText);

  expect(screen.getByTestId( 'redhome' )).toBeInTheDocument();
  expect(screen.getByTestId( 'redaway' )).toBeInTheDocument();
  expect(screen.getByTestId( 'yellowhome' )).toBeInTheDocument();
  expect(screen.getByTestId( 'yellowhome' )).toBeInTheDocument();

  act(() => {
    //select game nr2 from dropdown
    userEvent.selectOptions(screen.getByTestId('select'), screen.getByRole('option', {name: 'SLO vs ITA'}),);
  })
  expect(screen.getByRole('option', {name: 'SLO vs ITA'}).selected).toBe(true)

  //add red card to home team
  act(() => {
    userEvent.click(screen.getByTestId( 'redhome' ))
  })

  let activities = screen.getAllByTestId('activity')
  expect(activities).toHaveLength(1)
  //check that activity was added
  expect(activities[0]).toHaveTextContent(/card RED on/i)
});



