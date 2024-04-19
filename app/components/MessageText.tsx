import { Typography } from "@mui/material";
import { DEFAULT_ERROR_MESSAGE } from "../utils/constants";
import { useState } from "react";

interface MessageTextProps {
  message?: string;
}

const MessageText = ({ message = DEFAULT_ERROR_MESSAGE }: MessageTextProps) => {
  const [errorMessage] = useState(message);
  return <Typography variant="h4">{errorMessage}</Typography>;
};

export default MessageText;
