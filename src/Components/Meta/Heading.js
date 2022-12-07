import React from 'react';

function Heading(props) {
    return (
        <div className={`heading ${props.design}`}>{props.content}</div>
    );
}

export default Heading;