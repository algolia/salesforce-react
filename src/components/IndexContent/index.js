import React, { Component } from "react";

class IndexContent extends Component {

    constructor() {
        super();
        this.state = { accounts: [] };
    }

    componentDidMount() {
        fetch('/indexContent')
            .then(res => {
                return res.json()
            })
            .then(accounts => {
                // console.log()
            });
    }

    render() {
        return (
            <div>
                <h1>Accounts indexed</h1>
                {/* {this.state.accounts.map(account =>
                    <div key={account.Id}>{account.Name}
                    </div>
                )} */}
            </div>
        );
    };
}

export default IndexContent;

