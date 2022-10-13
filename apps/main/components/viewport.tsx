import {useRef, useState, useEffect} from 'react';
import {useViewer} from '../hooks/use-viewer';
import io from 'Socket.IO-client';
let socket;

type ViewportProps = {};

const Viewport: React.FC<ViewportProps> = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {initViewer} = useViewer();

  useEffect(() => {
    if (canvasRef.current) {
      initViewer(canvasRef.current);
    }
  }, [initViewer]);

  useEffect(() => {
    const connectWs = async () => {
      await fetch('/api/ws');
      socket = io();

      socket.on('connect', () => {
        console.log('connected to ws');
      });

      socket.on('set-data', msg => {
        console.log(msg);
        console.log('update');
      });
    };

    connectWs();
    return () => {
      // for unmouning
    };
  }, []);

  return (
    <>
      <div
        id="viewport"
        style={{background: '#eee', width: '100%', height: '400px'}}
        ref={canvasRef}
      ></div>
    </>
  );
};

export default Viewport;
