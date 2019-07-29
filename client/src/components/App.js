import React, { Component } from "react";
import { Container, Box, Heading, Card, Image, Text } from "gestalt";
import { Link } from "react-router-dom";
import "./App.css";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: []
  };
  async componentDidMount() {
    try {
      const { data } = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              image {
                url
              }
            }
          }`
        }
      });
      this.setState({ brands: data.brands });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { brands } = this.state;
    return (
      <Container>
        {/* Brand Section */}
        <Box display="flex" justifyContent="center" marginBottom={2}>
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Bands
          </Heading>
        </Box>
        {/* Brands */}
        <Box display="flex" justifyContent="around">
          {brands.map(brand => (
            <Box key={brand._id} maxWidth={236} padding={2} column={12}>
              <Card
                image={
                  <Image
                    alt={brand.name}
                    naturalHeight={1}
                    naturalWidth={1}
                    name="test"
                    src={`${apiUrl}${brand.image.url}`}
                  />
                }
              >
                <Box
                  display="flex"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Text bold size="xl">
                    {brand.name}
                  </Text>
                  <Text>{brand.description}</Text>
                  <Text bold size="xl">
                    <Link to={`${brand._id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        <Box />
      </Container>
    );
  }
}

export default App;
