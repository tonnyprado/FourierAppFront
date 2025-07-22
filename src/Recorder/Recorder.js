import React, { useState, useRef } from 'react';
import axios from 'axios';

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
      await processAudio(audioBlob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const processAudio = async (audioBlob) => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0); // Solo canal izquierdo
    const signal = Array.from(channelData); // Convertir Float32Array a array plano

    try {
      const response = await axios.post('http://localhost:8080/api/fourier', signal, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Resultado FFT:', response.data);
    } catch (error) {
      console.error('Error al enviar el audio al backend:', error);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Grabador de Audio</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isRecording ? 'Detener' : 'Grabar'}
      </button>
    </div>
  );
};

export default Recorder;
