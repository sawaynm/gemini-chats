import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

let messages = [];

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        res.status(200).json(messages);
        break;

      case 'POST':
        const form = new formidable.IncomingForm();
        form.uploadDir = path.join(process.cwd(), '/public/uploads');
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
          if (err) {
            res.status(500).json({ error: 'Error parsing the files' });
            return;
          }

          const { message } = fields;
          const newMessage = { id: messages.length + 1, message, attachment: files.attachment ? files.attachment.newFilename : null };
          messages.push(newMessage);
          res.status(201).json(newMessage);
        });
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
