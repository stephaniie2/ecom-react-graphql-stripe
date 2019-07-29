import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { Box, Heading, Text, Image, Card, Button } from "gestalt";
const apiUrl = process.env.API_URL || "http://localhost:1337";

const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
  state = {
    brews: [],
    brand: ""
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
          brand(id: "${this.props.match.params.brandId}") {
            _id
            createdAt
            name
            description
            brews {
              _id
              name
              description
              price
              image {
                url
              }
            }
          }
        }`
        }
      });
      this.setState({
        brews: response.data.brand.brews,
        brand: response.data.brand.name
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { brand, brews } = this.state;
    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
      >
        {/* Brews Section  */}
        <Box display="flex" direction="column" alignItems="center">
          {/* Brew Heading */}
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>
          {/* Brews */}
          <Box
            dangerouslySetInlineStyle={{
              __style: { backgroundColor: "#bdcdd9" }
            }}
            wrap
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
          >
            {brews.map(brew => (
              <Box
                paddingY={4}
                margin={2}
                key={brew._id}
                width={210}
                maxWidth={236}
                padding={2}
              >
                <Card
                  image={
                    <Box height={200}>
                      <Image
                        fit="cover"
                        alt={brew.name}
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiUrl}${brew.image.url}`}
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    alignContent="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Box marginBottom={2}>
                      <Text bold size="xl">
                        {brew.name}
                      </Text>
                    </Box>
                    <Text>{brew.description}</Text>
                    <Text color="orchid">${brew.price}</Text>
                    <Box marginTop={2}>
                      <Text bold size="xl">
                        <Button color="blue" text="Add to Cart" />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default Brews;
