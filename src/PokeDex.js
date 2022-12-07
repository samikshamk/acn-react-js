import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import { Row, Col, Card, Button, ButtonGroup } from "react-bootstrap";
import Modal from "react-modal";
import Heading from "./Components/Meta/Heading";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

function PokeDex() {
  const [pokemons, setPokemons] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
    url: "https://pokeapi.co/api/v2/pokemon",
    firstData: 0,
    lastData: 0,
  });
  const [pokemonDetail, setPokemonDetail] = useState({
    isModalOpen: false,
    name: "",
    url: "",
    data: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState("none");

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      color: "white",
    },
    overlay: { backgroundColor: "grey" },
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: pokemons.url,
    })
      .then((result) => {
        setPokemons((pokemons) => ({
          ...pokemons,
          count: result.data.count,
          next: result.data.next,
          previous: result.data.previous,
          results: result.data.results,
        }));
        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pokemons]);

  const getMoreDetails = (name, url) => {
    axios({
      method: "GET",
      url: url,
    })
      .then((result) => {
        setPokemonDetail({
          isModalOpen: true,
          name: name,
          url: url,
          data: result.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sortMethods = {
    none: { method: (a, b) => null },
    asc: { method: (a, b) => (a.name < b.name ? -1 : 1) },
    desc: { method: (a, b) => (a.name > b.name ? -1 : 1) },
  };

  const getCurrentPage = (url) => {
    let countFirstValue = /(?<=offset=)\w+(?=&)/;
    const firstResCount = parseInt(url.match(countFirstValue)[0]);

    let countLastValue = /(?<=limit=)\w+(?=)/;
    const lastResCount = parseInt(url.match(countLastValue)[0]);

    setPokemons((pokemons) => ({
      ...pokemons,
      url: url,
      firstData: firstResCount,
      lastData: lastResCount,
    }));
  };

  return (
    <div>
      <header className="bg-dark min-vh-100">
        {!isLoading ? (
          <div className="App-header">
            <Heading content="Welcome to Pokedex!" design="h1 px-2 py-3" />
            <ReactLoading type="spin" color="#fff" />
          </div>
        ) : (
          <div>
            <Heading
              content="Welcome to Pokedex!"
              design="text-center mx-auto h1 px-2 py-5"
            />
            <Row className="justify-content-end mx-3 py-3">
              <Col sm={3}>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                />
              </Col>
              <Col sm={1}>
                {sortState === "asc" ? (
                  <Button variant="light" onClick={(e) => setSortState("desc")}>
                    <FcAlphabeticalSortingZa />
                  </Button>
                ) : (
                  <Button variant="light" onClick={(e) => setSortState("asc")}>
                    <FcAlphabeticalSortingAz />
                  </Button>
                )}
              </Col>
            </Row>
            <Row xs={2} md={4} className="g-4 px-5 py-3">
              {pokemons.results
                .sort(sortMethods[sortState].method)
                .filter((pokemon) => {
                  if (searchTerm === "") {
                    return pokemon;
                  } else if (
                    pokemon.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    return pokemon;
                  }
                  return false;
                })
                .map((pokemon, index) => {
                  const name = pokemon.name;
                  const url = pokemon.url;
                  return (
                    <Col key={index}>
                      <Card
                        className="cardHover h-100"
                        onClick={() => getMoreDetails(name, url)}
                      >
                        <Card.Body>
                          <Card.Title className="text-capitalize">
                            <Heading
                              content={name}
                              design="h4 text-capitalize text-center text-dark"
                            />
                          </Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
            <Row className="justify-content-end mx-3 mb-0 p-3 pb-0 text-white text-end">
              <Col sm={2}>
                <p className="text-white m-0">
                  Results{" "}
                  {pokemons.firstData === 0 ? 1 : pokemons.firstData + 1} -{" "}
                  {pokemons.lastData === 0
                    ? 20
                    : pokemons.lastData + pokemons.firstData}{" "}
                  of {pokemons.count}
                </p>
              </Col>
            </Row>
            <Row className="justify-content-end mx-3 py-3">
              <Col sm={2}>
                <ButtonGroup>
                  <Button
                    variant="warning"
                    className="border border-dark"
                    disabled={pokemons.previous === null}
                    onClick={() => {
                      getCurrentPage(pokemons.previous);
                    }}
                  >
                    <BiChevronLeft className="icon me-0" />
                    Previous
                  </Button>
                  <Button
                    variant="warning"
                    className="border border-dark"
                    disabled={pokemons.next === null}
                    onClick={() => {
                      getCurrentPage(pokemons.next);
                    }}
                  >
                    Next <BiChevronRight className="icon ms-0" />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
        )}
      </header>
      {pokemonDetail.isModalOpen && (
        <Modal
          isOpen={pokemonDetail.isModalOpen}
          contentLabel={pokemonDetail.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          <div>
            Requirement:
            <ul>
              <li>show the sprites front_default as the pokemon image</li>
              <li>
                Show the stats details - only stat.name and base_stat is
                required in tabular format
              </li>
              <li>Create a bar chart based on the stats above</li>
              <li>
                Create a buttton to download the information generated in this
                modal as pdf. (images and chart must be included)
              </li>
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
