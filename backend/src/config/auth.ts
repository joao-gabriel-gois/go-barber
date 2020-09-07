export default {
  jwt: {
    secret: process.env.APP_SECRET || 'none',
    expiresIn: '1d',
  }
}
