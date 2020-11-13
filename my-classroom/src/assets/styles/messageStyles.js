const styles = (theme) => ({
  myMessageContainer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 5%",
    marginTop: "3px",
  },
  othersMessageContainer: {
    display: "flex",
    justifyContent: "flex-start",
    padding: "0 5%",
    marginTop: "3px",
  },
  messageBox: {
    background: "#494973",
    borderRadius: "20px",
    padding: "5px 20px",
    color: "white",
    display: "inline-block",
    maxWidth: "80%",
  },
  messageText: {
    width: "100%",
    letterSpacing: 0,
    float: "left",
    fontSize: "1.1em",
    wordWrap: "break-word",
  },
  sentText: {
    display: "flex",
    alignItems: "center",
    fontFamily: "Helvetica",
    color: "#828282",
    letterSpacing: "0.3px",
    paddingRight: "6px",
  },
  receivedText: {
    display: "flex",
    alignItems: "center",
    fontFamily: "Helvetica",
    color: "#828282",
    letterSpacing: "0.3px",
    paddingLeft: "6px",
  },
  messages: {
    padding: "5% 0",
    overflow: "auto",
    flex: "auto",
  },
});

export default styles;

// .messageBox {
//     background: #F3F3F3;
//     border-radius: 20px;
//     padding: 5px 20px;
//     color: white;
//     display: inline-block;
//     max-width: 80%;
//   }

//   .messageText {
//     width: 100%;
//     letter-spacing: 0;
//     float: left;
//     font-size: 1.1em;
//     word-wrap: break-word;
//   }

//   .messageText img {
//     vertical-align: middle;
//   }

//   .messageContainer {
//     display: flex;
//     justify-content: flex-end;
//     padding: 0 5%;
//     margin-top: 3px;
//   }

//   .sentText {
//     display: flex;
//     align-items: center;
//     font-family: Helvetica;
//     color: #828282;
//     letter-spacing: 0.3px;
//   }

//   .pl-10 {
//     padding-left: 10px;
//   }

//   .pr-10 {
//     padding-right: 10px;
//   }

//   .justifyStart {
//     justify-content: flex-start;
//   }

//   .justifyEnd {
//     justify-content: flex-end;
//   }

//   .colorWhite {
//     color: white;
//   }

//   .colorDark {
//     color: #353535;
//   }

//   .backgroundBlue {
//     background: #2979FF;
//   }

//   .backgroundLight {
//     background: #F3F3F3;
//   }
