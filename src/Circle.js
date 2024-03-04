import React from 'react'
import {
    Paper,
    Box,
    Typography
} from '@mui/material'

function Circle({ text, color}) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={150}
            width={150}
            margin='auto'
        >
            <Paper
                elevation={4}
                sx={{
                    height: 150,
                    width: 150,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: color,
                    color: 'white'
                }}
            >
                <Typography variant="h3">{text}</Typography>
            </Paper>
        </Box>
    )
}

export default Circle