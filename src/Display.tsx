import React, { useState } from "react";

import {
  PageSection,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody
} from "@patternfly/react-core";

interface VictimDetailProps {
  data: any;
}

const VictimDetail: React.FC<VictimDetailProps> = props => {
  const [address, setAddress] = useState("");
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${props.data.lat},${props.data.lon}.json?` +
      new URLSearchParams({
        access_token: process.env.REACT_APP_MAPBOX_TOKEN || ""
      })
  )
    .then(response => response.json())
    .then(jsonData => {
      if (jsonData.features.length > 0) {
        setAddress(jsonData.features[0].place_name);
      }
    });
  return (
    <Card>
      <CardHeader>{props.data.victimName}</CardHeader>
      <CardBody>
        <Grid>
          <GridItem span={3}>Status:</GridItem>
          <GridItem span={9}> {props.data.status} </GridItem>

          <GridItem span={3}>Location:</GridItem>
          <GridItem span={9}> {address} </GridItem>

          <GridItem span={3}>People:</GridItem>
          <GridItem span={9}> {props.data.numberOfPeople} </GridItem>

          <GridItem span={3}>Phone:</GridItem>
          <GridItem span={9}> {props.data.victimPhoneNumber} </GridItem>

          <GridItem span={3}>Needs First-Aid:</GridItem>
          <GridItem span={9}> {props.data.medicalNeeded.toString()} </GridItem>

          <GridItem span={3}>Timestamp:</GridItem>
          <GridItem span={9}>
            {new Date(props.data.timeStamp).toDateString()}
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};

interface DisplayListProps {
  isReady: boolean;
  responseOk: boolean;
  dataArray: any;
}

const DisplayList: React.FC<DisplayListProps> = props => {
  let content = props.dataArray.map((val: any, key: number) => (
    <li key={key}>
      <VictimDetail data={val.map}></VictimDetail>
    </li>
  ));
  if (props.dataArray.length === 0) {
    content = <p>No data available.</p>;
  }
  if (!props.isReady) {
    content = <p>Loading...</p>;
  }
  if (!props.responseOk) {
    content = <p>503 service unavailable.</p>;
  }
  return (
    <PageSection>
      <ul>{content}</ul>
    </PageSection>
  );
};

export default DisplayList;
