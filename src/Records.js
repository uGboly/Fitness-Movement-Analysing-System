import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Records = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/fitness-data/${localStorage.getItem('userId')}`
        );
        setRecords(response.data);
      } catch (error) {
        console.error("获取健身数据失败:", error);
      }
    };

    fetchRecords();
  }, []);

  function typeTranslate(type) {
    switch (type) {
      case 'push-up':
        return '引体向上'
      case 'pull-up':
        return '俯卧撑'
      case 'squat':
        return '深蹲'
      case 'walk':
        return '行走'
      case 'sit-up':
        return '仰卧起坐'
      default:
        return '未知类型'
    }
  }
  return (
    <TableContainer component={Paper} sx={{ margin: 'auto', width: '50vw' }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>健身动作类型</TableCell>
            <TableCell align="right">分数</TableCell>
            <TableCell align="right">上传时间</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {typeTranslate(row.type)}
              </TableCell>
              <TableCell align="right">{row.score}</TableCell>
              <TableCell align="right">
                {new Date(row.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Records;
