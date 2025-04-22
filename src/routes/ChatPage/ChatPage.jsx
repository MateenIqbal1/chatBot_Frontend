import './chatpage.css';
import NewPrompt from '../../components/newPrompt/NewPrompt';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { useAuth } from '../../context/AuthContext';

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split('/').pop();
  const { isAuthenticated, token } = useAuth(); 

  const { isPending, error, data } = useQuery({
    queryKey: ['Chat', chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      }).then((res) => res.json()),
  });

  if (!isAuthenticated) {
    return <p>Please log in to access the chat.</p>; 
  }
console.log("this is token in chatpage",token)
  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? 'Loading......'
            : error
            ? 'Something went wrong!'
            : data?.history?.map((message, i) => (
                <>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={message.role === 'user' ? 'message user' : 'message'}
                    key={i}
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </>
              ))}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;