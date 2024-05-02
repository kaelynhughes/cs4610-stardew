import { useEffect, useState } from "react";
import { useApi } from "./utils/use_api";
import { requireLogin } from "./utils/require_login";
import { io } from "socket.io-client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  TextField,
  styled,
} from "@mui/material";

export const Chat = () => {
  requireLogin();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sourceId, setSourceId] = useState();

  const api = useApi();

  function save() {
    const toSend = { message: message, source: sourceId };
    const toKeep = { message: message, source: sourceId };
    socket.emit("message", toSend);
    setMessages([...messages, toKeep]);

    setMessage("");
  }

  const Item = styled(Paper)(({ theme, origin }) => ({
    ...theme.typography.body2,
    padding: 4,
    margin: 4,
    textAlign: origin ? "right" : "left",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary,
    height: 60,
    lineHeight: "60px",
  }));

  useEffect(() => {
    const s = io();
    setSocket(s);
    s.on("connect", () => {
      setSourceId(s.id);
    });
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const callback = (messageReceived) => {
      if (messageReceived.source != sourceId) {
        setMessages([...messages, messageReceived]);
      }
    };
    socket.on("newMessage", callback);
    return () => {
      socket.off("newMessage", callback);
    };
  }, [socket, messages]);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <CardHeader title="Chat" />
        <CardContent>
          <Grid container>
            {messages.map((message, index) => (
              <Grid item sx={{ pb: 2 }} xs={12}>
                <Item origin={sourceId == message.source}>
                  {message.message}
                </Item>
              </Grid>
            ))}
            <Grid item sx={{ pb: 2 }} xs={12}>
              <TextField
                type="text"
                key="inputMessage"
                placeholder="New message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
            <Grid item sx={{ pb: 2 }} xs={12}>
              <Button
                type="submit"
                key="submitMessage"
                variant="contained"
                onClick={save}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
