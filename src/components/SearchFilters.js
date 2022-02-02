import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchFilters extends Component {
  render() {
    const { searchName, searchRare, searchTrunfo, onInputChange } = this.props;
    return (
      <div className="searchBar">
        <div>
          <h3>Filtros de busca</h3>
        </div>
        <div>
          <input
            data-testid="name-filter"
            type="text"
            value={ searchName }
            name="searchName"
            placeholder="Nome da carta"
            onChange={ onInputChange }
            className="name-filter-input"
          />
        </div>
        <div>
          <select
            data-testid="rare-filter"
            value={ searchRare }
            name="searchRare"
            onChange={ onInputChange }
            className="rare-filter-input"
          >
            <option value="todas">todas</option>
            <option value="normal">normal</option>
            <option value="raro">raro</option>
            <option value="muito raro">muito raro</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="trunfo-filter"
            className="trunfo-filter"
          >
            <input
              data-testid="trunfo-filter"
              id="trunfo-filter"
              type="checkbox"
              name="searchTrunfo"
              checked={ searchTrunfo }
              onChange={ onInputChange }
              className="trunfo-filter-input"
            />
            Super Trybe Trunfo
          </label>

        </div>
      </div>
    );
  }
}

SearchFilters.propTypes = {
  searchName: PropTypes.string.isRequired,
  searchRare: PropTypes.string.isRequired,
  searchTrunfo: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default SearchFilters;
