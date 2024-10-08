import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { createElement, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import { SketchPicker } from "react-color";
import "./ExpandableColorPicker.jsx";
import "./App.css";
import ExpandableColorPicker from "./ExpandableColorPicker.jsx";

function rasterizeSVG(svg) {
  let o = renderToStaticMarkup(svg);
  if (o.indexOf(`http://www.w3.org/2000/svg`) < 0) {
    o = o.replace(/<svg/g, `<svg xmlns="http://www.w3.org/2000/svg"`);
  }
  o = o.replace(/"/g, `'`);
  o = o.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
  o = "data:image/svg+xml;charset=UTF-8," + o;
  let img = document.createElement("img");
  img.src = o;
  return img;
}

function createBackgroundSVG(title, name, options) {
  let currentBrowser;
  let side;
  if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
    currentBrowser = "Google Chrome";
  } else if (window.navigator.userAgent.indexOf("Firefox") !== -1) {
    currentBrowser = "Mozilla Firefox";
  } else if (window.navigator.userAgent.indexOf("MSIE") !== -1) {
    currentBrowser = "Internet Exployer";
  } else if (window.navigator.userAgent.indexOf("Edge") !== -1) {
    currentBrowser = "Edge";
  } else if (window.navigator.userAgent.indexOf("Safari") !== -1) {
    currentBrowser = "Safari";
  } else if (window.navigator.userAgent.indexOf("Opera") !== -1) {
    currentBrowser = "Opera";
  } else if (window.navigator.userAgent.indexOf("Opera") !== -1) {
    currentBrowser = "YaBrowser";
  }

  switch (currentBrowser) {
    case "Mozilla Firefox":
      side = "left";
      break;

    default:
      side = "right";
  }

  return (
    <>
      <svg
        viewBox="0 0 100 100"
        height="500"
        width="500"
        style={{ height: 500, width: 500, border: 0 }}
      >
        <defs>
          <path
            id="topPath"
            d="M10 50 A 39 39 0 0 1 90 50"
            pathLength="4"
            transform="matrix(.92 0 0 .9 4 4)"
          ></path>
          <path
            id="bottomPath"
            d="M50 10 a 41 41 1 1 0 1  0"
            pathLength="4"
            transform="matrix(1.02 0 0 1.0 -1.5 0)"
          ></path>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill={options.fgColor}
          stroke={options.bgColor}
          strokeWidth="5"
        />
        <text fill={options.textColor} textAnchor="middle">
          <textPath
            id="topText"
            fontSize="7.7"
            fontFamily="arial"
            fontWeight="bold"
            href="#topPath"
            startOffset="2"
            side={side}
          >
            {title} {name}
          </textPath>
          <textPath
            id="bottomText"
            fontSize="8.5"
            fontFamily="Georgia"
            href="#bottomPath"
            startOffset="2"
            side={side}
          >
            FENTANYL GOONING SQUAD
          </textPath>
        </text>
      </svg>
    </>
  );
}

export default function App() {
  const [image, setImage] = useState("/blank_head.jpg");
  const [username, setUsername] = useState("fill-in-the-blank");
  const [title, setTitle] = useState("COMRADE");
  const [customTitle, setCustomTitle] = useState("");
  const [customization, setCustomization] = useState({
    isMenuOpen: false,
    bgColor: "#ff0000ff",
    fgColor: "#ffff05ff",
    textColor: "#ff0000ff",
  });
  const canvasRef = useRef();

  const updateCanvas = () => {
    let canv = canvasRef.current;
    let ctx = canv.getContext("2d");

    // ctx.clearRect(0, 0, canv.width, canv.height);
    let svg = rasterizeSVG(
      createBackgroundSVG(
        title == "Create your own!" ? customTitle : title,
        username,
        customization
      )
    );

    svg.decode().then(() => {
      ctx.drawImage(svg, 0, 0, canv.width, canv.height);
      ctx.save();
      let i = document.createElement("img");
      i.src = image;
      i.decode().then(() => {
        ctx.beginPath();
        ctx.arc(canv.width / 2, canv.height / 2, 118, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(i, 50, 50, 240, 240);
        ctx.restore();
      });
    });
  };

  const updateFile = (event) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
      updateCanvas();
    };
  };

  useEffect(updateCanvas);
  return (
    <main>
      <Stack>
        <div style={{ textAlign: "center" }}>
          <canvas
            style={{ width: "100%", maxWidth: "340px" }}
            ref={canvasRef}
            width={340}
            height={340}
          />
        </div>
        <div style={{ backgroundColor: "#161d2d" }}>
          <Form id="OptionsForm">
            <Row
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCustomization({
                  ...customization,
                  isMenuOpen: !customization.isMenuOpen,
                });
              }}
            >
              <Form.Label
                style={{
                  textAlign: "center",
                  width: "100%",
                  fontWeight: "bold",
                  cursor: "inherit",
                }}
              >
                {(customization.isMenuOpen && <>&and;</>) || <>&or;</>}
                Advanced Options
              </Form.Label>
            </Row>

            {(customization.isMenuOpen && (
              <>
                <Row>
                  <Col>
                    <Form.Label>Foreground color</Form.Label>
                  </Col>
                  <Col><ExpandableColorPicker color={customization.fgColor} setColor={(e) => {console.log(e);setCustomization({...customization,fgColor:e});}} /></Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Background color</Form.Label>
                  </Col>
                  <Col><ExpandableColorPicker color={customization.bgColor} setColor={(e) => {setCustomization({...customization,bgColor:e});}} /></Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Text color</Form.Label>
                  </Col>
                  <Col><ExpandableColorPicker color={customization.textColor} setColor={(e) => {setCustomization({...customization,textColor:e});}} /></Col>
                </Row>
              </>
            )) || (
              <>
                <Row>
                  <Form.Label
                    style={{
                      textAlign: "center",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    There are just SIX easy steps to join the Gooning Elite:
                  </Form.Label>
                </Row>

                <Row>
                  <Col>
                    <Form.Label>1) Upload your profile picture </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control type="file" onChange={updateFile} />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label>2) Select a title:&emsp;</Form.Label>
                  </Col>
                  <Col>
                    <Form.Select
                      onChange={(e) => {
                        setTitle(
                          e.target.children[e.target.selectedIndex].innerHTML
                        );
                      }}
                    >
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
                  </Col>
                </Row>

                {title == "Create your own!" && (
                  <Row>
                    <Col>
                      <Form.Label>Custom title</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        onChange={(e) => {
                          setCustomTitle(e.target.value);
                        }}
                      ></Form.Control>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col>
                    <Form.Label>3) Type your username: </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      maxLength={15}
                      width="90%"
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label>
                      4) Right click &gt; Save Image on the image above or click
                      the button to the right
                    </Form.Label>
                  </Col>
                  <Col>
                    <Button
                      onClick={(e) => {
                        let link = document.createElement("a");
                        link.href = canvasRef.current.toDataURL();
                        link.download = "badge.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Form.Label style={{ textAlign: "center", width: "100%" }}>
                    5) Upload your new profile picture and tag @redcloak__ on
                    threads!
                  </Form.Label>
                </Row>

                <Row style={{ display: "flex" }}>
                  <Col style={{ width: "10%" }}>
                    <Form.Label style={{ textAlign: "center", width: "100%" }}>
                      <p style={{ display: "block" }}>6)</p>
                    </Form.Label>
                  </Col>
                  <Col style={{ width: "90%" }}>
                    <Form.Label style={{ textAlign: "center", width: "100%" }}>
                      <marquee
                        style={{ display: "block", height: "100%" }}
                        scrollDelay="40"
                        trueSpeed="true"
                      >
                        <p style={{ fontSize: "64px", margin: "16px 0" }}>
                          GO FORTH AND GOON
                        </p>
                      </marquee>
                    </Form.Label>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </div>
      </Stack>
    </main>
  );
}
