import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { websites } from "../../../website-config.js";
import { colors, fonts } from "../../styles";
import {
  changeWebsite,
  setSuiteInfo
} from '../../actions';
import { fetchWebsiteReport } from '../../helpers/reports'


const IdTitle = styled.h3`
  font-size: 14px;
  font-family: ${fonts.arial};
  font-weight: normal;
  font-style: normal;
  margin: 0;
  color: ${colors.secondaryText};
  flex: 1 0 auto;
  padding-left: 15px;
  margin-left: 15px;
  margin-top: 7px;
  position: relative;

  :before {
    content: "";
    width: 2px;
    height: 35px;
    background: ${colors.borderGray};
    display: block;
    position: absolute;
    left: 0;
    top: -10px;
  }
`;

class IdConfig extends React.Component {

  async fetchWebsiteInfo(website) {
    const { changeWebsite, setSuiteInfo } = this.props
    const data = await fetchWebsiteReport(website)
    changeWebsite(data)
    setSuiteInfo(data)
  }

  render() {
    return (
      <select onChange={(event) => {
        this.fetchWebsiteInfo(event.target.value)
      }} className="ml-4 p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
        {
          websites.map(website =>  <option key={1} value={website.name}>{website.name}</option>)
        }
      </select>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    idConfig: state.suiteInfo.idConfig,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeWebsite: (value) => {
      dispatch(changeWebsite(value));
    },
    setSuiteInfo: (value) => {
      dispatch(setSuiteInfo(value));
    }
  };
};

const IdContainer = connect(mapStateToProps, mapDispatchToProps)(IdConfig);

export default IdContainer;
