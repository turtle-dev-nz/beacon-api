declare global {
  namespace Express {
    interface Request {
      scanId?: string;
    }
  }
}

export {};
