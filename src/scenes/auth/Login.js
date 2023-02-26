import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApi";
import usePersist from "../../hooks/usePersist";

function Login() {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/managment");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <PulseLoader color="#FFF" />;

  const content = (
    <Box m="3rem 2.5rem">
      <Box>
        <Typography variant="h1"> Login</Typography>
      </Box>
      <Box>
        <Typography ref={errRef} variant="subtitle1" role="alert">
          {errMsg}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            id="username"
            inputRef={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={handlePwdInput}
            required
            fullWidth
            margin="normal"
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormControlLabel
              control={
                <Checkbox
                  id="persists"
                  checked={persist}
                  onChange={handleToggle}
                />
              }
              label="Trust This Device"
            />
            <Button type="submit" variant="contained" color="primary">
              Sign In
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );

  return content;
}

export default Login;
