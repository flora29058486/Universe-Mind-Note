import React, { useState } from "react";
import { Drawer, makeStyles, Button, TreeView, TreeItem } from "@mui/material";

const useStyles = makeStyles({
  drawer: {
    flexShrink: 0,
    width: "15%",
    "& .MuiDrawer-paper": {
      width: "15%",
      boxSizing: "border-box",
      overflowX: "hidden",
      marginTop: "64px"
    }
  }
});

const App = () => {
  const classes = useStyles();
  const [isTreeItemOpen, setIsTreeItemOpen] = useState(false);

  const handleTreeItemOpen = () => {
    setIsTreeItemOpen(true);
  };

  const handleTreeItemClose = () => {
    setIsTreeItemOpen(false);
  };

  return (
    <>
    {/* 在你的佈局中，將 Drawer 置於畫面左側 */}
      <Drawer
        variant="persistent"
        anchor="left"
        open
        className={classes.drawer}
      >
        {/* 建立打開 Tree Item 的按鈕 */}
        <Button onClick={handleTreeItemOpen}>Open Tree Item</Button>
      </Drawer>

      {/* 在你的佈局中，放置 Tree Item 並設定寬度 */}
      <div style={{ width: "85%", marginLeft: "15%" }}>
        {/* 在這裡放置其他畫面內容 */}
        <TreeView>
          <TreeItem nodeId="1" label="Node 1">
            <TreeItem nodeId="2" label="Node 2">
              <TreeItem nodeId="3" label="Node 3" />
              <TreeItem nodeId="4" label="Node 4" />
            </TreeItem>
            <TreeItem nodeId="5" label="Node 5" />
          </TreeItem>
        </TreeView>
      </div>

      {/* 在這裡放置 Tree Item */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={isTreeItemOpen}
        className={classes.drawer}
        onClose={handleTreeItemClose}
      >
        {/* 在這裡放置 Tree Item 的內容 */}
        <TreeView>
          <TreeItem nodeId="1" label="Node 1">
            <TreeItem nodeId="2" label="Node 2">
              <TreeItem nodeId="3" label="Node 3" />
              <TreeItem nodeId="4" label="Node 4" />
            </TreeItem>
            <TreeItem nodeId="5" label="Node 5" />
          </TreeItem>
        </TreeView>
      </Drawer>
    </>
  );
};

export default App;
