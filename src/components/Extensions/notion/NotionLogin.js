import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
 
const NotionLogin = () => {
  const [redirectUri, setRedirectUri] = useState('');

  useEffect(() => {
    const fetchEnvVars = async () => {
      const notionAuthUrl = await window.electronAPI.getEnvVar("OAUTH_REDIRECT_URI");
      setRedirectUri(notionAuthUrl);
    };

    fetchEnvVars();
  }, []);

  const handleLogin = async () => {
    console.log("handleOauth", redirectUri);
    await window.electronAPI.openUrl(redirectUri); // 使用預設瀏覽器打開OAuth URL
  };

  return (
    <Button sx={{ mt: '8px', alignSelf: 'center' }} variant="contained" onClick={handleLogin} disabled={!redirectUri} startIcon={<ChromeReaderModeIcon />} >登入 Notion</Button>
  );
};

export default NotionLogin;
