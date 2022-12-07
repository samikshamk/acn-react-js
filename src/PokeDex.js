import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  Badge,
  Table,
} from "react-bootstrap";
import Modal from "react-modal";
import Heading from "./Components/Meta/Heading";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import { BiChevronLeft, BiChevronRight, BiX, BiDownload } from "react-icons/bi";
import PokemonImg from "./Components/Meta/PokemonImg";
import BaseStats from "./Components/PokeDex/BaseStats";
import html2canvas from "html2canvas";
import pdfMake from "pdfmake/build/pdfmake";


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
      position: "relative",
      backgroundColor: "#FFF",
      padding: "1rem",
      margin: "auto",
      zIndex: "1000",
      width: "45%",
      borderRadius: ".5em",
    },
    overlay: {
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0, .8)",
      zIndex: "1000",
      overflowY: "auto",
    },
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


  const generatePDF = () => {

    html2canvas(document.getElementById("generatefile"), { logging: true, letterRendering: 1, allowTaint: false, useCORS: true }).then(canvas => {
      var data = canvas.toDataURL();
      var pdfExportSetting = {
        content: [
          {
            image: data,
            width: 500
          }
        ]
      };
      pdfMake.createPdf(pdfExportSetting).download("pokemon.pdf");
    });
  }

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
                          <Card.Title>
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
          ariaHideApp={false}
          onRequestClose={() => {
            setPokemonDetail({
              isModalOpen: false,
              name: "",
              url: "",
              data: "",
            });
          }}
          style={customStyles}

        >
          <div>
            <div className="position-absolute top-0 end-0">
              <BiX
                className="text-dark bg-light rounded-circle icon iconX"
                onClick={() => {
                  setPokemonDetail({
                    isModalOpen: false,
                    name: "",
                    url: "",
                    data: "",
                  });
                }}
              />
            </div>
            <div id="generatefile">
            <Row className="mx-auto text-end bg-dark justify-content-md-center rounded p-3">
              <Col sm={2}>
                <PokemonImg
                  link={pokemonDetail.data.sprites.front_default}
                  design="rounded-circle w-100 mx-auto bg-light p-2 my-2"
                />
              </Col>
              <Col sm={8} className="text-start">
                <Heading
                  content={pokemonDetail.name}
                  design="h2 pt-2 rounded text-capitalize"
                />
                <div className="text-light">
                  {pokemonDetail.data.stats.map((statDetail, index) => {
                    const statName = statDetail.stat.name;
                    return (
                      <Badge
                        bg="light"
                        text="dark"
                        key={index}
                        className="me-1"
                      >
                        {statName}
                      </Badge>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row className=" m-3">
              <Heading content="Base Stat" design="h6" />
              <Table
                striped
                bordered
                hover
                size="sm"
                responsive
                className="text-center"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Base Stat</th>
                  </tr>
                </thead>
                <tbody>
                  {pokemonDetail.data.stats.map((statDetail, index) => {
                    const statName = statDetail.stat.name;
                    const statBase = statDetail.base_stat;
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{statName}</td>
                        <td>{statBase}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Row>
            <Row>
              <BaseStats chartData={pokemonDetail.data.stats} />
            </Row>
            </div>
            <Row className="mx-auto justify-content-md-center">
              <Col sm={3}>
              <Button onClick={generatePDF} ><BiDownload className="icon mx-0"/> Download</Button>
              </Col>
            </Row>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
