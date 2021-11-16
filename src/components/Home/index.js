import React, { Component } from "react";
import algoliasearch from 'algoliasearch/lite';
import {
    InstantSearch,
    Hits,
    SearchBox,
    Pagination,
    Highlight,
    ClearRefinements,
    RefinementList,
    Configure,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';

const searchClient = algoliasearch(
    process.env.REACT_APP_ALGOLIA_APP_ID,
    process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
);


class HomePage extends Component {

    constructor() {
        super();
        this.state = { accounts: [] };
    }

    render() {
        return (
            <div className="ais-InstantSearch">
                <h1>React InstantSearch</h1>
                <InstantSearch indexName="accounts" searchClient={searchClient}>
                    <div className="left-panel">
                        <ClearRefinements />
                        <h2>Brands</h2>
                        <RefinementList attribute="Name" />
                        <Configure hitsPerPage={8} />
                    </div>
                    <div className="right-panel">
                        <SearchBox />
                        <Hits hitComponent={Hit} />
                        <Pagination />
                    </div>
                </InstantSearch>
            </div>
        );
    };
}

function Hit(props) {
    return (
        <article>
            <h1>
                <Highlight attribute="Name" hit={props.hit} />
            </h1>
            <p>
                <Highlight attribute="Address" hit={props.hit} />
            </p>
            <p>
                <Highlight attribute="City" hit={props.hit} />
            </p>
            <p>
                <Highlight attribute="State" hit={props.hit} />
            </p>
        </article>
    );
}

Hit.propTypes = {
    hit: PropTypes.object.isRequired,
};

export default HomePage;

