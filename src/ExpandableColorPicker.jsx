import { Component } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { SketchPicker } from "react-color";
import React, { useState, useRef, useEffect } from 'react';


export default function ExpandableColorPicker(props) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref?.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div>
        <div style={{height:'20px',width:'100%',display:'block',backgroundColor:props.color,borderRadius:'10px',cursor:'pointer'}} onClick={(e) => setOpen(!open)} ></div>
      {open && (
        <div ref={ref} style={{position:'absolute',width:'fit-content'}}>
        <SketchPicker onChange={(e) => { props.setColor(e.hex)} } color={props.color} />
      </div>
      )}
    </div>
    );
}