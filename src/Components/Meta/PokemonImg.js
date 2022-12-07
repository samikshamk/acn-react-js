import React from 'react';

function PokemonImg(props) {
  return (
    <img src={props.link} className={props.design}  alt="Pokemon Profile" />
  )
}

export default PokemonImg;