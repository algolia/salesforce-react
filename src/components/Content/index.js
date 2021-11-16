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


class ContentPage extends Component {

    render() {
        return (
            <div className="ais-InstantSearch">
                <h1>React InstantSearch e-commerce demo</h1>
                <InstantSearch indexName="content" searchClient={searchClient}>
                    <div className="left-panel">
                        <ClearRefinements />
                        <h2>Brands</h2>
                        <RefinementList attribute="Category" />
                        <Configure hitsPerPage={8} />
                        <h2>Type</h2>
                        <RefinementList attribute="Type" />
                        <Configure hitsPerPage={8} />
                        <h2>Size</h2>
                        <RefinementList attribute="Size" />
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
    const baseImageUrl = "https://algolia7-dev-ed.my.salesforce.com";
    return (
        <article>
            <h1>
                <Highlight attribute="Name" hit={props.hit} />
            </h1>
            <p>
                <Highlight attribute="Description" hit={props.hit} />
            </p>
            <p>
                <img src={`${baseImageUrl}/${props.hit.Url}`} className="content-image" alt="Shoes" />
            </p>
            <p>
                <Highlight attribute="Type" hit={props.hit} />
            </p>
            <p>
                <Highlight attribute="Size" hit={props.hit} />
            </p>
        </article>
    );
}

Hit.propTypes = {
    hit: PropTypes.object.isRequired,
};

export default ContentPage;

