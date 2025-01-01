let messages = [];

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        res.status(200).json(messages);
        break;

      case 'POST':
        const { message } = req.body;
        const newMessage = { id: messages.length + 1, message };
        messages.push(newMessage);
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
