import React, { useState, useEffect, Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { getCurrentUsername } from "../service/utils";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import ClassroomService from "../service/classroom";
import socketIOClient from "socket.io-client";

import UserList from "./UserList";
import ToolsPanel from "./ToolsPanel";
import ChatDrawer from "./ChatDrawer";

import styles from "../assets/styles/dashboardStyles";
const useStyles = makeStyles(styles);

// const socket = socketIOClient("http://localhost:4010"); //development;

const socket = socketIOClient(); //production

export default function Classroom() {
  const classes = useStyles();
  const { uid } = useParams();
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [permitted, setPermitted] = useState(false);

  useEffect(() => {
    ClassroomService.checkPermission(uid).then(
      () => {
        setCheckingPermission(false);
        setPermitted(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setErrorMessage(resMessage);
        setCheckingPermission(false);
        setPermitted(false);
      }
    );
  }, [uid]);

  return (
    <React.Fragment>
      <main className={classes.content}>
        <CssBaseline />
        <div className={classes.centre}>
          {checkingPermission && <CircularProgress />}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </div>
      </main>
      {permitted && <Board uid={uid} username={getCurrentUsername()} />}
    </React.Fragment>
  );
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      drawing: false,
      currentColor: "red",
      lineWidth: 2,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      cleared: false,
      username: null,
      room: null,
      userList: [],
      chatMobileOpen: false,
      messages: [],
    };

    this.whiteboard = React.createRef();

    socket.emit("join", {
      username: this.props.username,
      room: this.props.room,
    });

    socket.on("joined", (joined) => {
      this.setState({
        id: joined.id,
        username: joined.username,
        room: joined.room,
      });
    });

    socket.on("users", (users) => {
      this.setState({
        userList: users,
      });
    });

    socket.on("cleared", () => {
      this.state.whiteboard
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.drawGrid();
    });

    socket.on("drawing", (data) => {
      let w = window.innerWidth;
      let h = window.innerHeight;
      if (!isNaN(data.x0 / w) && !isNaN(data.y0)) {
        this.drawLine(
          data.x0 * w,
          data.y0 * h,
          data.x1 * w,
          data.y1 * h,
          data.color,
          data.width
        );
      }
    });

    socket.on("message", (message) => {
      this.setState((prevState) => {
        return {
          ...prevState,
          messages: [...prevState.messages, message],
        };
      });
    });
  }

  componentDidMount() {
    this.setState({
      whiteboard: this.whiteboard.current,
    });
    this.whiteboard.current.style.height = window.innerHeight;
    this.whiteboard.current.style.width = window.innerWidth;

    this.whiteboard.current.addEventListener(
      "mousedown",
      this.onMouseDown,
      false
    );
    this.whiteboard.current.addEventListener("mouseup", this.onMouseUp, false);
    this.whiteboard.current.addEventListener("mouseout", this.onMouseUp, false);
    this.whiteboard.current.addEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 5),
      false
    );

    this.whiteboard.current.addEventListener(
      "touchstart",
      this.onMouseDown,
      false
    );

    this.whiteboard.current.addEventListener(
      "touchmove",
      this.throttle(this.onTouchMove, 5),
      false
    );

    this.whiteboard.current.addEventListener("touchend", this.onMouseUp, false);

    this.drawGrid();
  }

  drawGrid = () => {
    let context = this.whiteboard.current.getContext("2d");

    var data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> 
        <defs> 
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse"> 
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5" /> 
            </pattern> 
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> 
                <rect width="80" height="80" fill="url(#smallGrid)" /> 
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" /> 
            </pattern> 
        </defs> 
        <rect width="100%" height="100%" fill="url(#grid)" /> 
    </svg>`;

    let DOMURL = window.URL || window.webkitURL || window;

    let img = new Image();
    let svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    let url = DOMURL.createObjectURL(svg);

    img.onload = function () {
      context.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
    };
    img.src = url;
  };

  drawLine = (x0, y0, x1, y1, color, width, emit) => {
    let context = this.state.whiteboard.getContext("2d");
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
    context.closePath();
    if (!emit) {
      return;
    }
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.setState(() => {
      if (!isNaN(x0 / w)) {
        socket.emit("drawing", {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color,
          width,
          room: this.state.room,
        });

        return {
          cleared: false,
        };
      }
    });
  };

  sendMessage = (message) => {
    socket.emit("message", {
      message,
      username: this.state.username,
      room: this.state.room,
    });
  };

  onMouseDown = (e) => {
    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY,
        drawing: true,
      };
    });
  };

  onMouseUp = (e) => {
    this.setState(() => {
      return {
        drawing: false,
        currentX: e.clientX,
        currentY: e.clientY,
      };
    });
  };

  onMouseMove = (e) => {
    if (!this.state.drawing) {
      return;
    }

    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY,
      };
    }, this.drawLine(this.state.currentX, this.state.currentY, e.clientX, e.clientY, this.state.currentColor, this.state.lineWidth, true));
  };

  onTouchMove = (e) => {
    if (!this.state.drawing) {
      return;
    }
    this.setState(() => {
      this.drawLine(
        this.state.currentX,
        this.state.currentY,
        e.touches[0].clientX,
        e.touches[0].clientY,
        this.state.currentColor,
        this.state.lineWidth,
        true
      );
      return {
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY,
      };
    });
  };

  throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function () {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  selectColor = (color) => {
    this.setState(() => {
      return {
        currentColor: color.hex,
      };
    });
  };

  setLineWidth = (width) => {
    this.setState(() => {
      return {
        lineWidth: width,
      };
    });
  };

  toggleChatDrawer = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        chatMobileOpen: !prevState.chatMobileOpen,
      };
    });
  };

  clearBoard = () => {
    socket.emit("clear", this.state.room);
  };

  leave = () => {
    socket.emit("leaveroom", { id: this.state.id, room: this.state.room });
  };

  render() {
    return (
      <div>
        <canvas
          height={`${this.state.windowHeight}px`}
          width={`${this.state.windowWidth}px`}
          ref={this.whiteboard}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
          }}
        />
        <ChatDrawer
          messages={this.state.messages}
          chatMobileOpen={this.state.chatMobileOpen}
          toggleChatDrawer={this.toggleChatDrawer}
          sendMessage={this.sendMessage}
        />
        <UserList userList={this.state.userList} />
        <ToolsPanel
          clearBoard={this.clearBoard}
          currentColor={this.state.currentColor}
          selectColor={this.selectColor}
          setLineWidth={this.setLineWidth}
          toggleChatDrawer={this.toggleChatDrawer}
          leave={this.leave}
        />
      </div>
    );
  }
}
