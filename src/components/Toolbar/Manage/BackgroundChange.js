import React, { useState, useEffect, useCallback } from 'react';
import { Box, ListItem, Paper, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import randomShapeBackground from '../../../Image/randomShapeBackground.png';
import whiteRectBackground from '../../../Image/whiteRectBackground.png';
import greenRect from '../../../Image/greenRect.jpg';
import line from '../../../Image/line.png';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: 'calc(98vh - 80px)', /* 設置最大高度 */
    overflowY: 'auto', /* 啟用垂直滾動條 */
    // overflowX: 'hidden', /* 禁用水平滾動條 */
    "&::-webkit-scrollbar": {
      width: '10px', /* 滾動條寬度 */
    },
    scrollbarWidth: 'thin', /* 滾動條寬度（Firefox支援） */
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: '#888', /* 滾動條顏色 */
      borderRadius: '6px', /* 圓角 */
      transition: 'background-color 1.2s ease', /* 顏色漸變動畫 */
    },
    "&:hover::-webkit-scrollbar-thumb": {
      backgroundColor: '#555', /* 滑鼠懸停時滾動條顏色改變 */
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: 'transparent', /* 滾動條背景顏色 */
    },
  },
}));

export default function BackgroundChange({ onBackgroundChange }) {
  const [background, setBackground] = useState('');
  const classes = useStyles();

  useEffect(() => {
    onBackgroundChange(background);
  }, [background]);
  
  const handleBackgroundChange = (bg) => {
    setBackground(bg);
  };

  return (
    <Paper className={classes.root} elevation={8} onWheel={e => e.stopPropagation()}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <br/>
        <Typography sx={{ alignSelf: 'center' }} gutterBottom variant="h4" component="div">背景選擇</Typography>
        <div className={classes.listContainer}>
          <Card sx={{ maxWidth: 345, width: '80%',mr: 1, ml: 1, mb: 2, border: '1px solid #D3D3D3', flexShrink: 0 }}>
            <CardActionArea onClick={() => handleBackgroundChange('line')}>
              <CardMedia
                component="img"
                height="100"
                image={line}
                alt="randomShape"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  簡單線條
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ maxWidth: 345,  width: '80%', mr: 1, ml: 1, mb: 2, border: '1px solid #D3D3D3', flexShrink: 0 }}>
            <CardActionArea onClick={() => handleBackgroundChange('randomShapeBackground')}>
              <CardMedia
                component="img"
                height="100"
                image={randomShapeBackground}
                alt="randomShape"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  簡單圖形
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ maxWidth: 345, width: '80%', mr: 1, ml: 1, mb: 2, border: '1px solid #D3D3D3', flexShrink: 0 }}>
            <CardActionArea onClick={() => handleBackgroundChange('whiteRectBackground')}>
              <CardMedia
                component="img"
                height="100"
                image={whiteRectBackground}
                alt="whiteRect"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  白色方形
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ maxWidth: 345, width: '80%', mr: 1, ml: 1, mb: 2, border: '1px solid #D3D3D3', flexShrink: 0 }}>
            <CardActionArea onClick={() => handleBackgroundChange('greenRect')}>
              <CardMedia
                component="img"
                height="100"
                image={greenRect}
                alt="greenRect"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  綠色網格
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </Box>
    </Paper>
  );
}