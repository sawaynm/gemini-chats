import { connectToDatabase } from '../../utils/db';

export default async function handler(req, res) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();

    switch (method) {
      case 'GET':
        const messages = await db.collection('messages').find({}).toArray();
        res.status(200).json(messages);
        break;

      case 'POST':
        const { message } = req.body;
        const newMessage = await db.collection('messages').insertOne({ message });
        res.status(201).json(newMessage);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
