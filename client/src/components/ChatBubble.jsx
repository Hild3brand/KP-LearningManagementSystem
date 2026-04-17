const ChatBubble = ({ message, sender }) => {
  const isUser = sender === "user";

  const formatMessage = (text) => {
    return text
      // bold **text**
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // bullet list
      .replace(/^- (.*)$/gm, "<li>$1</li>")
      // wrap <li> jadi <ul>
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
      // line break
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className={`d-flex ${isUser ? "justify-content-end" : "justify-content-start"} mb-2`}>
      <div
        className={`px-3 py-2 ${
          isUser
            ? "bg-primary text-white rounded-4"
            : "bg-light border rounded-4"
        }`}
        style={{
          maxWidth: "70%",
          wordBreak: "break-word",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
        dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
      />
    </div>
  );
};

export default ChatBubble;