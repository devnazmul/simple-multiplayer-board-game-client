import { useEffect } from 'react';

const AudioPlayer = () => {
  useEffect(() => {
    const audio = new Audio('/audio/background-lobby.ogg');
    audio.autoplay = true;
    audio.loop = true;
    return () => {
      audio.pause();
    };
  }, []);

  return null;
};

export default AudioPlayer;
