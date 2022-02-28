import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { getArticles } from "../utitlity/api";
import { DataGrid } from "@mui/x-data-grid";
import { useDebouncedCallback } from "use-debounce";
import { Divider } from "@mui/material";

const columns = [
  { field: "id", headerName: "Article ID", width: 90, type: "number" },
  { field: "title", headerName: "Title", width: 200 },
  { field: "upvotes", headerName: "Upvote", width: 130, type: "number" },
  { field: "date", headerName: "Date", width: 150, type: "date" },
  { field: "author", headerName: "Author", width: 120 },
];
const warnMsgList = [
  "It contains at least one lowercase English character.",
  "It contains at least one uppercase English character.",
  "It contains at least one digit.",
  "It contains at least one special character. The special characters are: !@#$%^&*()-+",
  "Its length is at least 6",
];

export default function Home() {
  const [textVal, setTextVal] = React.useState("");
  const [warnMsg, setWarnMsg] = React.useState([]);
  const [rowsTemp, setRowsTemp] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [sortModel, setSortModel] = React.useState([
    { field: "id", sort: "asc" },
  ]);
  const atleastOneLowerCase = /(?=.*[a-z])/;
  const atleastOneUpperCase = /(?=.*[A-Z])/;
  const atleastOneDigit = /(?=.*[0-9])/;
  const atleastOneSpecialChar = /(?=.*[!@#\$%^&\*\(\)\-\+])/;
  const atleastSixChars = /(?=.{6,})/;

  React.useEffect(() => {
    const data = getArticles();
    const actualData = data.map((v) => {
      v.date = new Date(v.date);
      return v;
    });
    setRows(actualData);
    setRowsTemp(actualData);
  }, []);

  const handlePwdChange = useDebouncedCallback((e) => {
    const value = e?.target?.value;
    StrengthChecker(value);
  }, 500);

  function StrengthChecker(PasswordParameter) {
    setWarnMsg([]);
    if (!atleastOneLowerCase.test(PasswordParameter)) {
      setWarnMsg((arr) => [...arr, warnMsgList[0]]);
    }
    if (!atleastOneUpperCase.test(PasswordParameter)) {
      setWarnMsg((arr) => [...arr, warnMsgList[1]]);
    }
    if (!atleastOneDigit.test(PasswordParameter)) {
      setWarnMsg((arr) => [...arr, warnMsgList[2]]);
    }
    if (!atleastOneSpecialChar.test(PasswordParameter)) {
      setWarnMsg((arr) => [...arr, warnMsgList[3]]);
    }
    if (!atleastSixChars.test(PasswordParameter)) {
      setWarnMsg((arr) => [...arr, warnMsgList[4]]);
    }
  }

  const handleOnChange = (e) => {
    setTextVal(e?.target?.value);
    if (e?.target?.value?.length < 2) {
      setRows(rowsTemp);
    }
  };
  const handleOnClick = (e) => {
    console.log(textVal);
    //Api call
    if (textVal.length > 2) {
      const authorDetails = rows.filter((v) =>
        v.author.toLowerCase().includes(textVal.toLowerCase())
      );
      setRows(authorDetails);
    }
  };

  const handleNewest = () => {
    setSortModel([{ field: "date", sort: "desc" }]);
  };

  const handleTop = () => {
    setSortModel([{ field: "upvotes", sort: "desc" }]);
  };

  return (
    <Box>
      <TextField
        fullWidth
        onChange={(e) => handlePwdChange(e)}
        id="filled-basic"
        label="Password Checker"
        variant="filled"
      />
      <Box>
        {warnMsg.map((v, ind) => (
          <Box key={ind} color="red">
            {v}
          </Box>
        ))}
      </Box>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Box mb={2} justifyContent="center">
        <TextField
          sx={{ minWidth: 280 }}
          value={textVal}
          onChange={handleOnChange}
          id="filled-basic"
          label="Search for author ..."
          variant="filled"
        />
        <Button
          sx={{ ml: 2 }}
          disabled={textVal?.length < 2}
          onClick={handleOnClick}
          variant="outlined"
        >
          Filter
        </Button>
        <Box display="inline-flex" ml={2} mt={1}>
          <Button
            sx={{ ml: 2, mt: 1 }}
            onClick={handleNewest}
            variant="outlined"
          >
            Newest
          </Button>
          <Button sx={{ ml: 2, mt: 1 }} onClick={handleTop} variant="outlined">
            Top
          </Button>
        </Box>
      </Box>
      <Box style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          sortModel={sortModel}
        />
      </Box>
    </Box>
  );
}
