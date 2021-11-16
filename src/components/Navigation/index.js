import React from "react";
import { Link } from "react-router-dom";
import { TabBar, Tab } from '@rmwc/tabs';
import '@rmwc/tabs/styles';

const Navigation = () => (
    <TabBar>
        <Tab tag={Link} to="/">Accounts</Tab>
        <Tab tag={Link} to="/content">Content</Tab>
        <Tab tag={Link} to="/indexAccounts">Index Accounts</Tab>
        <Tab tag={Link} to="/indexContent">Index Content</Tab>
    </TabBar>
)

export default Navigation;


