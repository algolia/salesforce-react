import React, { Component } from "react";

class IndexAccounts extends Component {

    constructor() {
        super();
        this.state = {accounts: []};
    }

    componentDidMount() {
        fetch('/indexAccounts')
            .then(res => {
                return res.json()
             })
            .then(accounts => { 
                this.setState({ accounts })
             });
    }

    render() {
        return (
            <div>
                <h1>Accounts indexed</h1>
                {this.state.accounts.map(account =>
                <div key={account.Id}>{account.Name}
                </div>
                )}
            </div>
        );
    };
}

export default IndexAccounts;

