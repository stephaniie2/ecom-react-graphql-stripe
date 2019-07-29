import React, { Component } from "react";
//prettier-ignore
import { Container, Box,Heading, Card, Image, Text, SearchField, Icon } from "gestalt";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import "./App.css";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
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
      setTimeout(() => {
        this.setState({ brands: data.brands, loadingBrands: false });
      }, 1000);
    } catch (error) {
      console.error(error);
      this.setState({ loadingBrands: false });
    }
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value });
  };

  filteredBrands = ({ searchTerm, brands }) => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  render() {
    const { searchTerm, loadingBrands } = this.state;
    return (
      <Container>
        {/* Brand Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            placeholder="Search Brands"
            onChange={this.handleChange}
            value={searchTerm}
          />

          <Box margin={3}>
            <Icon
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        {/* Brand Section */}
        <Box display="flex" justifyContent="center" marginBottom={2}>
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Bands
          </Heading>
        </Box>
        {/* Brands */}

        {/*<Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" /> */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          wrap
          display="flex"
          justifyContent="around"
          shape="rounded"
        >
          {this.filteredBrands(this.state).map(brand => (
            <Box
              paddingY={4}
              margin={2}
              key={brand._id}
              width={200}
              maxWidth={236}
              padding={2}
              column={12}
            >
              <Card
                image={
                  <Image
                    alt={brand.name}
                    naturalHeight={1}
                    naturalWidth={1}
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
          <Loader show={loadingBrands} />
        </Box>
      </Container>
    );
  }
}

export default App;
