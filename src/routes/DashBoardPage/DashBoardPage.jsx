import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

const DashboardPage = () => {
  const { token } = useAuth(); 
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ text }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Authentication failed or server error");
          }
          return res.json();
        })
        .catch((error) => {
          console.error("Error during mutation:", error.message);
        });
    },
    onSuccess: (data) => {
      const chatId = data || data.chatId; 
      if (chatId) {
        queryClient.invalidateQueries({ queryKey: ["userChats"] });
        navigate(`/dashboard/chats/${chatId}`); 
      } else {
        console.error("Chat ID missing in response:", data);
      }
    },
    onError: (error) => {
      console.error("Error in mutation:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    mutation.mutate(text);
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>LAMA AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="Chat" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="Image" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="Code" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button type="submit">
            <img src="/arrow.png" alt="Submit" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
