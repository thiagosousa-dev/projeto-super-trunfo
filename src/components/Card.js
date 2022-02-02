import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Card extends Component {
  render() {
    const {
      cardName,
      cardDescription,
      cardAttr1,
      cardAttr2,
      cardAttr3,
      cardImage,
      cardRare,
      cardTrunfo,
    } = this.props;

    const imageSource = cardImage !== '' ? cardImage : 'https://i.imgur.com/1J7yKXQ.png';

    return (
      <div className="card-wrapper">
        <p data-testid="name-card" className="name-card">{cardName}</p>

        <img
          src={ imageSource }
          alt={ cardName }
          data-testid="image-card"
          className="image-card"
        />

        <p data-testid="description-card" className="description-card">
          {cardDescription}
        </p>

        <div className="atribute-container">
          <div className="atribute-wrapper">
            <p className="attr-title">Ataque.................................</p>
            <p data-testid="attr1-card" className="attr-number">
              {cardAttr1}
            </p>
          </div>
          <div className="atribute-wrapper">
            <p className="attr-title">Defesa.................................</p>
            <p data-testid="attr2-card" className="attr-number">
              {cardAttr2}
            </p>
          </div>
          <div className="atribute-wrapper">
            <p className="attr-title">Magia...................................</p>
            <p data-testid="attr3-card" className="attr-number">
              {cardAttr3}
            </p>
          </div>
        </div>

        <p data-testid="rare-card" className="rare-card">
          {cardRare}
        </p>

        {cardTrunfo === true ? (
          <div data-testid="trunfo-card" className="trunfo-card">
            <p>Super Trunfo</p>
          </div>
        ) : ''}
      </div>
    );
  }
}

Card.propTypes = {
  cardName: PropTypes.string.isRequired,
  cardDescription: PropTypes.string.isRequired,
  cardAttr1: PropTypes.string.isRequired,
  cardAttr2: PropTypes.string.isRequired,
  cardAttr3: PropTypes.string.isRequired,
  cardImage: PropTypes.string.isRequired,
  cardRare: PropTypes.string.isRequired,
  cardTrunfo: PropTypes.bool.isRequired,
};

export default Card;
