import React, { Component } from 'react';
import styled from 'styled-components';

export default class TitleBar extends Component {
  render() {
    return (
          <HeaderStrip><TitleText>Internal DNS Editor</TitleText></HeaderStrip>
    )
  }
}

const HeaderStrip = styled.div`
  width: 100%;
  height: 3.0em;
  font-family: 'Roboto', sans-serif;
  font-weight: 800
  font-size: 24px;
  text-align:center;
  vertical-align: center;
`;

const TitleText = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: center;
`
