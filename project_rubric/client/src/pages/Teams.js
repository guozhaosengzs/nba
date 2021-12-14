import React from "react";

import { Pagination, CustomProvider, Input, InputNumber, InputGroup } from "rsuite";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import SearchIcon from '@rsuite/icons/Search';

import TopNav from "../components/TopNav";
import ColumnSort from "../components/ColumnSort";
import {
    getTeamInfo,
    getTeamSeaonalBest,
    getTeamSeaonalWorst,
    getTeamSeaonalPlayer
} from "../fetcher";





export default Teams;

