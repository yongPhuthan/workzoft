import mongoose from 'mongoose';
import uid from 'uid-promise';
import connectDb from '../../lib/db'; 
import type { NextApiRequest, NextApiResponse } from 'next'

interface SyscallError extends Error {
    syscall?: string;
  }

let Page : any;

try {
  Page = mongoose.model('Page');
} catch {
  Page = mongoose.model('Page', new mongoose.Schema({
    page: String,
    sessionId: String,
    html: String,
  }));
}

connectDb(); 

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  let {
    query: { page },
    cookies: { token, linkToken }
  } = req;

  if (!page) {
    res.status(400).json({ message: 'Bad Request: provide a page to query' });
    return;
  }

  if (page === 'www') {
    res.status(200).json({ html: null });
    return;
  }

  let sessionId;

  if (linkToken) {
    sessionId = linkToken;
    res.setHeader('Set-Cookie', `token=${linkToken}`);
  } else if (token && !linkToken) {
    sessionId = token;
    res.setHeader('Set-Cookie', `token=${token}`);
  } else {
    try {
      sessionId = await uid(10);
      token = sessionId;
      res.setHeader('Set-Cookie', `token=${token}`);
    } catch (e) {
        const error = e as Error;
        
        console.error({ stack: error.stack, message: error.message });
        res.status(500).json({ stack: error.stack, message: error.message });
        return;
      }
  }

  try {
    const result = await Page.findOne({ page: page });

    if (result) {
      if (result.sessionId === sessionId) {
        // res.status(200).json({ page,html: result.html, allowEdit: true, token });
        return;
      } else {
        res.status(200).json({page, html: result.html, allowEdit: false, token });
        return;
      }
    } else {
      res.status(404).json({ message: "Page not found", token });
      return;
    }
  } catch (error) {
    const err = error as SyscallError;
    
    if (err.syscall === 'getaddrinfo') {
      res.status(500).json({
        stack: err.stack,
        message: 'There was a network error, please check connection and try again'
      });
      return;
    } else {
      console.error({ err });
      res.status(500).json({ stack: err.stack, message: err.message });
      return;
    }
  }
};

export default handleRequest;
