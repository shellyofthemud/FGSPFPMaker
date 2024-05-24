import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import './App.css'
import { Form } from 'react-bootstrap';
import { createElement, useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';

function rasterizeSVG(svg) {
  let o = renderToStaticMarkup(svg);
  if (o.indexOf(`http://www.w3.org/2000/svg`) < 0) {
    o = o.replace(/<svg/g, `<svg xmlns="http://www.w3.org/2000/svg"`);
  }
  o = o.replace(/"/g, `'`);
  o = o.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
  o = 'data:image/svg+xml;charset=UTF-8,' + o;
  let img = document.createElement('img');
  img.src = o;
  return img;
}

function createBackgroundSVG(title, name) {
  return (
    <>
      <svg viewBox="0 0 100 100" height="500" width="500" style={{height:500, width:500, border:0}}>
        <defs>
          <path id="topPath" d="M10 50 A 39 39 0 0 1 90 50" pathLength="4" transform="matrix(.92 0 0 .9 4 4)"></path>	
          <path id="bottomPath" d="M50 10 a 41 41 1 1 0 1  0" pathLength="4" transform="matrix(1.02 0 0 1.0 -1.5 0)"></path>
        </defs>
        <circle cx="50" cy="50" r="47" fill="yellow" stroke="red" strokeWidth="5" />
        <text fill="red" textAnchor="middle">
          <textPath id="topText" fontSize="7.7" fontFamily="arial" fontWeight="bold" href="#topPath" startOffset="2" side="right">{title} {name}</textPath>
          <textPath id="bottomText" fontSize="8.5" fontFamily="Georgia" href="#bottomPath" startOffset="2" side="right">FENTANYL GOONING SQUAD</textPath>
        </text>
      </svg>
    </>
  )
}

export default function App() {
  const [image, setImage] = useState('/public/blank_head.jpg');
  const [username, setUsername] = useState('fill-in-the-blank');
  const [title, setTitle] = useState('COMRADE');
  const canvasRef = useRef();  

  const updateCanvas = () => {
    let canv = canvasRef.current;
    let ctx = canv.getContext("2d");

    ctx.clearRect(0, 0, canv.width, canv.height);
    let svg = rasterizeSVG(createBackgroundSVG(title, username))

    svg.decode().then(() => {
      ctx.drawImage(svg, 0, 0, canv.width, canv.height);
      ctx.save();
      let i = document.createElement('img');
      i.src = image;
      i.decode().then(() => {
        ctx.beginPath();
        ctx.arc(canv.width/2, canv.height/2, 118, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(i, 50, 50, 250, 250);
        ctx.restore();
      })
    })
  }

  const updateFile = (event) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
      updateCanvas();
    }
  }

  useEffect(updateCanvas);
 return (
    <main>
      <Stack>
        <div style={{textAlign:"center"}}>
          <canvas ref={canvasRef} width={340} height={340} />
        </div>
        <div style={{backgroundColor:"#fffc"}}>
          <Form>
            <Form.Label style={{textAlign:'center',display:'block',fontWeight:'bold',fontSize:'20px'}}>There are just SIX easy steps to join the Gooning Elite:</Form.Label>

            <Form.Group className='mb-3'>
              <Form.Label>Select a title:&emsp;</Form.Label>
              <Form.Select onChange={(e) => { setTitle(e.target.children[e.target.selectedIndex].innerHTML) } }>
                <option>COMRADE</option>
                <option>COMMANDER</option>
                <option>PRIVATE</option>
                <option>SPACE CADET</option>
                <option>MAJOR</option>
                <option>COMMODORE</option>
                <option>LIEUTENANT</option>
                <option>CHIEF</option>
                <option>GOONERY SGT</option>
                <option>CAPTAIN</option>
                <option>OFFICER</option>
                <option>CAPO</option>
                <option>SOLDIER</option>
                <option>CORPORAL</option>
                <option>BOMBARDIER</option>
                <option>PFC</option>
                <option>UNDERBOSS</option>
                <option>CONSIGLIERE</option>
                <option>ASSOCIATE</option>
                <option>GODFATHER</option>
                <option>TECHNICIAN</option>
                <option>Create your own!</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Type your username: </Form.Label>
              <Form.Control onChange={(e) => { setUsername(e.target.value); }} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Upload your profile picture </Form.Label>
              <Form.Control type='file' onChange={updateFile} />
            </Form.Group>
          </Form>
        </div>
      </Stack>
    </main>
  )
}
