import React from 'react';
import './App.css';
import Form from './components/Form';
import Card from './components/Card';
import SearchFilters from './components/SearchFilters';

const defaultState = {
  cardName: '',
  cardDescription: '',
  cardAttr1: '0',
  cardAttr2: '0',
  cardAttr3: '0',
  cardImage: '',
  cardRare: 'normal',
  cardTrunfo: false,
  isSaveButtonDisabled: true,
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      ...defaultState,
      hasTrunfo: false,
      myCards: [],
      playCards: [],
      searchName: '',
      searchRare: 'todas',
      searchTrunfo: false,
      isRandomButtonDisabled: true,
      isPlayButtonDisabled: true,
      isNextButtonDisabled: true,
      cardPlayer: {},
      cardMachine: {},
      radioAttr: '',
      roundResult: '',
      gameScorePlay: 0,
      gameScoreMachine: 0,
      cardPlayerDisplay: false,
      cardMachineDisplay: false,
      gameResultMessage: '',
    };
  }

  componentDidMount() {
    window.addEventListener('load', this.getCardsLocalStorage);
  }

  getCardsLocalStorage = () => {
    let cards = [];
    if (localStorage.getItem('myCards') !== null) {
      cards = JSON.parse(localStorage.getItem('myCards'));
    }
    this.setState({
      myCards: cards,
      playCards: cards,
    });
    this.verifyNumberCards(cards);
  }

  onInputChange = ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState(
      {
        [name]: value,
      },
      () => this.verifyButton(),
    );
  }

  verifyInputsText = () => {
    const { cardName, cardDescription, cardImage, cardRare } = this.state;
    if (
      cardName === ''
      || cardDescription === ''
      || cardImage === ''
      || cardRare === ''
    ) { return false; }
    return true;
  }

  verifyInputsNumber = () => {
    const { cardAttr1, cardAttr2, cardAttr3 } = this.state;
    const maxNumber = 90;
    const minNumber = 0;
    const maxSum = 210;
    const attr1 = Number(cardAttr1);
    const attr2 = Number(cardAttr2);
    const attr3 = Number(cardAttr3);
    const sum = attr1 + attr2 + attr3 > maxSum;
    if (
      sum
      || attr1 > maxNumber
      || attr2 > maxNumber
      || attr3 > maxNumber
      || attr1 < minNumber
      || attr2 < minNumber
      || attr3 < minNumber
    ) { return false; }
    return true;
  }

  verifyChecked = () => {
    const { cardTrunfo } = this.state;
    if (cardTrunfo) {
      this.setState({ hasTrunfo: true });
    }
  }

  verifyButton = () => {
    const inputText = this.verifyInputsText();
    const inputNumber = this.verifyInputsNumber();
    const buttonDisabled = inputText && inputNumber;
    this.setState({
      isSaveButtonDisabled: !buttonDisabled,
    });
  }

  cloneCardsAndSaveLocalStorage = (cards) => {
    this.setState({ playCards: cards });
    localStorage.setItem('myCards', JSON.stringify(cards));
  }

  verifyNumberCards = (cards) => {
    let isDisabled = true;
    if (cards.length % 2 === 0) {
      isDisabled = false;
    }
    this.setState({ isRandomButtonDisabled: isDisabled });
  }

  onSaveButtonClick = (event) => {
    event.preventDefault();
    const {
      cardName,
      cardDescription,
      cardAttr1,
      cardAttr2,
      cardAttr3,
      cardImage,
      cardRare,
      cardTrunfo,
      isSaveButtonDisabled,
      myCards,
    } = this.state;
    const obj = {
      cardName,
      cardDescription,
      cardAttr1,
      cardAttr2,
      cardAttr3,
      cardImage,
      cardRare,
      cardTrunfo,
      isSaveButtonDisabled,
    };
    myCards.push(obj);
    this.setState({
      myCards,
      ...defaultState,
    });
    this.verifyChecked();
    this.cloneCardsAndSaveLocalStorage(myCards);
    this.verifyNumberCards(myCards);
  }

  deleteCard = (cardTitle, isTrunfo) => {
    const { myCards } = this.state;
    const cards = myCards.filter((card) => card.cardName !== cardTitle);
    let trunfo = true;
    if (isTrunfo) {
      trunfo = false;
    }
    this.setState({
      myCards: cards,
      hasTrunfo: trunfo,
    });
    this.cloneCardsAndSaveLocalStorage(cards);
    this.verifyNumberCards(cards);
  }

  showCards = () => {
    const { myCards, searchName, searchRare, searchTrunfo } = this.state;
    if (searchName !== '' && searchRare !== 'todas') {
      return myCards.filter((card) => (
        card.cardName.includes(searchName) && card.cardRare === searchRare
      ));
    }
    if (searchName !== '') {
      return myCards.filter((card) => card.cardName.includes(searchName));
    }
    if (searchRare !== 'todas') {
      return myCards.filter((card) => card.cardRare === searchRare);
    }
    if (searchTrunfo) {
      return myCards.filter((card) => card.cardTrunfo === searchTrunfo);
    }
    return myCards;
  }

  randomCard = () => {
    const cardsInitial = this.state.playCards;
    const numberCardMachine = parseInt(Math.random() * cardsInitial.length, 10);
    const cardComputer = cardsInitial[numberCardMachine];
    const cardsMiddle = cardsInitial.filter((card) => card !== cardComputer);
    const numberCardPlayer = parseInt(Math.random() * cardsMiddle.length, 10);
    const cardPlay = cardsMiddle[numberCardPlayer];
    const cardsEnd = cardsMiddle.filter((card) => card !== cardPlay);
    this.setState({
      playCards: cardsEnd,
      cardPlayer: cardPlay,
      cardMachine: cardComputer,
      isPlayButtonDisabled: false,
      isRandomButtonDisabled: true,
      cardPlayerDisplay: true,
    });
  }

  gameRoundResult = () => {
    const { radioAttr, cardPlayer, cardMachine } = this.state;
    const atributePlayer = Number(cardPlayer[radioAttr]);
    const atributeMachine = Number(cardMachine[radioAttr]);
    if (atributeMachine > atributePlayer) {
      return {
        text: 'PERDEU A RODADA',
        scoreMachine: 1,
        scorePlayer: 0,
      } 
    } else if (atributeMachine < atributePlayer) {
      return {
        text: 'VENCEU A RODADA',
        scoreMachine: 0,
        scorePlayer: 1,
      } 
    } else {
      return {
        text: 'EMPATOU A RODADA',
        scoreMachine: 0,
        scorePlayer: 0,
      }
    }
  }

  startGame = () => {
    const { radioAttr, playCards } = this.state;
    if (radioAttr !== '') {
      const {text, scoreMachine, scorePlayer} = this.gameRoundResult();
      this.setState((prev) => ({
        roundResult: text,
        gameScoreMachine: prev.gameScoreMachine + scoreMachine,
        gameScorePlay: prev.gameScorePlay + scorePlayer,
        isPlayButtonDisabled: true,
        isNextButtonDisabled: false,
        cardMachineDisplay: true,
      }));
    }
  }

  nextRound = () => {
    const {playCards} = this.state;
    if (playCards.length === 0) {
      const {gameScoreMachine, gameScorePlay} = this.state;
      let result;
      if (gameScoreMachine > gameScorePlay) result = 'A máquina foi o CAMPEÃO!'
      if (gameScoreMachine < gameScorePlay) result = 'Você foi o CAMPEÃO!'
      if (gameScoreMachine === gameScorePlay) result = 'Terminou EMPATADO!'
      this.setState({
        gameResultMessage: result,
        isPlayButtonDisabled: true,
        isRandomButtonDisabled: true,
        isNextButtonDisabled: true,
        cardMachineDisplay: false,
        cardPlayerDisplay: false,
      });
    } else {
      this.setState({
        isRandomButtonDisabled: false,
        isNextButtonDisabled: true,
        cardMachineDisplay: false,
        cardPlayerDisplay: false,
      });
    }
  }

  resetGame = () => {
    const {myCards} = this.state;
    this.setState({
      gameResultMessage: '',
      isPlayButtonDisabled: true,
      isRandomButtonDisabled: false,
      isNextButtonDisabled: true,
      gameScoreMachine: 0,
      gameScorePlay: 0,
      playCards: myCards,
      roundResult: '',
    });
  }

  render() {
    return (
      <>
        <header>
          <div className='logo'></div>
          <div className='links'>
            <a href="#main-container">Adicionar carta</a>
            <a href="#cards-display">Ver baralho</a>
            <a href="#play-display">Jogar</a>
          </div>
        </header>
        <div className="main-container" id='main-container'>
          <div className="form-container">
            <h1>Adicionar nova carta</h1>
            <Form
              { ...this.state }
              onInputChange={ this.onInputChange }
              onSaveButtonClick={ this.onSaveButtonClick }
            />
          </div>

          <div className="card-container">
            <Card { ...this.state } />
          </div>
        </div>

        <div className="cards-display" id='cards-display'>
          <div>
            <h2>Todas as Cartas</h2>
          </div>
          <SearchFilters
            { ...this.state }
            onInputChange={ this.onInputChange }
          />
          <div className="all-cards">
            {
              this.showCards().map((card, i) => (
                <div key={ i } className="card-btn">
                  <Card { ...card } />
                  <button
                    data-testid="delete-button"
                    type="button"
                    className="btn-delete"
                    onClick={ () => this.deleteCard(card.cardName, card.cardTrunfo) }
                  >
                    Excluir
                  </button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="play-display" id='play-display'>
          <h1>Vamos Jogar</h1>
          <div className="score">
            <p>
              Jogador
              {' '}
              {this.state.gameScorePlay}
              x
              {this.state.gameScoreMachine}
              {' '}
              Máquina
            </p>
            <p>
              Quantidade de cartas disponíveis:
              {' '}
              {this.state.playCards.length}
            </p>
          </div>
          <div>
            <button
              type="button"
              disabled={ this.state.isRandomButtonDisabled }
              className="random-btn"
              onClick={ this.randomCard }
            >
              Sortear
            </button>
            <button
              type="button"
              disabled={ this.state.isPlayButtonDisabled }
              className="play-btn"
              onClick={ this.startGame }
            >
              Jogar
            </button>
            <button
              type="button"
              disabled={ this.state.isNextButtonDisabled }
              className="next-btn"
              onClick={ this.nextRound }
            >
              Próxima rodada
            </button>
          </div>
          {this.state.gameResultMessage !== '' ? (
            <div>
              <p className="result-display">{this.state.gameResultMessage}</p>
              <button
                type="button"
                className="next-btn"
                onClick={ this.resetGame }
              >
              Reiniciar o jogo
              </button>
            </div>
          ) : undefined}
          <div className="fight-section">
            {this.state.cardPlayerDisplay && (
              <div className="card-player">
              <Card { ...this.state.cardPlayer } />
              <div className="radio-div">
                <input
                  type="radio"
                  value="cardAttr1"
                  name="radioAttr"
                  className="radio-input"
                  onChange={ this.onInputChange }
                />
                <input 
                  type="radio" 
                  value="cardAttr2" 
                  name="radioAttr" 
                  className="radio-input" 
                  onChange={ this.onInputChange } />
                <input 
                  type="radio" 
                  value="cardAttr3" 
                  name="radioAttr" 
                  className="radio-input" 
                  onChange={ this.onInputChange }
                  />
              </div>
              <p className="player-name">Jogador</p>
            </div>
            )}
            
            {this.state.cardMachineDisplay && (
              <div className='machine-wrapper'>
                <div className="img-versus">
                  <img src="https://img.icons8.com/external-wanicon-two-tone-wanicon/100/000000/external-player-versus-player-video-game-wanicon-two-tone-wanicon.png" />
                  <p className="score-display">{this.state.roundResult}</p>
                </div>
                <div className="card-machine">
                  <Card { ...this.state.cardMachine } />
                  <p className="player-name">Máquina</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <footer>
          <p>Desenvolvido por Thiago Nóbrega</p>
        </footer>
      </>
    );
  }
}

export default App;
