const drawerWidth = 290;

const toolsPanelStyles = (theme) => ({
  appBar: {
    top: "auto",
    bottom: 0,
    [theme.breakpoints.up("sm")]: {
      right: drawerWidth,
    },
    background: "transparent",
    boxShadow: "none",
  },
  grow: {
    flexGrow: 1,
  },
  root: {
    backgroundColor: "transparent",
  },
  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "hidden",
  },
  chatButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: {
    minHeight: 80,
  },
});

export default toolsPanelStyles;
