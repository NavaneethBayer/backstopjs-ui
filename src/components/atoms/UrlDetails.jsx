import React from "react";
import styled from "styled-components";
import { colors, fonts } from "../../styles";

const Label = styled.span`
  font-family: ${fonts.latoRegular};
  color: ${colors.secondaryText};
  font-size: 14px;
  padding-right: 8px;
`;

const Value = styled.span`
  font-family: ${fonts.latoBold};
  color: ${colors.primaryText};
  font-size: 14px;
  padding-right: 20px;
`;

const Link = styled.a`
  &::before {
    content: ${(props) => (props.withSeperator ? '"|"' : "")};
    margin: ${(props) => (props.withSeperator ? "0 10px" : "")};
  }
`;

export default class DiffDetails extends React.Component {
  render() {
    const { url, referenceUrl } = this.props;
    return (
      <span>
        <Label>url: </Label>
        <Value>
          {referenceUrl && (
            <Link  href={referenceUrl} target="_blank">
              Reference Link
            </Link>
          )}
          <Link withSeperator href={url} target="_blank">
            Test Link
          </Link>
        </Value>
      </span>
    );
  }
}
