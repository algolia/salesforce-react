import React, { Component } from "react";

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
    process.env.REACT_APP_ALGOLIA_APP_ID,
    process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
);


class Channels extends Component {

    constructor() {
        super();
        this.state = { channels: [] };
    }

    componentDidMount() {
        fetch('/channels')
            .then(res => {
                return res.json()
            })
            .then(channels => {
                this.setState({ channels })
            });
    }

    render() {
        return (
            <div>
                <h1>Channels Home</h1>
                {this.state.channels.map(channel =>
                    <div key={channel.channelId}>{channel.channelName}
                    </div>
                )}
            </div>
        );
    };
}

export default Channels;

