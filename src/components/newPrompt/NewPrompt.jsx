import { IKImage } from 'imagekitio-react';
import Upload from '../upload/Upload';
import './newPrompt.css';
import React, { useEffect, useRef, useState } from 'react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [img, setImg] = useState({ isLoading: false, error: '', dbData: {}, aiData: {} });
  const endRef = useRef(null);
  const formRef = useRef(null);
  const queryClient = useQueryClient();
  const { isAuthenticated, token } = useAuth();

  const chat = model.startChat({
    history: data?.history?.length
      ? data.history.map(({ role, parts }) => ({
          role,
          parts: [{ text: parts[0].text }],
        }))
      : [
          {
            role: 'user',
            parts: [{ text: 'Hello!' }], 
          },
        ],
    generationConfig: {
    },
  });

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [data, question, answer, img.dbData]);

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Chat', data._id] }).then(() => {
        formRef.current.reset();
        setQuestion('');
        setAnswer('');
        setImg({ isLoading: false, error: '', dbData: {}, aiData: {} });
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);
  
    try {
      const inputMessages = [];

if (img.aiData?.inlineData) {
  inputMessages.push({ text: "Here's an image:" });
  inputMessages.push({ inlineData: img.aiData.inlineData });
}

inputMessages.push({ text });

  
      const result = await chat.sendMessageStream(inputMessages);
  
      let accumulatedText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
  
      mutation.mutate();
    } catch (err) {
      console.error('Gemini error:', err);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, [data]);

  if (!isAuthenticated) {
    return <p>Please log in to access the prompt.</p>;
  }

  return (
    <>
      {img.isLoading && <div>Loading....</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form action="" className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false}   hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;